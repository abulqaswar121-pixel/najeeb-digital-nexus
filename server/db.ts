// Persistence layer behind a tiny synchronous Collection<T> API.
//
// Two backends, chosen once at startup:
//   - "file":  one JSON file per collection (local Node process + tests).
//   - "cloud": rows in the managed database table `app_records`, used in
//              production. Each request calls hydrateAll() first (loads the
//              latest rows) and flushAll() last (writes only the rows that
//              request touched), so route code stays synchronous.
//
// Routes never know which backend is active.

type Backend = "file" | "cloud";

function backend(): Backend {
  return (globalThis as { __ndhStorage?: Backend }).__ndhStorage === "cloud" ? "cloud" : "file";
}

// ---------- file backend helpers (lazy so the edge bundle never touches fs) ----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let fsMod: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pathMod: any;
let dataDir = "";

async function initFileBackend() {
  if (fsMod) return;
  fsMod = await import("node:fs");
  pathMod = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const here = pathMod.dirname(fileURLToPath(import.meta.url));
  dataDir = process.env["NDH_DATA_DIR"] || pathMod.join(here, "data");
  if (!fsMod.existsSync(dataDir)) fsMod.mkdirSync(dataDir, { recursive: true });
}
if (backend() === "file") await initFileBackend();

function readFile<T>(name: string): T | undefined {
  const file = pathMod.join(dataDir, `${name}.json`);
  if (!fsMod.existsSync(file)) return undefined;
  try {
    return JSON.parse(fsMod.readFileSync(file, "utf-8")) as T;
  } catch (e) {
    console.error(`[ndh-server] Failed to parse ${name}.json, reseeding defaults`, e);
    return undefined;
  }
}
function writeFile(name: string, value: unknown) {
  fsMod.writeFileSync(pathMod.join(dataDir, `${name}.json`), JSON.stringify(value, null, 2), "utf-8");
}

// ---------- registry for cloud hydrate/flush ----------
interface Persistable {
  name: string;
  hydrate(rows: { id: string; position: number; data: unknown }[]): void;
  drainChanges(): { upserts: { id: string; position: number; data: unknown }[]; deletes: string[] };
}
const registry: Persistable[] = [];
let seq = 0;
const nextPos = (start: boolean) => (start ? -1 : 1) * (Date.now() * 1000 + (seq++ % 1000));

function keyOf(item: unknown): string {
  const o = item as { id?: string; projectId?: string; milestoneIndex?: number };
  if (o.id) return String(o.id);
  if (o.projectId !== undefined) return `${o.projectId}:${o.milestoneIndex}`;
  return JSON.stringify(item);
}

export class Collection<T> {
  private items: T[];
  private positions = new Map<string, number>();
  private dirty = new Set<string>();
  private removed = new Set<string>();

  constructor(
    private name: string,
    private defaults: T[] = [],
  ) {
    if (backend() === "file") {
      const loaded = readFile<T[]>(name);
      this.items = loaded ?? [...defaults];
      if (!loaded) writeFile(name, this.items);
    } else {
      this.items = [...defaults];
      registry.push(this as unknown as Persistable);
    }
  }

  hydrate(rows: { id: string; position: number; data: unknown }[]) {
    this.dirty.clear();
    this.removed.clear();
    this.positions.clear();
    if (rows.length === 0) {
      // First run: seed defaults into the database.
      this.items = [...this.defaults];
      this.items.forEach((item, i) => {
        const k = keyOf(item);
        this.positions.set(k, i);
        this.dirty.add(k);
      });
      return;
    }
    this.items = rows.map((r) => r.data as T);
    rows.forEach((r) => this.positions.set(r.id, r.position));
  }

  drainChanges() {
    const byKey = new Map(this.items.map((i) => [keyOf(i), i]));
    const upserts = [...this.dirty]
      .filter((k) => byKey.has(k))
      .map((k) => ({ id: k, position: this.positions.get(k) ?? 0, data: byKey.get(k) }));
    const deletes = [...this.removed].filter((k) => !byKey.has(k));
    this.dirty.clear();
    this.removed.clear();
    return { upserts, deletes };
  }

  private persist() {
    if (backend() === "file") writeFile(this.name, this.items);
  }

  all(): T[] {
    return this.items;
  }
  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }
  filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  insert(item: T, position: "start" | "end" = "start"): T {
    if (position === "start") this.items.unshift(item);
    else this.items.push(item);
    const k = keyOf(item);
    this.positions.set(k, nextPos(position === "start"));
    this.dirty.add(k);
    this.persist();
    return item;
  }

  update(predicate: (item: T) => boolean, updater: (item: T) => T): T | undefined {
    const index = this.items.findIndex(predicate);
    if (index === -1) return undefined;
    const oldKey = keyOf(this.items[index]);
    this.items[index] = updater(this.items[index] as T);
    const newKey = keyOf(this.items[index]);
    if (newKey !== oldKey) {
      this.removed.add(oldKey);
      this.positions.set(newKey, this.positions.get(oldKey) ?? 0);
    }
    this.dirty.add(newKey);
    this.persist();
    return this.items[index];
  }

  replaceAll(items: T[]) {
    for (const i of this.items) this.removed.add(keyOf(i));
    this.items = items;
    items.forEach((i, idx) => {
      const k = keyOf(i);
      this.positions.set(k, idx);
      this.dirty.add(k);
    });
    this.persist();
  }

  /** Removes every item matching `predicate`. Returns how many were removed. */
  remove(predicate: (item: T) => boolean): number {
    const before = this.items.length;
    this.items = this.items.filter((item) => {
      if (predicate(item)) {
        this.removed.add(keyOf(item));
        return false;
      }
      return true;
    });
    const removed = before - this.items.length;
    if (removed > 0) this.persist();
    return removed;
  }
}

const SINGLETON_ID = "__value__";

export class SingletonRecord<T> {
  private value: T;
  private dirty = false;

  constructor(
    private name: string,
    private defaultValue: T,
  ) {
    if (backend() === "file") {
      const loaded = readFile<T>(name);
      this.value = loaded ?? defaultValue;
      if (loaded === undefined) writeFile(name, this.value);
    } else {
      this.value = defaultValue;
      registry.push(this as unknown as Persistable);
    }
  }

  hydrate(rows: { id: string; data: unknown }[]) {
    const row = rows.find((r) => r.id === SINGLETON_ID);
    this.value = row ? (row.data as T) : this.defaultValue;
    this.dirty = !row;
  }

  drainChanges() {
    const upserts = this.dirty ? [{ id: SINGLETON_ID, position: 0, data: this.value }] : [];
    this.dirty = false;
    return { upserts, deletes: [] as string[] };
  }

  private persist() {
    this.dirty = true;
    if (backend() === "file") writeFile(this.name, this.value);
  }

  get(): T {
    return this.value;
  }
  set(value: T) {
    this.value = value;
    this.persist();
  }
  update(updater: (value: T) => T) {
    this.value = updater(this.value);
    this.persist();
    return this.value;
  }
}

// ---------- cloud hydrate / flush ----------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Admin = any;

export async function hydrateAll(admin: Admin) {
  const { data, error } = await admin
    .from("app_records")
    .select("collection,id,position,data")
    .order("position", { ascending: true })
    .limit(10000);
  if (error) throw new Error(`Failed to load data: ${error.message}`);
  const grouped = new Map<string, { id: string; position: number; data: unknown }[]>();
  for (const row of data ?? []) {
    const list = grouped.get(row.collection) ?? [];
    list.push(row);
    grouped.set(row.collection, list);
  }
  for (const p of registry) p.hydrate(grouped.get(p.name) ?? []);
}

export async function flushAll(admin: Admin) {
  for (const p of registry) {
    const { upserts, deletes } = p.drainChanges();
    if (upserts.length) {
      const { error } = await admin.from("app_records").upsert(
        upserts.map((u) => ({
          collection: p.name,
          id: u.id,
          position: u.position,
          data: u.data,
          updated_at: new Date().toISOString(),
        })),
      );
      if (error) throw new Error(`Failed to save ${p.name}: ${error.message}`);
    }
    if (deletes.length) {
      const { error } = await admin
        .from("app_records")
        .delete()
        .eq("collection", p.name)
        .in("id", deletes);
      if (error) throw new Error(`Failed to delete from ${p.name}: ${error.message}`);
    }
  }
}

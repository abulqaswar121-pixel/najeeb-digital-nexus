import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// A deliberately simple persistence layer: one JSON file per collection,
// loaded into memory on first access and rewritten on every mutation. This
// is a genuine improvement over the previous architecture (browser
// localStorage with zero server involvement) -- data now lives on the
// server, survives across browsers/devices, and is the single source of
// truth that auth/authorization checks run against.
//
// This is NOT a production database. Swapping this module for a real
// Postgres/SQLite connection later is a contained, mechanical change because
// every caller only ever goes through the Collection<T> API below.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Overridable so tests (and any throwaway/ephemeral run) can point at a temp
// directory instead of mutating the real dev/demo data files on disk.
const DATA_DIR = process.env["NDH_DATA_DIR"] || path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class Collection<T> {
  private filePath: string;
  private items: T[];

  constructor(name: string, defaults: T[] = []) {
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(this.filePath)) {
      try {
        this.items = JSON.parse(fs.readFileSync(this.filePath, "utf-8")) as T[];
      } catch (e) {
        console.error(`[ndh-server] Failed to parse ${name}.json, reseeding defaults`, e);
        this.items = [...defaults];
        this.persist();
      }
    } else {
      this.items = [...defaults];
      this.persist();
    }
  }

  private persist() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.items, null, 2), "utf-8");
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
    this.persist();
    return item;
  }

  update(predicate: (item: T) => boolean, updater: (item: T) => T): T | undefined {
    const index = this.items.findIndex(predicate);
    if (index === -1) return undefined;
    this.items[index] = updater(this.items[index] as T);
    this.persist();
    return this.items[index];
  }

  replaceAll(items: T[]) {
    this.items = items;
    this.persist();
  }
}

export class SingletonRecord<T> {
  private filePath: string;
  private value: T;

  constructor(name: string, defaultValue: T) {
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (fs.existsSync(this.filePath)) {
      try {
        this.value = JSON.parse(fs.readFileSync(this.filePath, "utf-8")) as T;
      } catch {
        this.value = defaultValue;
        this.persist();
      }
    } else {
      this.value = defaultValue;
      this.persist();
    }
  }

  private persist() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.value, null, 2), "utf-8");
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

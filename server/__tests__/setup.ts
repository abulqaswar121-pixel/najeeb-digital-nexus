import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Point the server's file-backed DB at a fresh temp directory for every test
// file, so tests never read/write the real dev/demo data in server/data/.
// Must run before any module that imports server/db.ts (collections.ts etc.)
// is loaded, hence this file is listed in vitest.config.ts `setupFiles`.
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ndh-test-db-"));
process.env["NDH_DATA_DIR"] = tempDir;
process.env["SESSION_SECRET"] = "test-secret-not-for-production";

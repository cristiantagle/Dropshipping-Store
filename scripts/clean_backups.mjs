#!/usr/bin/env node
// Mantiene solo los N snapshots más recientes en .backup_global/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIR = path.join(ROOT, '.backup_global');
const KEEP = Number(process.env.KEEP_BACKUPS || 2) || 2;

try {
  if (!fs.existsSync(DIR)) {
    console.log('No .backup_global directory. Nothing to do.');
    process.exit(0);
  }
  const entries = fs.readdirSync(DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ name: d.name, full: path.join(DIR, d.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const toDelete = entries.slice(0, Math.max(0, entries.length - KEEP));
  for (const e of toDelete) {
    fs.rmSync(e.full, { recursive: true, force: true });
    console.log('Removed', e.name);
  }
  const kept = entries.slice(Math.max(0, entries.length - KEEP)).map(e => e.name);
  console.log('Kept:', kept.join(', ') || 'none');
} catch (e) {
  console.error('Cleanup error:', e.message || String(e));
  process.exit(1);
}


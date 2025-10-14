#!/usr/bin/env python3
import sqlite3, json, sys, os

DB = 'database.db'
if not os.path.exists(DB):
    print(f"database file not found: {DB}")
    sys.exit(1)

try:
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cur.fetchall()]
    print("Tables:", tables)

    for t in ['Product', 'products', 'Products']:
        if t in tables:
            print(f"\nSample rows from table '{t}':")
            try:
                cur.execute(f"SELECT id, name, image_url, images, created_at FROM {t} LIMIT 5")
                rows = cur.fetchall()
                for r in rows:
                    # Truncate long fields for readability
                    row = list(r)
                    if len(row) >= 4 and row[3] is not None:
                        try:
                            row[3] = json.loads(row[3]) if isinstance(row[3], str) else row[3]
                        except Exception:
                            row[3] = str(row[3])[:100]
                    print(row)
            except Exception as e:
                print(f"  Error reading rows from {t}: {e}")

    conn.close()
except Exception as e:
    print(f"Error inspecting DB: {e}")
    sys.exit(1)

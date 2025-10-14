#!/usr/bin/env python3
import sqlite3, os

DB = 'database.db'
print(f"Using DB: {DB}")
if not os.path.exists(DB):
    print("Creating new database file...")

conn = sqlite3.connect(DB)
cur = conn.cursor()

# Crear la tabla Product si no existe
cur.execute("""
CREATE TABLE IF NOT EXISTS Product (
    id INTEGER PRIMARY KEY,
    name TEXT,
    image_url TEXT,
    images TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
)
""")

conn.commit()
conn.close()
print("Table 'Product' ensured.")

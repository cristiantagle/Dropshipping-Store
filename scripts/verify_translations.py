import os
from dotenv import load_dotenv
from supabase import create_client, Client


def env_or_fail(name: str) -> str:
    val = os.environ.get(name)
    if not val:
        raise RuntimeError(f"Falta variable de entorno: {name}")
    return val


def count_missing(client: Client, table: str, col: str) -> int:
    # Cuenta filas donde col es NULL o ""
    res = (
        client.table(table)
        .select("id", count="exact", head=True)
        .or_(f"{col}.is.null,{col}.eq.")
        .execute()
    )
    return getattr(res, "count", None) or 0


def sample_missing(client: Client, table: str, col: str, limit: int = 3):
    res = (
        client.table(table)
        .select("id,name,category_slug")
        .or_(f"{col}.is.null,{col}.eq.")
        .limit(limit)
        .execute()
    )
    return res.data or []


def main():
    load_dotenv()
    url = env_or_fail("NEXT_PUBLIC_SUPABASE_URL")
    key = env_or_fail("SUPABASE_SERVICE_ROLE_KEY")
    sb: Client = create_client(url, key)

    table = "products"
    cols = [
        "name_es",
        "description_es",
        "short_desc_es",
        "long_desc_es",
    ]

    print("Verificando campos en:", table)
    missing_counts = {}
    for c in cols:
        cnt = count_missing(sb, table, c)
        missing_counts[c] = cnt
    print("Faltantes:")
    for k, v in missing_counts.items():
        print(f"  {k}: {v}")

    any_missing = any(v > 0 for v in missing_counts.values())
    if any_missing:
        print("\nEjemplos de faltantes (máx 3 por campo):")
        for c in cols:
            if missing_counts[c] > 0:
                rows = sample_missing(sb, table, c, 3)
                print(f"- {c} -> {len(rows)} ejemplos:")
                for r in rows:
                    print(f"    id={r['id']} | name={r.get('name')} | cat={r.get('category_slug')}")
    else:
        print("\n[DONE] No hay faltantes en los campos *_es.")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("[ERROR]", e)
        raise


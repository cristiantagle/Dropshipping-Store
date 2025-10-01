import Link from "next/link";

export type Crumb = { href: string; label: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full my-4 text-sm text-gray-600 overflow-x-auto"
    >
      <ol className="flex items-center gap-2 whitespace-nowrap">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            {i > 0 && <span key={item.id} aria-hidden>›</span>}
            {i < items.length - 1 ? (
              <Link
                href={c.href}
                className="hover:text-gray-900 hover:underline underline-offset-4"
              >
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

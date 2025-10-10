import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-xl mb-10" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-3">
            {item.href ? (
              <Link
                href={item.href}
                className="text-lime-600 hover:text-lime-700 hover:underline font-semibold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-gray-900">{item.label}</span>
            )}
            {idx < items.length - 1 && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

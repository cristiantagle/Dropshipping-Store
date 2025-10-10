// Utilidad para formatear CLP
export function fmtCLP(value: number | string | null | undefined): string {
  const n = value == null ? 0 : Number(value);
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return (n === 0) ? "$0" : String(n);
  }
}

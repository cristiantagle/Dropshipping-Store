export function validateCJProduct(p: any, index?: number): boolean {
  const errors: string[] = [];

  if (typeof p.productName !== "string") errors.push("productName inválido");
  if (typeof p.productImage !== "string" || !p.productImage.startsWith("http")) errors.push("productImage inválido");

  if (errors.length > 0) {
    console.warn(`❌ Producto #${index ?? "?"} rechazado: ${errors.join(", ")}`);
    return false;
  }

  return true;
}
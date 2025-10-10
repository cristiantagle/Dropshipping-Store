interface Product {
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  short_desc?: string;
  short_desc_es?: string;
  long_desc?: string;
  long_desc_es?: string;
}

export const useProductText = (product: Product) => ({
  name: product.name_es,
  description: product.description_es,
  shortDesc: product.short_desc_es,
  longDesc: product.long_desc_es,
});

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
}

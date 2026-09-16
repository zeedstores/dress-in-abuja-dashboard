import { supabase } from "./supabase";
import type { Product } from "../types";

export async function createProduct(
  product: Omit<Product, "id">
) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description ?? null,
      image_url: product.image,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
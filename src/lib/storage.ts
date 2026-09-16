import { supabase } from "./supabase";

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    const path = url.pathname.split("/product-images/")[1];

    if (!path) return;

    const { error } = await supabase.storage
      .from("product-images")
      .remove([decodeURIComponent(path)]);

    if (error) {
      throw error;
    }

    console.log("Old product image deleted:", path);
  } catch (error) {
    console.error("Failed to delete product image:", error);
  }
}
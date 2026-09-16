import sharp from "sharp";
import fs from "fs";

const input = "public/zeed-logo.png";

fs.mkdirSync("public/icons", { recursive: true });

await sharp(input)
  .resize(192, 192, { fit: "contain" })
  .png()
  .toFile("public/icons/zeed-192.png");

await sharp(input)
  .resize(512, 512, { fit: "contain" })
  .png()
  .toFile("public/icons/zeed-512.png");

await sharp(input)
  .resize(48, 48, { fit: "contain" })
  .png()
  .toFile("public/icons/zeed-48.png");

console.log("Zeed icons created successfully.");
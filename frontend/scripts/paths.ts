import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export const paths = {
  frontendDir,
  sourceExcel: path.resolve(
    process.env.PRODUCT_FILE ?? path.join(frontendDir, "..", "data", "products.xlsx"),
  ),
  sourceImages: path.resolve(
    process.env.IMAGE_SOURCE_DIR ?? path.join(frontendDir, "..", "data", "images"),
  ),
  productsJson: path.join(frontendDir, "public", "data", "products.json"),
  outputImages: path.join(frontendDir, "public", "images"),
};

import fs from "fs";
import path from "path";

export function saveAsset(buffer: Buffer, relativePath: string): string {
  const outputDir = path.resolve(__dirname, "..", "..", "test-results", "assets");
  const fullPath = path.join(outputDir, relativePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, buffer);
  return fullPath;
}

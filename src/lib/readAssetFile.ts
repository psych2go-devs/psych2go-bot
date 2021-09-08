import { readFileSync } from "fs";
import { resolve } from "path";

export default function (filename: string) {
  return readFileSync(resolve(__dirname, "..", "asset", filename)).toString();
}

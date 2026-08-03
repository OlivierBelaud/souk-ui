import { readdirSync } from "node:fs"
import { basename, extname, join } from "node:path"
import { defineConfig } from "tsup"

const sourceRoot = join(import.meta.dirname, "src")

function entries(directory: "components" | "hooks" | "lib") {
  return Object.fromEntries(
    readdirSync(join(sourceRoot, directory), { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() &&
          !entry.name.includes(".test.") &&
          [".ts", ".tsx"].includes(extname(entry.name))
      )
      .map((entry) => [
        `${directory}/${basename(entry.name, extname(entry.name))}`,
        join(sourceRoot, directory, entry.name),
      ])
  )
}

export default defineConfig({
  entry: {
    ...entries("components"),
    ...entries("hooks"),
    ...entries("lib"),
  },
  clean: true,
  dts: true,
  format: ["esm"],
  outDir: "dist",
  splitting: true,
  sourcemap: true,
  target: "es2022",
  treeshake: false,
})

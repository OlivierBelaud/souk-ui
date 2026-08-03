import { readFileSync, readdirSync } from "node:fs"
import { extname, join } from "node:path"
import { describe, expect, it } from "vitest"

const sourceRoot = join(import.meta.dirname, "..")
const hookPattern =
  /React\.use(?:State|Effect|Context|Memo|Callback|Ref|Id|Reducer|LayoutEffect)|\buse(?:State|Effect|Context|Memo|Callback|Ref|Id|Reducer|LayoutEffect)\(/

describe("client boundaries", () => {
  it("marks every hook-using public entry as a client component", () => {
    const directories = ["components", "hooks"]
    const missing = directories.flatMap((directory) =>
      readdirSync(join(sourceRoot, directory), { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isFile() &&
            !entry.name.includes(".test.") &&
            [".ts", ".tsx"].includes(extname(entry.name))
        )
        .map((entry) => join(sourceRoot, directory, entry.name))
        .filter((path) => {
          const source = readFileSync(path, "utf8")
          return hookPattern.test(source) && !source.startsWith('"use client"')
        })
    )

    expect(missing).toEqual([])
  })
})

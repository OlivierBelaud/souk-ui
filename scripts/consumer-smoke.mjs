import { execFileSync } from "node:child_process"
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { basename, extname, join, resolve } from "node:path"

const repositoryRoot = resolve(import.meta.dirname, "..")
const workspace = mkdtempSync(join(tmpdir(), "souk-ui-consumer-"))
const consumerRoot = join(workspace, "consumer")

function run(command, args, cwd = repositoryRoot) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: join(repositoryRoot, ".npm-cache"),
    },
  })
}

function write(relativePath, contents) {
  const target = join(consumerRoot, relativePath)
  mkdirSync(resolve(target, ".."), { recursive: true })
  writeFileSync(target, contents)
}

try {
  run("npm", ["run", "build", "--workspace=@soukjs/ui"])
  const packResult = JSON.parse(
    run("npm", [
      "pack",
      "--workspace=@soukjs/ui",
      "--json",
      "--ignore-scripts",
      "--pack-destination",
      workspace,
    ])
  )
  const tarball = join(workspace, packResult[0].filename)

  const sourceDirectories = [
    join(repositoryRoot, "packages/ui/src/components"),
    join(repositoryRoot, "packages/ui/src/hooks"),
  ]
  const hookPattern =
    /React\.use(?:State|Effect|Context|Memo|Callback|Ref|Id|Reducer|LayoutEffect)|\buse(?:State|Effect|Context|Memo|Callback|Ref|Id|Reducer|LayoutEffect)\(/

  for (const directory of sourceDirectories) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (
        !entry.isFile() ||
        entry.name.includes(".test.") ||
        ![".ts", ".tsx"].includes(extname(entry.name))
      ) {
        continue
      }

      const sourcePath = join(directory, entry.name)
      const source = readFileSync(sourcePath, "utf8")
      if (!hookPattern.test(source)) continue

      const kind = directory.endsWith("hooks") ? "hooks" : "components"
      const builtPath = `package/dist/${kind}/${basename(entry.name, extname(entry.name))}.js`
      const built = run("tar", ["-xOf", tarball, builtPath])
      if (!built.startsWith('"use client"')) {
        throw new Error(`${builtPath} lost its client boundary`)
      }
    }
  }

  write(
    "package.json",
    JSON.stringify(
      {
        private: true,
        type: "module",
        scripts: { build: "tsc --noEmit && vite build" },
        dependencies: {
          "@soukjs/ui": `file:${tarball}`,
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
          "@tailwindcss/vite": "^4.0.0",
          "@types/node": "^24.0.0",
          "@types/react": "^19.0.0",
          "@types/react-dom": "^19.0.0",
          tailwindcss: "^4.0.0",
          typescript: "~6.0.0",
          vite: "^7.0.0",
        },
      },
      null,
      2
    )
  )
  write(
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          lib: ["ESNext", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          noEmit: true,
          strict: true,
          target: "ES2022",
          types: ["vite/client", "node"],
        },
        include: ["src", "vite.config.ts"],
      },
      null,
      2
    )
  )
  write(
    "vite.config.ts",
    `import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) return
        warn(warning)
      },
    },
  },
})
`
  )
  write(
    "index.html",
    '<div id="root"></div><script type="module" src="/src/main.tsx"></script>'
  )
  write(
    "src/styles.css",
    '@import "@soukjs/ui/styles.css";\n@source "../node_modules/@soukjs/ui/dist";\n'
  )
  write(
    "src/main.tsx",
    `import React from "react"
import { createRoot } from "react-dom/client"
import { Button } from "@soukjs/ui/components/button"
import { DataTable, type ColumnDef } from "@soukjs/ui/components/data-table"
import "./styles.css"

type Row = { id: string; name: string }
const columns: ColumnDef<Row>[] = [{ accessorKey: "name", header: "Name" }]

function App() {
  return <><Button>Ready</Button><DataTable columns={columns} data={[{ id: "1", name: "Souk" }]} getRowId={(row) => row.id} /></>
}

createRoot(document.getElementById("root")!).render(<App />)
`
  )

  run(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--no-fund"],
    consumerRoot
  )
  run("npm", ["run", "build"], consumerRoot)
  process.stdout.write("Consumer tarball smoke test passed.\n")
} finally {
  rmSync(workspace, { recursive: true, force: true })
}

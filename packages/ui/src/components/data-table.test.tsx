import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { functionalUpdate, type ColumnDef } from "@tanstack/react-table"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { Checkbox } from "@soukjs/ui/components/checkbox"
import { DataTable } from "@soukjs/ui/components/data-table"
import type { DataTableState } from "@soukjs/ui/components/data-table"
import { DataTableColumnHeader } from "@soukjs/ui/components/data-table-column-header"
import { dataTableFacetedFilter } from "@soukjs/ui/components/data-table-faceted-filter"

type Project = {
  id: string
  name: string
  status: "Active" | "Paused"
  leads: number
}

const projects: Project[] = [
  { id: "1", name: "Atlas", status: "Active", leads: 42 },
  { id: "2", name: "Beacon", status: "Paused", leads: 18 },
  { id: "3", name: "Canvas", status: "Active", leads: 31 },
]

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: dataTableFacetedFilter,
  },
  { accessorKey: "leads", header: "Leads" },
]

describe("DataTable", () => {
  it("filters, sorts, paginates, selects rows and controls column visibility", async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={projects}
        filterColumn="name"
        filterPlaceholder="Search projects…"
        pageSize={2}
      />
    )

    expect(screen.getByText("Atlas")).toBeInTheDocument()
    expect(screen.getByText("Beacon")).toBeInTheDocument()
    expect(screen.queryByText("Canvas")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to next page" }))
    expect(screen.getByText("Canvas")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to first page" }))
    await user.type(
      screen.getByRole("textbox", { name: "Search projects…" }),
      "bea"
    )
    expect(screen.getByText("Beacon")).toBeInTheDocument()
    expect(screen.queryByText("Atlas")).not.toBeInTheDocument()

    await user.clear(screen.getByRole("textbox", { name: "Search projects…" }))
    await user.click(screen.getByRole("button", { name: /sort by project/i }))
    await user.click(screen.getByRole("menuitem", { name: /descending/i }))
    const rows = screen.getAllByRole("row")
    expect(within(rows[1]!).getByText("Canvas")).toBeInTheDocument()

    await user.click(screen.getByRole("checkbox", { name: "Select Canvas" }))
    expect(screen.getByText("1 of 3 row(s) selected.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Toggle columns" }))
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Status" }))
    expect(
      screen.queryByRole("columnheader", { name: "Status" })
    ).not.toBeInTheDocument()
  })

  it("renders an explicit empty state and exposes table state changes", () => {
    const onStateChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyMessage="No project matches this view."
        onStateChange={onStateChange}
      />
    )

    expect(
      screen.getByText("No project matches this view.")
    ).toBeInTheDocument()
    expect(onStateChange).toHaveBeenCalled()
  })

  it("does not retrigger state notifications when an inline callback rerenders its parent", () => {
    const onStateChange = vi.fn()

    function StateObserver() {
      const [, setSnapshot] = React.useState<DataTableState>()

      return (
        <DataTable
          columns={columns}
          data={projects}
          onStateChange={(state) => {
            onStateChange(state)
            setSnapshot(state)
          }}
        />
      )
    }

    render(<StateObserver />)
    expect(onStateChange).toHaveBeenCalledTimes(1)
  })

  it("preserves stable selection and global counts across server pages", async () => {
    const user = userEvent.setup()
    const serverPages = [
      projects,
      [
        { id: "4", name: "Delta", status: "Active" as const, leads: 12 },
        { id: "5", name: "Ember", status: "Paused" as const, leads: 7 },
        { id: "6", name: "Fjord", status: "Active" as const, leads: 22 },
      ],
    ]

    function ServerTable() {
      const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 3,
      })

      return (
        <DataTable
          columns={columns}
          data={serverPages[pagination.pageIndex] ?? []}
          manualPagination
          getRowId={(row) => row.id}
          pageCount={2}
          rowCount={6}
          pagination={pagination}
          onPaginationChange={(updater) =>
            setPagination((previous) => functionalUpdate(updater, previous))
          }
        />
      )
    }

    render(<ServerTable />)
    await user.click(screen.getByRole("checkbox", { name: "Select Atlas" }))
    expect(screen.getByText("1 of 6 row(s) selected.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to next page" }))
    expect(screen.getByText("Delta")).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Select Delta" })
    ).not.toBeChecked()
    expect(screen.getByText("1 of 6 row(s) selected.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Go to first page" }))
    expect(screen.getByRole("checkbox", { name: "Select Atlas" })).toBeChecked()
  })

  it("rejects server pagination without a stable row identity", () => {
    expect(() =>
      render(
        // @ts-expect-error JavaScript consumers still need the runtime invariant.
        <DataTable columns={columns} data={projects} manualPagination />
      )
    ).toThrow("DataTable requires getRowId")
  })

  it("combines faceted filters, reset and every pagination control", async () => {
    const user = userEvent.setup()
    const onPaginationChange = vi.fn()
    render(
      <DataTable
        columns={columns}
        data={projects}
        pageSize={1}
        pageSizeOptions={[1, 2, 3]}
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "Paused", value: "Paused" },
              { label: "Archived", value: "Archived" },
            ],
          },
        ]}
        onPaginationChange={onPaginationChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Go to last page" }))
    expect(screen.getByText("Canvas")).toBeInTheDocument()
    await user.click(
      screen.getByRole("button", { name: "Go to previous page" })
    )
    expect(screen.getByText("Beacon")).toBeInTheDocument()
    expect(onPaginationChange).toHaveBeenCalledTimes(2)

    await user.click(screen.getByRole("combobox", { name: "Rows per page" }))
    await user.click(screen.getByRole("option", { name: "3" }))
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Status" }))
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Active/ }))
    expect(screen.queryByText("Beacon")).not.toBeInTheDocument()
    expect(screen.getByText("0 of 2 row(s) selected.")).toBeInTheDocument()
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Paused/ }))
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Archived/ }))
    expect(screen.getByText("3 selected")).toBeInTheDocument()
    await user.click(screen.getByRole("menuitem", { name: "Clear filter" }))
    expect(screen.getByText("Atlas")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Status" }))
    await user.click(screen.getByRole("menuitemcheckbox", { name: /Active/ }))
    await user.keyboard("{Escape}")
    await user.click(screen.getByRole("button", { name: /Reset/i }))
    expect(screen.getByText("Beacon")).toBeInTheDocument()
  })

  it("keeps a custom current page size available in the selector", async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={projects} pageSize={7} />)

    await user.click(screen.getByRole("combobox", { name: "Rows per page" }))
    expect(screen.getByRole("option", { name: "7" })).toBeInTheDocument()
  })
})

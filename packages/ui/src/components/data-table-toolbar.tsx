"use client"

import type { Table } from "@tanstack/react-table"
import { RotateCcwIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@souk/ui/components/button"
import {
  DataTableFacetedFilter,
  type DataTableFilterOption,
} from "@souk/ui/components/data-table-faceted-filter"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@souk/ui/components/dropdown-menu"
import { Input } from "@souk/ui/components/input"

type DataTableFilter = {
  columnId: string
  title: string
  options: DataTableFilterOption[]
}

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  filterColumn?: string
  filterPlaceholder?: string
  filters?: DataTableFilter[]
  actions?: React.ReactNode
}

const humanize = (value: string) =>
  value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (letter) => letter.toUpperCase())

function DataTableToolbar<TData>({
  table,
  filterColumn,
  filterPlaceholder = "Filter rows…",
  filters = [],
  actions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const searchColumn = filterColumn ? table.getColumn(filterColumn) : undefined

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {searchColumn && (
          <Input
            aria-label={filterPlaceholder}
            placeholder={filterPlaceholder}
            value={(searchColumn.getFilterValue() as string | undefined) ?? ""}
            onChange={(event) =>
              searchColumn.setFilterValue(event.target.value)
            }
            className="h-8 w-full sm:w-[220px] lg:w-[280px]"
          />
        )}
        {filters.map((filter) => {
          const column = table.getColumn(filter.columnId)
          return column ? (
            <DataTableFacetedFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          ) : null
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <RotateCcwIcon aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              aria-label="Toggle columns"
            >
              <SlidersHorizontalIcon aria-hidden="true" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(Boolean(value))
                  }
                  className="capitalize"
                >
                  {humanize(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export { DataTableToolbar }
export type { DataTableFilter, DataTableToolbarProps }

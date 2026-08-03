"use client"

import * as React from "react"
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import { DataTablePagination } from "@soukjs/ui/components/data-table-pagination"
import {
  DataTableToolbar,
  type DataTableFilter,
} from "@soukjs/ui/components/data-table-toolbar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@soukjs/ui/components/table"

type DataTableState = {
  columnFilters: ColumnFiltersState
  columnVisibility: VisibilityState
  pagination: PaginationState
  rowSelection: RowSelectionState
  sorting: SortingState
}

type DataTableSharedProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  emptyMessage?: string
  filterColumn?: string
  filterPlaceholder?: string
  filters?: DataTableFilter[]
  actions?: React.ReactNode
  pageSize?: number
  pageSizeOptions?: number[]
  initialSorting?: SortingState
  manualSorting?: boolean
  manualFiltering?: boolean
  pageCount?: number
  rowCount?: number
  pagination?: PaginationState
  sorting?: SortingState
  columnFilters?: ColumnFiltersState
  onPaginationChange?: OnChangeFn<PaginationState>
  onSortingChange?: OnChangeFn<SortingState>
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  onStateChange?: (state: DataTableState) => void
}

type DataTableProps<TData, TValue> = DataTableSharedProps<TData, TValue> &
  (
    | {
        manualPagination: true
        getRowId: (row: TData, index: number) => string
      }
    | {
        manualPagination?: false
        getRowId?: (row: TData, index: number) => string
      }
  )

function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No results.",
  filterColumn,
  filterPlaceholder,
  filters,
  actions,
  pageSize = 10,
  pageSizeOptions,
  getRowId,
  initialSorting = [],
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
  rowCount,
  pagination: controlledPagination,
  sorting: controlledSorting,
  columnFilters: controlledColumnFilters,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  onStateChange,
}: DataTableProps<TData, TValue>) {
  if (manualPagination && !getRowId) {
    throw new Error(
      "DataTable requires getRowId when manualPagination is enabled."
    )
  }

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  const currentSorting = controlledSorting ?? sorting
  const currentFilters = controlledColumnFilters ?? columnFilters
  const currentPagination = controlledPagination ?? pagination

  const updateSorting: OnChangeFn<SortingState> = (updater) => {
    if (controlledSorting === undefined) {
      setSorting((previous) => functionalUpdate(updater, previous))
    }
    onSortingChange?.(updater)
  }
  const updateFilters: OnChangeFn<ColumnFiltersState> = (updater) => {
    if (controlledColumnFilters === undefined) {
      setColumnFilters((previous) => functionalUpdate(updater, previous))
    }
    onColumnFiltersChange?.(updater)
  }
  const updatePagination: OnChangeFn<PaginationState> = (updater) => {
    if (controlledPagination === undefined) {
      setPagination((previous) => functionalUpdate(updater, previous))
    }
    onPaginationChange?.(updater)
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: currentSorting,
      columnFilters: currentFilters,
      columnVisibility,
      rowSelection,
      pagination: currentPagination,
    },
    enableRowSelection: true,
    getRowId,
    onSortingChange: updateSorting,
    onColumnFiltersChange: updateFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: updatePagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount,
    rowCount,
  })

  const onStateChangeRef = React.useRef(onStateChange)

  React.useEffect(() => {
    onStateChangeRef.current = onStateChange
  }, [onStateChange])

  React.useEffect(() => {
    onStateChangeRef.current?.({
      sorting: currentSorting,
      columnFilters: currentFilters,
      columnVisibility,
      rowSelection,
      pagination: currentPagination,
    })
  }, [
    columnVisibility,
    currentFilters,
    currentPagination,
    currentSorting,
    rowSelection,
  ])

  return (
    <div data-slot="data-table" className="space-y-4">
      <DataTableToolbar
        table={table}
        filterColumn={filterColumn}
        filterPlaceholder={filterPlaceholder}
        filters={filters}
        actions={actions}
      />
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  )
}

export { DataTable }
export type { ColumnDef, DataTableProps, DataTableState }

"use client"

import type { Column, Row } from "@tanstack/react-table"
import type { ComponentType } from "react"
import { ListFilterIcon, PlusCircleIcon } from "lucide-react"

import { Badge } from "@souk/ui/components/badge"
import { Button } from "@souk/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@souk/ui/components/dropdown-menu"
import { Separator } from "@souk/ui/components/separator"

type DataTableFilterOption = {
  label: string
  value: string
  icon?: ComponentType<{ className?: string }>
}

type DataTableFacetedFilterProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
  options: DataTableFilterOption[]
}

const dataTableFacetedFilter = <TData,>(
  row: Row<TData>,
  columnId: string,
  filterValue: string[]
) => {
  if (!filterValue.length) return true
  return filterValue.includes(String(row.getValue(columnId)))
}

function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(
    (column.getFilterValue() as string[] | undefined) ?? []
  )

  const updateValue = (value: string) => {
    const next = new Set(selectedValues)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column.setFilterValue(next.size ? Array.from(next) : undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircleIcon aria-hidden="true" />
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <span className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={option.value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="flex items-center gap-2">
          <ListFilterIcon aria-hidden="true" />
          Filter by {title.toLowerCase()}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.has(option.value)}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => updateValue(option.value)}
            >
              {Icon && (
                <Icon className="text-muted-foreground" aria-hidden="true" />
              )}
              <span>{option.label}</span>
            </DropdownMenuCheckboxItem>
          )
        })}
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center"
              onSelect={() => column.setFilterValue(undefined)}
            >
              Clear filter
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableFacetedFilter, dataTableFacetedFilter }
export type { DataTableFacetedFilterProps, DataTableFilterOption }

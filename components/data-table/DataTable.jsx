"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Columns3, Search, Loader2, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* =========================================================
 | Utility Functions
 |========================================================= */
function getValueByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/* =========================================================
 | Selection Column (ShadCN Standard)
 |========================================================= */
const selectColumn = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      aria-label="Select all rows"
      className="translate-y-[2px]"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(v) => row.toggleSelected(!!v)}
      onClick={(e) => e.stopPropagation()}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

/* =========================================================
 | Generic Enterprise DataTable Component
 |========================================================= */
export function DataTable({
  columns,
  data = [],
  selectable = false,
  onRowClick,
  globalSearchKeys = [],
  isLoading = false,
  error = null,
  emptyMessage = "No results found.",
  emptyDescription = "Try adjusting your search or filters.",
  searchPlaceholder = "Search...",
  showPagination = true,
  showColumnToggle = true,
  showSearch = true,
  pageSize = 10,
  
  // Controlled row selection
  rowSelection: controlledRowSelection,
  onRowSelectionChange: controlledOnRowSelectionChange,
  
  // Custom toolbar actions
  toolbarActions,
  
  // Additional filters
  filters,
  onFiltersChange,
  
  // Custom class names
  className,
  tableClassName,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [internalRowSelection, setInternalRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Use controlled state if provided, otherwise use internal state
  const rowSelection = controlledRowSelection !== undefined 
    ? controlledRowSelection 
    : internalRowSelection;
    
  const onRowSelectionChange = controlledOnRowSelectionChange !== undefined
    ? controlledOnRowSelectionChange
    : setInternalRowSelection;

  // Combine selection column with user columns
  const finalColumns = React.useMemo(
    () => (selectable ? [selectColumn, ...columns] : columns),
    [selectable, columns]
  );

  const table = useReactTable({
    data,
    columns: finalColumns,
    enableRowSelection: selectable,

    state: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    globalFilterFn: (row, _, value) => {
      if (!value) return true;

      return globalSearchKeys.some((key) => {
        const cell = getValueByPath(row.original, key);
        return String(cell ?? "")
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    },

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get selected rows data
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {/* Search Input */}
          {showSearch && globalSearchKeys.length > 0 && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 pr-9"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
                  onClick={() => setGlobalFilter("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          )}

          {/* Custom Filters */}
          {filters && (
            <div className="flex items-center gap-2">
              {filters}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Custom Toolbar Actions */}
          {toolbarActions}

          {/* Column Toggle */}
          {showColumnToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-9">
                  <Columns3 className="mr-2 h-4 w-4" />
                  View
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((c) => c.getCanHide())
                  .map((c) => {
                    const header = c.columnDef.header;
                    const headerText = typeof header === "function" 
                      ? c.id 
                      : header;
                    
                    return (
                      <DropdownMenuCheckboxItem
                        key={c.id}
                        className="capitalize"
                        checked={c.getIsVisible()}
                        onCheckedChange={(v) => c.toggleVisibility(!!v)}
                      >
                        {headerText || c.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Selection Info */}
      {selectable && table.getFilteredSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {table.getFilteredSelectedRowModel().rows.length}
            </span>
            <span className="text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length === 1 ? "row" : "rows"} selected
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.toggleAllPageRowsSelected(false)}
            className="h-8"
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Table Container */}
      <div className="relative overflow-auto">
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-12 px-4">
              <div className="text-center space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <X className="h-6 w-6 text-destructive" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Error Loading Data</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {error?.message || "An unexpected error occurred. Please try again."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {!error && isLoading && (
            <div className="flex items-center justify-center py-12 px-4">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading data...</p>
              </div>
            </div>
          )}

          {/* Table */}
          {!error && !isLoading && (
            <div className="overflow-x-auto">
              <Table className={tableClassName}>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id} className="hover:bg-transparent">
                      {hg.headers.map((h) => (
                        <TableHead 
                          key={h.id}
                          className="bg-muted/50 font-semibold"
                        >
                          {h.isPlaceholder
                            ? null
                            : flexRender(
                                h.column.columnDef.header,
                                h.getContext()
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
                        data-state={row.getIsSelected() && "selected"}
                        className={cn(
                          "transition-colors",
                          onRowClick && "cursor-pointer hover:bg-muted/50"
                        )}
                        onClick={() => onRowClick?.(row.original)}
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
                        colSpan={finalColumns.length}
                        className="h-32 text-center"
                      >
                        <div className="flex flex-col items-center justify-center space-y-3 py-8">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold">{emptyMessage}</h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                              {emptyDescription}
                            </p>
                          </div>
                          {globalFilter && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setGlobalFilter("")}
                            >
                              Clear filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      {showPagination && !isLoading && !error && table.getRowModel().rows.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            {table.getFilteredRowModel().rows.length === 1 ? "result" : "results"}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-9"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-9"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-9"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-9"
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
 | Export utility to get selected rows
 |========================================================= */
export function useDataTableSelection(table) {
  return React.useMemo(() => {
    return table?.getFilteredSelectedRowModel()?.rows?.map(row => row.original) || [];
  }, [table]);
}
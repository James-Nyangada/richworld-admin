"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  KeyIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldOffIcon,
  ShieldIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "organization",
    header: "Organization",
    cell: ({ row }) => <div>{row.getValue("organization")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role")
      return (
        <Badge variant="outline" className="font-medium">
          {role}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className="flex justify-center">
          <Badge variant={status === "Active" ? "success" : "outline"} className="flex items-center gap-1">
            {status === "Active" ? <CheckCircleIcon className="h-3 w-3" /> : <AlertCircleIcon className="h-3 w-3" />}
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastLogin"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const status = user.status

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {status === "Active" ? (
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`${user.name} has been disabled`)
                }}
                className="cursor-pointer"
              >
                <ShieldOffIcon className="mr-2 h-4 w-4" />
                Disable User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`${user.name} has been activated`)
                }}
                className="cursor-pointer"
              >
                <ShieldIcon className="mr-2 h-4 w-4" />
                Enable User
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                toast.success(`Password reset email sent to ${user.email}`)
              }}
              className="cursor-pointer"
            >
              <KeyIcon className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                toast.success(`${user.name} has been forced to log out`)
              }}
              className="cursor-pointer"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Force Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UsersTable({ data }) {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [organizationFilter, setOrganizationFilter] = React.useState([])
  const [roleFilter, setRoleFilter] = React.useState([])
  const [statusFilter, setStatusFilter] = React.useState(["Active", "Inactive"])

  // Get unique organizations, roles for filters
  const uniqueOrganizations = React.useMemo(() => {
    return [...new Set(data.map((item) => item.organization))]
  }, [data])

  const uniqueRoles = React.useMemo(() => {
    return [...new Set(data.map((item) => item.role))]
  }, [data])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  React.useEffect(() => {
    if (organizationFilter.length > 0) {
      table.getColumn("organization")?.setFilterValue(organizationFilter)
    } else {
      table.getColumn("organization")?.setFilterValue(undefined)
    }
  }, [table, organizationFilter])

  React.useEffect(() => {
    if (roleFilter.length > 0) {
      table.getColumn("role")?.setFilterValue(roleFilter)
    } else {
      table.getColumn("role")?.setFilterValue(undefined)
    }
  }, [table, roleFilter])

  React.useEffect(() => {
    table.getColumn("status")?.setFilterValue(statusFilter)
  }, [table, statusFilter])

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="h-10 w-[250px] pl-8"
            />
          </div>

          <Select
            value={organizationFilter.length > 0 ? organizationFilter.join(",") : ""}
            onValueChange={(value) => {
              setOrganizationFilter(value ? value.split(",") : [])
            }}
          >
            <SelectTrigger className="h-10 w-[180px]">
              <SelectValue placeholder="All Organizations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {uniqueOrganizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={roleFilter.length > 0 ? roleFilter.join(",") : ""}
            onValueChange={(value) => {
              setRoleFilter(value ? value.split(",") : [])
            }}
          >
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter.join(",")}
            onValueChange={(value) => {
              setStatusFilter(value.split(","))
            }}
          >
            <SelectTrigger className="h-10 w-[150px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active,Inactive">All Statuses</SelectItem>
              <SelectItem value="Active">Active Only</SelectItem>
              <SelectItem value="Inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => toast.success("Add user functionality would go here")}>Add User</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} users total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

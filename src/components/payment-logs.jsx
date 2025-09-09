"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  CreditCardIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PaymentLogs({ logs }) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [gatewayFilter, setGatewayFilter] = React.useState("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [itemsPerPage] = React.useState(10)

  // Filter logs based on search query, status, and gateway
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        log.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.transactionId.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by status
      const matchesStatus = statusFilter === "all" || log.status === statusFilter

      // Filter by gateway
      const matchesGateway = gatewayFilter === "all" || log.gateway === gatewayFilter

      return matchesSearch && matchesStatus && matchesGateway
    })
  }, [logs, searchQuery, statusFilter, gatewayFilter])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  const handleExportLogs = () => {
    toast.success("Payment logs exported successfully")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Integration Logs</h2>
        <Button onClick={handleExportLogs}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company or transaction ID..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="succeeded">Succeeded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by gateway" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gateways</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No payment logs found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.transactionId}</TableCell>
                  <TableCell>{log.companyName}</TableCell>
                  <TableCell className={log.amount < 0 ? "text-destructive" : ""}>
                    {log.amount < 0 ? "-" : ""}${Math.abs(log.amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={log.status === "succeeded" ? "success" : "destructive"}
                      className="flex w-fit items-center gap-1"
                    >
                      {log.status === "succeeded" ? (
                        <CheckCircleIcon className="h-3 w-3" />
                      ) : (
                        <AlertCircleIcon className="h-3 w-3" />
                      )}
                      {log.status === "succeeded" ? "Succeeded" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {log.paymentMethod === "credit_card" ? (
                        <>
                          <CreditCardIcon className="h-4 w-4" />
                          <span>{log.lastFour ? `•••• ${log.lastFour}` : "Credit Card"}</span>
                        </>
                      ) : (
                        "Bank Transfer"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {log.gateway}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.success(`Details for transaction ${log.transactionId} viewed`)}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

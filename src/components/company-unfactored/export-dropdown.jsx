"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, FileJson } from "lucide-react"
import { exportToCSV, exportToJSON, EXPORT_COLUMNS } from "@/lib/export-utils"

export function ExportDropdown({ data, type, filename }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const columns = EXPORT_COLUMNS[type]
      if (columns) {
        exportToCSV(data, filename, columns)
      }
    } catch (error) {
      console.error("Error exporting CSV:", error)
    }
    setIsExporting(false)
  }

  const handleExportJSON = async () => {
    setIsExporting(true)
    try {
      exportToJSON(data, filename)
    } catch (error) {
      console.error("Error exporting JSON:", error)
    }
    setIsExporting(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting || data.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportJSON}>
          <FileJson className="h-4 w-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

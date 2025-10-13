"use client"

import React, { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"

export default function JobCategories({ company }) {
  const [jobCategorySearch, setJobCategorySearch] = useState("")

  const filteredJobCategories = useMemo(() => {
    if (!company.employeeCategories) return []
    return company.employeeCategories.filter((category) =>
      category.category.toLowerCase().includes(jobCategorySearch.toLowerCase()),
    )
  }, [company.employeeCategories, jobCategorySearch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-lg text-gray-900">Employee Job Categories</h4>
        <Badge variant="outline" className="text-sm">{company.employeeCategories?.length || 0} categories</Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search job categories..." value={jobCategorySearch} onChange={(e) => setJobCategorySearch(e.target.value)} className="pl-10" />
      </div>

      {filteredJobCategories.length > 0 ? (
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
            {filteredJobCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">{category.category}</h5>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {category.nbEmployees} employees
                      </span>
                      {category.firstHireDate && (
                        <span>First hired: {new Date(category.firstHireDate.timestamp * 1000).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">{category.nbEmployees} people</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : company.employeeCategories?.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No job categories found</p>
          <p className="text-gray-400 text-sm">Employee data needs to be scraped to see job categories</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No categories match your search</p>
        </div>
      )}
    </div>
  )
}

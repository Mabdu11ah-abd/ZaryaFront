"use client"

import React, { useEffect, useState } from "react"
import { RefreshCw, Users, ExternalLink, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Employees({ company, people: peopleProp = [], loadingPeople: loadingProp = false }) {
  const [people, setPeople] = useState(peopleProp || [])
  const [loadingPeople, setLoadingPeople] = useState(loadingProp)

  useEffect(() => {
    let mounted = true
    if ((peopleProp && peopleProp.length > 0) || loadingProp) {
      setPeople(peopleProp)
      setLoadingPeople(loadingProp)
      return
    }

    // Simulate API call only when parent didn't supply people
    setLoadingPeople(true)
    const t = setTimeout(() => {
      if (!mounted) return
      setPeople([
        { firstName: "Alice", lastName: "Johnson", role: ["CEO"], tags: ["Leadership", "Strategy"], linkedInUrl: "https://linkedin.com/in/alicejohnson" },
        { firstName: "Bob", lastName: "Smith", role: ["CTO", "Co-Founder"], tags: ["Engineering", "Innovation"], linkedInUrl: "https://linkedin.com/in/bobsmith" },
        { firstName: "Carol", lastName: "Lee", role: ["Product Manager"], tags: ["Product", "Agile"], linkedInUrl: "" },
      ])
      setLoadingPeople(false)
    }, 500)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [company?.id, peopleProp, loadingProp])

  return (
    <div className="space-y-4">
      {!company.hasEmployees && !loadingPeople && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800 font-medium">Employees not yet fetched for this company</p>
          </div>
          <p className="text-yellow-700 text-sm mt-1">Use the scrape people feature to fetch employee data</p>
        </div>
      )}

      {loadingPeople ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading employees...</p>
        </div>
      ) : people.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg text-gray-900">Employees</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">{people.length} employees</Badge>
              {company.hasEmployees && <Badge className="bg-green-100 text-green-800 text-xs">Data Available</Badge>}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {people.map((person, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{person.firstName} {person.lastName}</p>
                    <p className="text-sm text-gray-600">{person.role?.join(", ") || "N/A"}</p>
                    {person.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {person.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {person.linkedInUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={person.linkedInUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No employees found</p>
          <p className="text-gray-400 text-sm">Scrape LinkedIn data to find employees</p>
        </div>
      )}
    </div>
  )
}

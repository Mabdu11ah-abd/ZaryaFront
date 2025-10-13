"use client"

import React, { useEffect, useState } from "react"
import { RefreshCw, Mail, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Emails({ company, emails: emailsProp = [], loadingEmails: loadingProp = false }) {
  const [emails, setEmails] = useState(emailsProp || [])
  const [loadingEmails, setLoadingEmails] = useState(loadingProp)

  useEffect(() => {
    let mounted = true
    if ((emailsProp && emailsProp.length > 0) || loadingProp) {
      setEmails(emailsProp)
      setLoadingEmails(loadingProp)
      return
    }

    setLoadingEmails(true)
    const t = setTimeout(() => {
      if (!mounted) return
      setEmails([
        { address: "alice.johnson@example.com", status: "Valid", isVerified: true, isCatchAll: false, verificationMethod: "Email Verification" },
        { address: "bob.smith@example.com", status: "Invalid", isVerified: false, isCatchAll: false, verificationMethod: "Bounced" },
        { address: "carol.lee@example.com", status: "Valid", isVerified: true, isCatchAll: true, verificationMethod: "Catch-All" },
      ])
      setLoadingEmails(false)
    }, 400)

    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [company?.id, emailsProp, loadingProp])
  return (
    <div className="space-y-4">
      {loadingEmails ? (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading emails...</p>
        </div>
      ) : emails.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg text-gray-900">Email Addresses</h4>
            <Badge variant="outline" className="text-sm">{emails.length} emails</Badge>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {emails.map((email, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{email.address}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={email.status === "Valid" ? "default" : "secondary"} className="text-xs">
                        {email.status || "Unknown"}
                      </Badge>
                      {email.isVerified && <Badge className="text-xs bg-green-100 text-green-800">Verified</Badge>}
                      {email.isCatchAll && <Badge variant="outline" className="text-xs">Catch-All</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Method: {email.verificationMethod || "N/A"}</p>
                  </div>
                  <div className="flex items-center space-x-2">
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
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No emails found</p>
          <p className="text-gray-400 text-sm">Use the email discovery tools to find emails</p>
        </div>
      )}
    </div>
  )
}

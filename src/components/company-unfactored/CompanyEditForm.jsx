"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Building,
  Globe,
  Users,
  Phone,
  ExternalLink,
  Plus,
  Copy,
  AlertTriangle,
  Save,
  ArrowLeft,
  Trash2,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function CompanyEditForm({ company, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    // Basic Info
    name: company?.name || "",
    fullName: company?.fullName || "",
    allNames: company?.allNames || [],
    description: company?.description || "",
    summary: company?.summary || "",

    // URIs and Links
    homepageUri: company?.homepageUri || "",
    linkedinUrl: company?.linkedinUrl || "",
    angellistUri: company?.angellistUri || "",
    crunchbaseUri: company?.crunchbaseUri || "",
    githubUri: company?.githubUri || "",
    facebookUri: company?.facebookUri || "",
    diffboturi: company?.diffboturi || "",
    allUris: company?.allUris || [],

    // Leadership
    ceo: company?.ceo || { name: "", summary: "", diffboturi: "", targetDiffbotId: "" },
    founders: company?.founders || [],

    // Financial
    revenue: company?.revenue || { currency: "USD", value: 0 },
    nbEmployees: company?.nbEmployees || 0,
    nbEmployeesMin: company?.nbEmployeesMin || 0,
    nbEmployeesMax: company?.nbEmployeesMax || 0,
    size: company?.size || "",

    // Contact
    phoneNumbers: company?.phoneNumbers || [],
    emailAddresses: company?.emailAddresses || [],
    location: company?.location || {
      address: "",
      city: { name: "" },
      region: { name: "" },
      country: { name: "" },
      postalCode: "",
    },

    // Status
    isPublic: company?.isPublic || false,
    isNonProfit: company?.isNonProfit || false,
    isAcquired: company?.isAcquired || false,
    isDissolved: company?.isDissolved || false,

    // Categories and Customers
    categories: company?.categories || [],
    customers: company?.customers || [],
    origins: company?.origins || [],
  })

  const [conflicts, setConflicts] = useState({
    names: { hasConflict: false, selectedIndex: 0, options: [] },
    uris: { hasConflict: false, selectedIndex: 0, options: [] },
  })

  useEffect(() => {
    if (formData.allNames?.length > 1) {
      setConflicts((prev) => ({
        ...prev,
        names: {
          hasConflict: true,
          selectedIndex: 0,
          options: formData.allNames,
        },
      }))
    }

    if (formData.allUris?.length > 1) {
      setConflicts((prev) => ({
        ...prev,
        uris: {
          hasConflict: true,
          selectedIndex: 0,
          options: formData.allUris,
        },
      }))
    }
  }, [formData.allNames, formData.allUris])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (field, subfield, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value },
    }))
  }

  const handleArrayAdd = (field, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newItem],
    }))
  }

  const handleArrayRemove = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleArrayUpdate = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleConflictResolve = (type, selectedIndex) => {
    setConflicts((prev) => ({
      ...prev,
      [type]: { ...prev[type], selectedIndex },
    }))

    if (type === "names") {
      handleInputChange("name", formData.allNames[selectedIndex])
    } else if (type === "uris") {
      handleInputChange("homepageUri", formData.allUris[selectedIndex])
    }
  }

const handleSave = () => {
    console.log("company id ", company._id || company.id);
  const finalData = { ...formData, _id: company._id || company.id }

  if (conflicts.names.hasConflict) {
    finalData.name = formData.allNames[conflicts.names.selectedIndex]
  }
  if (conflicts.uris.hasConflict) {
    finalData.homepageUri = formData.allUris[conflicts.uris.selectedIndex]
  }

  onSave(finalData)
}

  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Edit Company</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="leadership" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Leadership
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="origins" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Origins
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="conflicts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Conflicts
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-semibold text-lg mb-4 text-blue-900 flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="Enter full company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Homepage URI</label>
                  <Input
                    value={formData.homepageUri}
                    onChange={(e) => handleInputChange("homepageUri", e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
              </div>
            </div>

            {/* Company Size & Revenue Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <h4 className="font-semibold text-lg mb-4 text-green-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Size & Revenue
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                  <Input
                    type="number"
                    value={formData.nbEmployees}
                    onChange={(e) => handleInputChange("nbEmployees", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Employees</label>
                    <Input
                      type="number"
                      value={formData.nbEmployeesMin}
                      onChange={(e) => handleInputChange("nbEmployeesMin", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Employees</label>
                    <Input
                      type="number"
                      value={formData.nbEmployeesMax}
                      onChange={(e) => handleInputChange("nbEmployeesMax", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue (USD)</label>
                  <Input
                    type="number"
                    value={formData.revenue.value}
                    onChange={(e) => handleNestedChange("revenue", "value", Number.parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size Category</label>
                  <Input
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    placeholder="e.g., Small, Medium, Large"
                  />
                </div>
              </div>
            </div>

            {/* Company Status Card */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
              <h4 className="font-semibold text-lg mb-4 text-purple-900">Company Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Public Company</label>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Non-Profit</label>
                  <Switch
                    checked={formData.isNonProfit}
                    onCheckedChange={(checked) => handleInputChange("isNonProfit", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Acquired</label>
                  <Switch
                    checked={formData.isAcquired}
                    onCheckedChange={(checked) => handleInputChange("isAcquired", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Dissolved</label>
                  <Switch
                    checked={formData.isDissolved}
                    onCheckedChange={(checked) => handleInputChange("isDissolved", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h4 className="font-semibold text-lg mb-4 text-gray-900">Description & Summary</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <Textarea
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Brief company summary..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detailed company description..."
                  rows={5}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-6 p-6">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-semibold text-lg mb-4 text-yellow-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Resolve Data Conflicts
              </h4>
              <p className="text-yellow-800 mb-6">
                Multiple values found for some fields. Please select the preferred option for each conflict.
              </p>

              {/* Name Conflicts */}
              {conflicts.names.hasConflict && (
                <div className="bg-white rounded-lg p-4 border border-yellow-200 mb-4">
                  <h5 className="font-medium text-gray-900 mb-3">Company Name Conflict</h5>
                  <div className="space-y-2">
                    {conflicts.names.options.map((name, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`name-${index}`}
                          name="nameConflict"
                          checked={conflicts.names.selectedIndex === index}
                          onChange={() => handleConflictResolve("names", index)}
                          className="text-blue-600"
                        />
                        <label htmlFor={`name-${index}`} className="flex-1 text-gray-700">
                          {name}
                        </label>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(name)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URI Conflicts */}
              {conflicts.uris.hasConflict && (
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <h5 className="font-medium text-gray-900 mb-3">Homepage URI Conflict</h5>
                  <div className="space-y-2">
                    {conflicts.uris.options.map((uri, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`uri-${index}`}
                          name="uriConflict"
                          checked={conflicts.uris.selectedIndex === index}
                          onChange={() => handleConflictResolve("uris", index)}
                          className="text-blue-600"
                        />
                        <label htmlFor={`uri-${index}`} className="flex-1 text-gray-700 truncate">
                          {uri}
                        </label>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(uri)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open(uri, "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!conflicts.names.hasConflict && !conflicts.uris.hasConflict && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No conflicts detected</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leadership" className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chief Executive Officer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>CEO Name</Label>
                  <Input
                    value={formData.ceo?.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ceo: { ...prev.ceo, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Diffbot URI</Label>
                  <Input
                    value={formData.ceo?.diffboturi || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ceo: { ...prev.ceo, diffboturi: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>CEO Summary</Label>
                <Textarea
                  value={formData.ceo?.summary || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ceo: { ...prev.ceo, summary: e.target.value },
                    }))
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Founders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.founders?.map((founder, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Founder Name</Label>
                        <Input
                          value={founder.name || ""}
                          onChange={(e) => {
                            const newFounders = [...(formData.founders || [])]
                            newFounders[index] = { ...newFounders[index], name: e.target.value }
                            setFormData((prev) => ({ ...prev, founders: newFounders }))
                          }}
                        />
                      </div>
                      <div>
                        <Label>Diffbot URI</Label>
                        <Input
                          value={founder.diffboturi || ""}
                          onChange={(e) => {
                            const newFounders = [...(formData.founders || [])]
                            newFounders[index] = { ...newFounders[index], diffboturi: e.target.value }
                            setFormData((prev) => ({ ...prev, founders: newFounders }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Summary</Label>
                      <Textarea
                        value={founder.summary || ""}
                        onChange={(e) => {
                          const newFounders = [...(formData.founders || [])]
                          newFounders[index] = { ...newFounders[index], summary: e.target.value }
                          setFormData((prev) => ({ ...prev, founders: newFounders }))
                        }}
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove("founders", index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newFounder = { name: "", summary: "", diffboturi: "" }
                    setFormData((prev) => ({
                      ...prev,
                      founders: [...(prev.founders || []), newFounder],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Founder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.customers?.map((customer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Customer Name</Label>
                        <Input
                          value={customer.name || ""}
                          onChange={(e) => {
                            const newCustomers = [...(formData.customers || [])]
                            newCustomers[index] = { ...newCustomers[index], name: e.target.value }
                            setFormData((prev) => ({ ...prev, customers: newCustomers }))
                          }}
                        />
                      </div>
                      <div>
                        <Label>Diffbot URI</Label>
                        <Input
                          value={customer.diffboturi || ""}
                          onChange={(e) => {
                            const newCustomers = [...(formData.customers || [])]
                            newCustomers[index] = { ...newCustomers[index], diffboturi: e.target.value }
                            setFormData((prev) => ({ ...prev, customers: newCustomers }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Summary</Label>
                      <Textarea
                        value={customer.summary || ""}
                        onChange={(e) => {
                          const newCustomers = [...(formData.customers || [])]
                          newCustomers[index] = { ...newCustomers[index], summary: e.target.value }
                          setFormData((prev) => ({ ...prev, customers: newCustomers }))
                        }}
                        rows={2}
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove("customers", index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newCustomer = { name: "", summary: "", diffboturi: "" }
                    setFormData((prev) => ({
                      ...prev,
                      customers: [...(prev.customers || []), newCustomer],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="origins" className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Origins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.origins?.map((origin, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="">
                      <div>
                        <Label>Origin Name</Label>
                        <Input
                          value={origin || ""}
                          onChange={(e) => {
                            const newOrigins = [...(formData.origins || [])]
                            newOrigins[index] = { ...newOrigins[index], name: e.target.value }
                            setFormData((prev) => ({ ...prev, origins: newOrigins }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove("origins", index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newOrigin = { name: "", summary: "", diffboturi: "" }
                    setFormData((prev) => ({
                      ...prev,
                      origins: [...(prev.origins || []), newOrigin],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Origin
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.location?.address || ""}
                    onChange={(e) => handleNestedChange("location", "address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location?.city?.name || ""}
                      onChange={(e) => handleNestedChange("location", "city", { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.location?.country?.name || ""}
                      onChange={(e) => handleNestedChange("location", "country", { name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={formData.location?.postalCode || ""}
                    onChange={(e) => handleNestedChange("location", "postalCode", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Phone Numbers</Label>
                  <div className="space-y-2 mt-2">
                    {formData.phoneNumbers?.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Phone number"
                          value={phone.string || ""}
                          onChange={(e) => {
                            const newPhones = [...(formData.phoneNumbers || [])]
                            newPhones[index] = { ...newPhones[index], string: e.target.value }
                            setFormData((prev) => ({ ...prev, phoneNumbers: newPhones }))
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArrayRemove("phoneNumbers", index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumbers: [...(prev.phoneNumbers || []), { string: "", digits: "" }],
                        }))
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Phone
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Email Addresses</Label>
                  <div className="space-y-2 mt-2">
                    {formData.emailAddresses?.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Email address"
                          value={email.contactString || email}
                          onChange={(e) => {
                            const newEmails = [...(formData.emailAddresses || [])]
                            newEmails[index] =
                              typeof newEmails[index] === "string"
                                ? e.target.value
                                : { ...newEmails[index], contactString: e.target.value }
                            setFormData((prev) => ({ ...prev, emailAddresses: newEmails }))
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArrayRemove("emailAddresses", index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          emailAddresses: [...(prev.emailAddresses || []), { contactString: "", type: "" }],
                        }))
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.categories?.map((category, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Category Name</Label>
                        <Input
                          value={category.name || ""}
                          onChange={(e) => {
                            const newCategories = [...(formData.categories || [])]
                            newCategories[index] = { ...newCategories[index], name: e.target.value }
                            setFormData((prev) => ({ ...prev, categories: newCategories }))
                          }}
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input
                          value={category.type || ""}
                          onChange={(e) => {
                            const newCategories = [...(formData.categories || [])]
                            newCategories[index] = { ...newCategories[index], type: e.target.value }
                            setFormData((prev) => ({ ...prev, categories: newCategories }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label>Summary</Label>
                      <Textarea
                        value={category.summary || ""}
                        onChange={(e) => {
                          const newCategories = [...(formData.categories || [])]
                          newCategories[index] = { ...newCategories[index], summary: e.target.value }
                          setFormData((prev) => ({ ...prev, categories: newCategories }))
                        }}
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={category.isPrimary || false}
                          onChange={(e) => {
                            const newCategories = [...(formData.categories || [])]
                            newCategories[index] = { ...newCategories[index], isPrimary: e.target.checked }
                            setFormData((prev) => ({ ...prev, categories: newCategories }))
                          }}
                        />
                        <Label className="text-sm">Primary Category</Label>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArrayRemove("categories", index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newCategory = { name: "", type: "", summary: "", isPrimary: false }
                    setFormData((prev) => ({
                      ...prev,
                      categories: [...(prev.categories || []), newCategory],
                    }))
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

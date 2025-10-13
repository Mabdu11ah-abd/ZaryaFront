"use client"

// hooks/useFilters.js
import { useState, useEffect } from "react"
// ✅ Step 1: Define initial filter state
const getInitialFilters = () => ({
  // 🏢 Company Info
  name: "",
  fullName: "",
  tags: [],
  allNames: [],
  linkedinUrl: "",
  homepageUri: "",
  angellistUri: "",
  crunchbaseUri: "",
  githubUri: "",
  facebookUri: "",
  diffbotUri: "",
  targetDiffbotId: "",

  // 🌍 Location
  location: {
    country: "",
    city: "",
    region: "",
    subregion: "",
    postalCode: "",
  },

  // 📊 Employees
  nbEmployees: { min: null, max: null },
  size: "",
  hasEmployees: null,
  employeeCategories: {
    category: "",
    nbEmployees: { min: null, max: null },
    firstHireDate: {
      str: "",
      precision: null,
      timestamp: null,
    },
  },

  // 💼 Financials
  revenue: {
    currency: "",
    min: null,
    max: null,
  },

  // 🏷️ Categories
  categories: [],
  isPrimaryCategory: null,
  categoryType: "",
  categoryLevel: null,
  // ⚙️ Technologies
  
  technologies: [],
  // 🤝 Customers
  customers: [],

  // 🧑 Founders & CEO
  founders: [],
  ceo: "",

  // ⚙️ Technologies
  technologies: [],

  // ⚖️ Status Flags
  isNonProfit: null,
  isAcquired: null,
  isDissolved: null,
  isPublic: null,
  onDiffbot: null,

  // 🧭 Origins
  origins: [],

  // 👤 People filters
  people: {
    firstName: "",
    lastName: "",
    role: [],
    linkedInUrl: "",
    tags: [],
    description: "",
  },
  // 🕒 Metadata
  createdAt: {
    from: null,
    to: null,
  },
  // pagination
  page: 1,
  pageSize: 20,
  sortBy: "relevance",
  sortOrder: "desc",

  // filter by collection
  collectionId: "",
})

// ✅ Step 2: Build the hook
export function useFilters(persist = true) {
  // During SSR `window` / `localStorage` are not available.
  // Initialize with a default value and only read/write localStorage on the client.
  const [filters, setFilters] = useState(() => getInitialFilters())

  // On mount, load saved filters from localStorage (if requested and available).
  useEffect(() => {
    if (!persist) return
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("filters")
        if (raw) {
          const parsed = JSON.parse(raw)
          setFilters(parsed)
        }
      }
    } catch (err) {
      // ignore malformed JSON or storage access errors
      // console.warn("useFilters: failed to read from localStorage", err);
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist changes to localStorage on the client when `filters` changes.
  useEffect(() => {
    if (!persist) return
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("filters", JSON.stringify(filters))
      }
    } catch (err) {
      // ignore quota/write errors
      // console.warn("useFilters: failed to write to localStorage", err);
    }
  }, [filters, persist])

  // ✅ reset everything
  const resetFilters = () => {
    const initial = getInitialFilters()
    setFilters(initial)
    try {
      if (persist && typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("filters", JSON.stringify(initial))
      }
    } catch (err) {
      // ignore
    }
  }

  // ✅ shallow update (top-level keys)
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // ✅ nested update (e.g. "location.country")
  const updateNested = (path, value) => {
    setFilters((prev) => {
      const updated = structuredClone(prev)
      const keys = path.split(".")
      let obj = updated
      while (keys.length > 1) {
        obj = obj[keys.shift()]
      }
      obj[keys[0]] = value
      return updated
    })
  }

  // ✅ remove specific filter (sets it to default)
  const clearFilter = (key) => {
    const initial = getInitialFilters()
    if (key in initial) {
      setFilters((prev) => ({ ...prev, [key]: initial[key] }))
    }
  }

  // ✅ helpful derived utility (count of active filters)
  const activeFilterCount = Object.entries(filters).reduce((acc, [key, val]) => {
    if (val && typeof val === "object" && Object.keys(val).length > 0) return acc + 1
    if (Array.isArray(val) && val.length > 0) return acc + 1
    if (typeof val === "string" && val.trim() !== "") return acc + 1
    if (typeof val === "boolean") return acc + 1
    return acc
  }, 0)

  return {
    filters,
    setFilters,
    updateFilter,
    updateNested,
    resetFilters,
    clearFilter,
    activeFilterCount,
  }
}

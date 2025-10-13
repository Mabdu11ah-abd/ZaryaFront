// Mock company API (separate from people mock-api)
// Provides a small set of companies with fields resembling the provided Mongoose schema.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const mockCompanies = [
  {
    id: "c1",
    name: "TechCorp Inc",
    fullName: "TechCorp Incorporated",
    tags: ["SaaS", "Enterprise"],
    allNames: ["TechCorp", "TechCorp Inc"],
    linkedinUrl: "https://linkedin.com/company/techcorp",
    homepageUri: "https://techcorp.com",
    diffbotUri: "https://api.diffbot.com/resource/techcorp",
    targetDiffbotId: "db-1001",
    emailAddresses: [{ contactString: "info@techcorp.com", type: "general" }],
    summary: "Enterprise cloud infrastructure provider",
    description: "Leading enterprise software company specializing in cloud infrastructure and DevOps tools.",
    domain: "techcorp.com",
    founders: [{ name: "Alice Johnson", summary: "Co-founder & CTO", diffboturi: "", targetDiffbotId: "" }],
    ceo: { name: "Robert Miles", summary: "CEO", diffboturi: "", targetDiffbotId: "" },
    phoneNumbers: [{ string: "+1-415-555-0101", digits: "+14155550101" }],
    revenue: { currency: "USD", value: 50000000 },
    nbEmployees: 250,
    nbEmployeesMin: 200,
    nbEmployeesMax: 300,
    size: "201-500",
    location: { country: { name: "United States" }, city: { name: "San Francisco" }, region: { name: "California" } },
    employeeCategories: [
      { firstHireDate: { str: "2010-01-01", precision: 3, timestamp: 1262304000 }, category: "engineering", nbEmployees: 120 },
    ],
    isNonProfit: false,
    isAcquired: false,
    isDissolved: false,
    isPublic: true,
    onDiffbot: true,
    hasEmployees: true,
    customers: [{ name: "BigBank", summary: "Financial customer" }],
    categories: [{ name: "Software", summary: "Enterprise Software", type: "industry", isPrimary: true }],
    origins: ["crawler", "diffbot"],
    technologies: ["React", "Node.js", "Kubernetes"],
    createdAt: new Date("2023-06-01"),
  },
  {
    id: "c2",
    name: "AI Innovations",
    fullName: "AI Innovations Labs",
    tags: ["AI", "ML"],
    allNames: ["AI Innovations"],
    linkedinUrl: "https://linkedin.com/company/ai-innovations",
    homepageUri: "https://aiinnovations.io",
    diffbotUri: "https://api.diffbot.com/resource/aiinnovations",
    targetDiffbotId: "db-1002",
    emailAddresses: [{ contactString: "contact@aiinnovations.io", type: "general" }],
    summary: "AI/ML research and product development",
    description: "Cutting-edge artificial intelligence research and product development company focused on ML.",
    domain: "aiinnovations.io",
    founders: [{ name: "Dr. Emily Stone", summary: "Founder & CSO", diffboturi: "", targetDiffbotId: "" }],
    ceo: { name: "Mark Lee", summary: "CEO", diffboturi: "", targetDiffbotId: "" },
    phoneNumbers: [{ string: "+1-617-555-0202", digits: "+16175550202" }],
    revenue: { currency: "USD", value: 15000000 },
    nbEmployees: 80,
    nbEmployeesMin: 50,
    nbEmployeesMax: 100,
    size: "51-200",
    location: { country: { name: "United States" }, city: { name: "Cambridge" }, region: { name: "Massachusetts" } },
    employeeCategories: [
      { firstHireDate: { str: "2018-03-01", precision: 3, timestamp: 1520000000 }, category: "research", nbEmployees: 35 },
    ],
    isNonProfit: false,
    isAcquired: false,
    isDissolved: false,
    isPublic: false,
    onDiffbot: true,
    hasEmployees: true,
    customers: [{ name: "TechCorp Inc", summary: "Platform partner" }],
    categories: [{ name: "Artificial Intelligence", summary: "AI/ML Solutions", type: "industry", isPrimary: true }],
    origins: ["diffbot"],
    technologies: ["Python", "TensorFlow", "PyTorch"],
    createdAt: new Date("2022-09-15"),
  },
  {
    id: "c3",
    name: "Growth Labs",
    fullName: "Growth Labs Marketing",
    tags: ["Marketing", "Agency"],
    allNames: ["Growth Labs"],
    linkedinUrl: "https://linkedin.com/company/growth-labs",
    homepageUri: "https://growthlabs.co",
    diffbotUri: "",
    targetDiffbotId: "",
    emailAddresses: [{ contactString: "hello@growthlabs.co", type: "general" }],
    summary: "Digital marketing and growth agency",
    description: "Full-service digital marketing agency specializing in growth marketing and SEO.",
    domain: "growthlabs.co",
    founders: [{ name: "Jessica Martinez", summary: "Founder & CMO", diffboturi: "", targetDiffbotId: "" }],
    ceo: { name: "Jessica Martinez", summary: "CEO", diffboturi: "", targetDiffbotId: "" },
    phoneNumbers: [{ string: "+1-212-555-0303", digits: "+12125550303" }],
    revenue: { currency: "USD", value: 8000000 },
    nbEmployees: 45,
    nbEmployeesMin: 30,
    nbEmployeesMax: 60,
    size: "11-50",
    location: { country: { name: "United States" }, city: { name: "New York" }, region: { name: "New York" } },
    employeeCategories: [
      { firstHireDate: { str: "2016-05-01", precision: 3, timestamp: 1462060800 }, category: "marketing", nbEmployees: 20 },
    ],
    isNonProfit: false,
    isAcquired: false,
    isDissolved: false,
    isPublic: false,
    onDiffbot: false,
    hasEmployees: true,
    customers: [{ name: "SalesForce Pro", summary: "Client" }],
    categories: [{ name: "Marketing", summary: "Digital Marketing", type: "industry", isPrimary: true }],
    origins: ["manual"],
    technologies: ["Google Analytics", "Segment", "HubSpot"],
    createdAt: new Date("2021-04-10"),
  },
]

export async function fetchCompanies(page = 1, pageSize = 20, filters = {}) {
  await delay(400)

  let results = [...mockCompanies]

  // Name filter
  if (filters?.name) {
    results = results.filter((c) => c.name.toLowerCase().includes(filters.name.toLowerCase()))
  }

  // Tags filter (tags array contains any)
  if (filters?.tags?.length > 0) {
    results = results.filter((c) => c.tags && c.tags.some((t) => filters.tags.includes(t)))
  }

  // Categories filter (categories array of objects with name)
  if (filters?.categories?.length > 0) {
    results = results.filter((c) => c.categories && c.categories.some((cat) => filters.categories.includes(cat.name)))
  }

  // Technologies filter
  if (filters?.technologies?.length > 0) {
    results = results.filter((c) => c.technologies && c.technologies.some((tech) => filters.technologies.includes(tech)))
  }

  // nbEmployees min/max
  if (filters?.nbEmployees?.min != null) {
    results = results.filter((c) => c.nbEmployees >= filters.nbEmployees.min)
  }
  if (filters?.nbEmployees?.max != null) {
    results = results.filter((c) => c.nbEmployees <= filters.nbEmployees.max)
  }

  // origins
  if (filters?.origins?.length > 0) {
    results = results.filter((c) => c.origins && c.origins.some((o) => filters.origins.includes(o)))
  }

  // onDiffbot flag
  if (filters?.onDiffbot === true) {
    results = results.filter((c) => c.onDiffbot)
  }

  const total = results.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = results.slice(start, end)

  return { data, total, page, pageSize, totalPages }
}

export async function fetchCompanyById(companyId) {
  await delay(300)
  return mockCompanies.find((c) => c.id === companyId) || null
}

export async function fetchCompanyFilterSuggestions(filterType, query) {
  await delay(200)

  const suggestions = {
    tags: Array.from(new Set(mockCompanies.flatMap((c) => c.tags || []))),
    categories: Array.from(new Set(mockCompanies.flatMap((c) => (c.categories || []).map((x) => x.name)))),
    technologies: Array.from(new Set(mockCompanies.flatMap((c) => c.technologies || []))),
    origins: Array.from(new Set(mockCompanies.flatMap((c) => c.origins || []))),
    company: mockCompanies.map((c) => c.name),
  }

  const items = suggestions[filterType] || []
  return items.filter((item) => item.toLowerCase().includes((query || "").toLowerCase()))
}

export default { fetchCompanies, fetchCompanyById, fetchCompanyFilterSuggestions }

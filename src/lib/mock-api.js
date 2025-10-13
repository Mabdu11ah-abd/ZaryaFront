// Mock API functions with placeholder data


// Mock people data
const mockPeople = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Chen",
    description: "VP of Engineering with 10+ years in SaaS",
    role: ["VP Engineering", "Technical Leader"],
    linkedInUrl: "https://linkedin.com/in/sarah-chen",
    tags: ["Engineering", "Leadership", "SaaS"],
    hasEmail: true,
    company: { id: "c1", name: "TechCorp Inc", domain: "techcorp.com" },
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Rodriguez",
    description: "Head of Sales driving revenue growth",
    role: ["Head of Sales", "Revenue Leader"],
    linkedInUrl: "https://linkedin.com/in/michael-rodriguez",
    tags: ["Sales", "B2B", "Enterprise"],
    hasEmail: true,
    company: { id: "c2", name: "SalesForce Pro", domain: "salesforcepro.com" },
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Thompson",
    description: "Product Manager specializing in AI/ML products",
    role: ["Senior Product Manager", "AI Specialist"],
    linkedInUrl: "https://linkedin.com/in/emily-thompson",
    tags: ["Product", "AI", "Machine Learning"],
    hasEmail: false,
    company: { id: "c3", name: "AI Innovations", domain: "aiinnovations.io" },
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Kim",
    description: "CTO and co-founder of fintech startup",
    role: ["CTO", "Co-Founder"],
    linkedInUrl: "https://linkedin.com/in/david-kim",
    tags: ["CTO", "Fintech", "Startup"],
    hasEmail: true,
    company: { id: "c4", name: "FinTech Solutions", domain: "fintechsol.com" },
  },
  {
    id: "5",
    firstName: "Jessica",
    lastName: "Martinez",
    description: "Marketing Director with expertise in growth",
    role: ["Marketing Director", "Growth Lead"],
    linkedInUrl: "https://linkedin.com/in/jessica-martinez",
    tags: ["Marketing", "Growth", "Digital"],
    hasEmail: true,
    company: { id: "c5", name: "Growth Labs", domain: "growthlabs.co" },
  },
  {
    id: "6",
    firstName: "James",
    lastName: "Wilson",
    description: "Senior Software Engineer specializing in backend",
    role: ["Senior Software Engineer", "Backend Developer"],
    linkedInUrl: "https://linkedin.com/in/james-wilson",
    tags: ["Engineering", "Backend", "Cloud"],
    hasEmail: false,
    company: { id: "c1", name: "TechCorp Inc", domain: "techcorp.com" },
  },
  {
    id: "7",
    firstName: "Amanda",
    lastName: "Brown",
    description: "Chief Revenue Officer driving enterprise sales",
    role: ["CRO", "Enterprise Sales"],
    linkedInUrl: "https://linkedin.com/in/amanda-brown",
    tags: ["Revenue", "Enterprise", "Sales"],
    hasEmail: true,
    company: { id: "c6", name: "Enterprise Cloud", domain: "enterprisecloud.com" },
  },
  {
    id: "8",
    firstName: "Robert",
    lastName: "Taylor",
    description: "Data Science Lead building ML pipelines",
    role: ["Data Science Lead", "ML Engineer"],
    linkedInUrl: "https://linkedin.com/in/robert-taylor",
    tags: ["Data Science", "ML", "Analytics"],
    hasEmail: true,
    company: { id: "c3", name: "AI Innovations", domain: "aiinnovations.io" },
  },
]

// Mock companies data
const mockCompanies = [
  {
    id: "c1",
    name: "TechCorp Inc",
    fullName: "TechCorp Incorporated",
    description:
      "Leading enterprise software company specializing in cloud infrastructure and DevOps tools. Serving Fortune 500 companies worldwide.",
    summary: "Enterprise cloud infrastructure provider",
    domain: "techcorp.com",
    revenue: { currency: "USD", value: 50000000 },
    nbEmployees: 250,
    nbEmployeesMin: 200,
    nbEmployeesMax: 300,
    categories: [
      { name: "Software", summary: "Enterprise Software", type: "industry", isPrimary: true },
      { name: "Cloud Computing", summary: "Cloud Infrastructure", type: "technology", isPrimary: false },
    ],
  },
  {
    id: "c2",
    name: "SalesForce Pro",
    fullName: "SalesForce Professional Services",
    description:
      "B2B sales enablement platform helping companies scale their revenue operations with AI-powered insights and automation.",
    summary: "Sales enablement and CRM platform",
    domain: "salesforcepro.com",
    revenue: { currency: "USD", value: 25000000 },
    nbEmployees: 150,
    nbEmployeesMin: 100,
    nbEmployeesMax: 200,
    categories: [
      { name: "SaaS", summary: "Software as a Service", type: "industry", isPrimary: true },
      { name: "Sales Technology", summary: "Sales Automation", type: "technology", isPrimary: false },
    ],
  },
  {
    id: "c3",
    name: "AI Innovations",
    fullName: "AI Innovations Labs",
    description:
      "Cutting-edge artificial intelligence research and product development company focused on machine learning solutions for enterprise.",
    summary: "AI/ML research and development",
    domain: "aiinnovations.io",
    revenue: { currency: "USD", value: 15000000 },
    nbEmployees: 80,
    nbEmployeesMin: 50,
    nbEmployeesMax: 100,
    categories: [
      { name: "Artificial Intelligence", summary: "AI/ML Solutions", type: "industry", isPrimary: true },
      { name: "Technology", summary: "Advanced Technology", type: "industry", isPrimary: false },
    ],
  },
  {
    id: "c4",
    name: "FinTech Solutions",
    fullName: "FinTech Solutions Group",
    description:
      "Financial technology startup revolutionizing digital payments and banking infrastructure for modern businesses.",
    summary: "Digital payments and banking platform",
    domain: "fintechsol.com",
    revenue: { currency: "USD", value: 10000000 },
    nbEmployees: 60,
    nbEmployeesMin: 50,
    nbEmployeesMax: 75,
    categories: [
      { name: "Financial Services", summary: "FinTech", type: "industry", isPrimary: true },
      { name: "Payments", summary: "Digital Payments", type: "technology", isPrimary: false },
    ],
  },
  {
    id: "c5",
    name: "Growth Labs",
    fullName: "Growth Labs Marketing",
    description:
      "Full-service digital marketing agency specializing in growth marketing, SEO, and performance advertising for B2B SaaS companies.",
    summary: "Digital marketing and growth agency",
    domain: "growthlabs.co",
    revenue: { currency: "USD", value: 8000000 },
    nbEmployees: 45,
    nbEmployeesMin: 40,
    nbEmployeesMax: 50,
    categories: [
      { name: "Marketing", summary: "Digital Marketing", type: "industry", isPrimary: true },
      { name: "Advertising", summary: "Performance Marketing", type: "technology", isPrimary: false },
    ],
  },
  {
    id: "c6",
    name: "Enterprise Cloud",
    fullName: "Enterprise Cloud Systems",
    description:
      "Enterprise-grade cloud computing and data center solutions provider serving large organizations with mission-critical infrastructure needs.",
    summary: "Enterprise cloud infrastructure",
    domain: "enterprisecloud.com",
    revenue: { currency: "USD", value: 75000000 },
    nbEmployees: 400,
    nbEmployeesMin: 350,
    nbEmployeesMax: 450,
    categories: [
      { name: "Cloud Services", summary: "Enterprise Cloud", type: "industry", isPrimary: true },
      { name: "Infrastructure", summary: "Data Centers", type: "technology", isPrimary: false },
    ],
  },
]

// Mock collections data
const mockCollections = [
  {
    id: "col1",
    name: "Enterprise CTOs",
    type: "people",
    description: "CTOs and VPs of Engineering from enterprise companies",
    itemCount: 3,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "col2",
    name: "SaaS Companies",
    type: "company",
    description: "B2B SaaS companies with 50-500 employees",
    itemCount: 5,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "col3",
    name: "Sales Leaders",
    type: "people",
    description: "Heads of Sales and CROs from tech companies",
    itemCount: 2,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "col4",
    name: "AI/ML Companies",
    type: "company",
    description: "Companies focused on artificial intelligence and machine learning",
    itemCount: 3,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-19"),
  },
  {
    id: "col5",
    name: "Marketing Directors",
    type: "people",
    description: "Marketing and growth leaders from various industries",
    itemCount: 1,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-21"),
  },
]

const collectionItems = {
  col1: ["1", "4", "6"], // Sarah Chen, David Kim, James Wilson
  col2: ["c1", "c2", "c3", "c4", "c5"],
  col3: ["2", "7"], // Michael Rodriguez, Amanda Brown
  col4: ["c3", "c4", "c6"],
  col5: ["5"], // Jessica Martinez
}

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchPeople(page = 1, pageSize = 20, filters) {
  await delay(500) // Simulate network delay

  // Apply basic filtering (in real app, this would be server-side)
  let filteredPeople = [...mockPeople]

  if (filters?.people?.role?.length > 0) {
    filteredPeople = filteredPeople.filter((person) =>
  person.role.some((r) => filters.people.role.some((fr) => r.toLowerCase().includes(fr.toLowerCase()))),
    )
  }

  if (filters?.name) {
    filteredPeople = filteredPeople.filter((person) =>
      person.company.name.toLowerCase().includes(filters.name.toLowerCase()),
    )
  }

  const total = filteredPeople.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = filteredPeople.slice(start, end)

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  }
}

// Mock filter suggestions
export async function fetchFilterSuggestions(filterType, query) {
  await delay(300)

  const suggestions = {
    role: [
      "VP Engineering",
      "CTO",
      "Head of Sales",
      "Product Manager",
      "Marketing Director",
      "Software Engineer",
      "Data Scientist",
      "CEO",
      "CFO",
      "COO",
    ],
    company: [
      "TechCorp Inc",
      "SalesForce Pro",
      "AI Innovations",
      "FinTech Solutions",
      "Growth Labs",
      "Enterprise Cloud",
    ],
    tags: [
      "Engineering",
      "Sales",
      "Marketing",
      "Product",
      "AI",
      "SaaS",
      "Fintech",
      "Enterprise",
      "Startup",
      "Leadership",
    ],
  }

  const items = suggestions[filterType] || []
  return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
}

// Mock scrape function
export async function scrapePeople(
  companyPrompt,
  roles,
) {
  await delay(2000) // Simulate scraping delay

  return {
    success: true,
    message: "Successfully scraped leads based on your criteria",
    count: Math.floor(Math.random() * 50) + 10,
  }
}

export async function fetchPersonDetail(personId) {
  await delay(500)

  const person = mockPeople.find((p) => p.id === personId)
  if (!person) return null

  const company = mockCompanies.find((c) => c.id === person.company.id)
  if (!company) return null

  return {
    ...person,
    companyDetails: company,
  }
}

export async function fetchCollections() {
  await delay(500)
  return mockCollections
}

export async function fetchCollectionById(collectionId) {
  await delay(500)
  return mockCollections.find((c) => c.id === collectionId) || null
}

export async function fetchCollectionPeople(
  collectionId,
  page = 1,
  pageSize = 20,
) {
  await delay(500)

  const itemIds = collectionItems[collectionId] || []
  const people = mockPeople.filter((p) => itemIds.includes(p.id))

  const total = people.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = people.slice(start, end)

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  }
}

export async function fetchCollectionCompanies(collectionId) {
  await delay(500)

  const itemIds = collectionItems[collectionId] || []
  return mockCompanies.filter((c) => itemIds.includes(c.id))
}


// In-memory mock campaigns
const mockCampaigns = [
  {
    id: "camp1",
    name: "Onboarding CTOs",
    active: false,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
    steps: [
      {
        id: "s1",
        type: "template-email",
        name: "Intro email",
        subject: "Quick intro re: DevOps platform",
        body: "Hi {{firstName}},\n\nWe help teams like {{company}} speed up deployments by 35%.\nAre you open to a 10-min chat next week?\n\nBest,\n{{senderName}}",
        delayDays: 0,
      },
      {
        id: "s2",
        type: "ai-email",
        name: "Follow-up with AI",
        prompt: "Write a concise, friendly follow-up referencing our intro and any public news about the company.",
        subjectTemplate: "Following up on potential fit",
        delayDays: 3,
      },
    ],
    metrics: { leads: 42, emailsSent: 120, replies: 9 },
  },
  {
    id: "camp2",
    name: "Marketing Leaders Outreach",
    active: true,
    createdAt: new Date("2024-03-12"),
    updatedAt: new Date("2024-03-14"),
    steps: [
      {
        id: "s1",
        type: "template-email",
        name: "Value prop",
        subject: "Ideas to boost {{company}}'s pipeline",
        body: "Hi {{firstName}},\n\nWe recently helped a peer increase demo conversions by 18%.\nWorth a short chat?\n\nBest,\n{{senderName}}",
        delayDays: 0,
      },
    ],
    metrics: { leads: 19, emailsSent: 58, replies: 6 },
  },
]

// Helpers
const genId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`

// Campaign APIs (mocked)
export async function fetchCampaigns() {
  await delay(400)
  return [...mockCampaigns]
}

export async function fetchCampaignById(id) {
  await delay(400)
  if (id === "new") {
    return {
      id: "new",
      name: "Untitled campaign",
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      steps: [],
      metrics: { leads: 0, emailsSent: 0, replies: 0 },
    }
  }
  return mockCampaigns.find((c) => c.id === id) ?? null
}

export async function toggleCampaignActive(id, active){
  await delay(250)
  const idx = mockCampaigns.findIndex((c) => c.id === id)
  if (idx === -1) return null
  mockCampaigns[idx] = {
    ...mockCampaigns[idx],
    active,
    updatedAt: new Date(),
  }
  return mockCampaigns[idx]
}

export async function saveCampaign(
  id,
  payload,
) {
  await delay(500)
  if (id === "new") {
    const newId = genId("camp")
    const created = {
      id: newId,
      name: payload.name || "Untitled campaign",
      active: !!payload.active,
      steps: payload.steps || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: { leads: 0, emailsSent: 0, replies: 0 },
    }
    mockCampaigns.unshift(created)
    return created
  }
  const idx = mockCampaigns.findIndex((c) => c.id === id)
  if (idx === -1) {
    const created = {
      id,
      name: payload.name || "Untitled campaign",
      active: !!payload.active,
      steps: payload.steps || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: { leads: 0, emailsSent: 0, replies: 0 },
    }
    mockCampaigns.unshift(created)
    return created
  }
  mockCampaigns[idx] = {
    ...mockCampaigns[idx],
    ...payload,
    updatedAt: new Date(),
  }
  return mockCampaigns[idx]
}
// Company search and collection membership helpers

export async function fetchCompanies(page = 1, pageSize = 20, query = "", filters) {
  await delay(400)
  let items = [...mockCompanies]

  if (query.trim()) {
    const q = query.toLowerCase()
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.fullName?.toLowerCase().includes(q) ?? false) ||
        (c.summary?.toLowerCase().includes(q) ?? false) ||
        (c.description?.toLowerCase().includes(q) ?? false)
    )
  }

  if (filters?.tags && filters.tags.length > 0) {
    const tagSet = new Set(filters.tags.map((t) => t.toLowerCase()))
    items = items.filter((c) =>
      c.categories.some((cat) => [...tagSet].some((t) => cat.name.toLowerCase().includes(t)))
    )
  }

  if (filters?.nbEmployees) {
    const { min, max } = filters.nbEmployees
    items = items.filter((c) => {
      const n = c.nbEmployees ?? 0
      if (min != null && n < min) return false
      if (max != null && n > max) return false
      return true
    })
  }

  if (filters?.revenue) {
    const min = filters.revenue.min ?? null
    const max = filters.revenue.max ?? null
    items = items.filter((c) => {
      const v = c.revenue?.value ?? 0
      if (min != null && v < min) return false
      if (max != null && v > max) return false
      return true
    })
  }

  if (filters?.location) {
    const country = filters.location.country?.toLowerCase()?.trim()
    const city = filters.location.city?.toLowerCase()?.trim()
    // MockCompanies don't include location; keep hook in place for future
    void country
    void city
  }

  const total = items.length
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return { data: items.slice(start, end), total, page, pageSize, totalPages }
}

// Company collections helpers
export async function fetchCompanyCollections() {
  await delay(250)
  return mockCollections.filter((c) => c.type === "company")
}

export async function fetchMembershipForCompanies(companyIds) {
  await delay(200)
  const companyCollections = mockCollections.filter((c) => c.type === "company").map((c) => c.id)
  const result = {}
  for (const cid of companyIds) {
    const inCollections = Object.entries(collectionItems)
      .filter(([colId, ids]) => companyCollections.includes(colId) && ids.includes(cid))
      .map(([colId]) => colId)
    result[cid] = inCollections
  }
  return result
}

export async function addCompaniesToCollection(collectionId, companyIds) {
  await delay(300)
  const col = mockCollections.find((c) => c.id === collectionId && c.type === "company")
  if (!col) return { success: false }
  const existing = new Set(collectionItems[collectionId] || [])
  for (const id of companyIds) existing.add(id)
  collectionItems[collectionId] = Array.from(existing)
  col.itemCount = collectionItems[collectionId].length
  col.updatedAt = new Date()
  return { success: true, updated: col }
}

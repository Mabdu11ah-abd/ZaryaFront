"use client";

import { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Users, Edit, Trash2 } from "lucide-react";
import { Github, Linkedin, Twitter, Link as LinkIcon } from "lucide-react";
import CompanyDetailDialogue from "./CompanyDetailDialogue";
import { useRouter } from "next/navigation";


export function CompaniesTable({
  filters,
  refreshTrigger,
  selectedCompanies,
  setSelectedCompanies,
  onCompaniesLoaded, // optional callback to expose visible company rows to parent 
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewingCompany, setViewingCompany] = useState(null);
  const pageSize = 20;
  const router = useRouter();
  
  const lastFetchKeyRef = useRef(null);

  useEffect(() => {
    const serializedFilters = JSON.stringify(filters || {});
    const fetchKey = `${page}|${refreshTrigger}|${serializedFilters}`;

    // Prevent duplicate fetches when deps produce the same key (also avoids double-fetch in StrictMode)
    if (lastFetchKeyRef.current === fetchKey) return;
    lastFetchKeyRef.current = fetchKey;

    const loadCompanies = async () => {
      console.log("Fetching companies for page:", page, "key:", fetchKey);
      setLoading(true);
      try {
        // make post request
        const resp = await fetch("http://localhost:3003/companies/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page,
            pageSize,
            filters,
          }),
        });

        const json = await resp.json();
        console.log("Fetched companies json:", json);

        const items = Array.isArray(json.data) ? json.data : [];
        setCompanies(items);
        setTotal(json?.total ?? (Array.isArray(items) ? items.length : 0));
        setTotalPages(json?.totalPages ?? 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refreshTrigger, JSON.stringify(filters || {})]);

  // Reset to first page when filters change (deep-watch)
  useEffect(() => {
    setPage(1);
  }, [JSON.stringify(filters || {})]);

  useEffect(() => {
    console.log("Updated companies state:", companies);
  }, [companies]);

  // Notify parent of currently visible rows when they change
  useEffect(() => {
    try {
      if (typeof onCompaniesLoaded === "function") {
        onCompaniesLoaded(companies || []);
      }
    } catch (err) {
      console.warn("onCompaniesLoaded callback threw:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companies]);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const formatEmployeeCount = (company) => {
    if (company.nbEmployees) {
      return company.nbEmployees.toLocaleString();
    }
    if (company.nbEmployeesMin && company.nbEmployeesMax) {
      return `${company.nbEmployeesMin.toLocaleString()} - ${company.nbEmployeesMax.toLocaleString()}`;
    }
    if (company.size) {
      return company.size;
    }
    return "N/A";
  };

  const formatRevenue = (revenue) => {
    if (!revenue?.value) return "N/A";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: revenue.currency || "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return formatter.format(revenue.value);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const onPeopleClick = async (companyLinkedin, companyId) => {
    // fetch new people for that company
    const people = await fetch(`http://localhost:3004/people/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companies: [
          { companyId: companyId, companyLinkedin: companyLinkedin },
        ],
      }),
    });

    const peopleData = await people.json();
    console.log("Fetched people data:", peopleData);

    // save the people to local storage if available and data is valid
    try {
      if (
        typeof window !== "undefined" &&
        peopleData &&
        Object.keys(peopleData).length > 0
      ) {
        localStorage.setItem(
          "zarya:latestPeopleResults",
          JSON.stringify(peopleData)
        );
        // Verify if it was set
        const stored = localStorage.getItem("zarya:latestPeopleResults");
        if (!stored) {
          console.warn("People data was not saved to local storage.");
        }
      } else {
        console.warn("No people data to save or localStorage unavailable.");
      }
    } catch (error) {
      console.error("Error saving people data to local storage:", error);
    }

    // navigate to people page
    router.push("/people");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-semibold">
                <Checkbox
                  checked={
                    companies.length > 0 &&
                    Array.isArray(selectedCompanies) &&
                    selectedCompanies.length === companies.length
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCompanies(
                        companies.map((company) => company._id || company.id)
                      );
                    } else {
                      setSelectedCompanies([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
              <TableHead className="font-semibold">Links</TableHead>
              <TableHead className="font-semibold">Employees</TableHead>
              <TableHead className="font-semibold">Revenue</TableHead>
              <TableHead className="font-semibold">Industries</TableHead>
              <TableHead className="font-semibold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No companies found matching your filters
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or search for new companies
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow
                  key={company._id || company.id}
                  className="border-border"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedCompanies.includes(
                        company._id || company.id
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCompanies((prev) => [
                            ...prev,
                            company._id || company.id,
                          ]);
                        } else {
                          setSelectedCompanies((prev) =>
                            prev.filter(
                              (id) => id !== (company._id || company.id)
                            )
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {company.name || "Unknown Company"}
                      </span>
                      {company.location?.city?.name && (
                        <span className="text-xs text-muted-foreground">
                          {company.location.city.name}
                          {company.location.country?.name &&
                            `, ${company.location.country.name}`}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* View Company */}
                      <Button variant="ghost" size="sm" title="View Company">
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Scrape People */}
                      <Button variant="ghost" size="sm" title="Scrape People" onClick={() => onPeopleClick(company.linkedinUrl, company._id || company.id)}>
                        <Users className="h-4 w-4" />
                      </Button>

                      {/* Edit Company */}
                      <Button variant="ghost" size="sm" title="Edit Company">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* GitHub */}
                      {/* {company.githubUrl && ( */}
                      <a
                        // href={company.githubUrl}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4 text-gray-600 hover:text-black cursor-pointer" />
                      </a>
                      {/* )} */}

                      {/* LinkedIn */}
                      {/* {company.linkedinUrl && ( */}
                      <a
                        // href={company.linkedinUrl}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4 text-blue-600 hover:text-blue-700 cursor-pointer" />
                      </a>
                      {/* )} */}

                      {/* Twitter */}
                      {/* {company.twitterUrl && ( */}
                      <a
                        // href={company.twitterUrl}
                        // target="_blank"
                        // rel="noopener noreferrer"
                        title="Twitter / X"
                      >
                        <Twitter className="h-4 w-4 text-sky-500 hover:text-sky-600 cursor-pointer" />
                      </a>
                      {/* )} */}

                      {/* Domain */}
                      {/* {company.domain?.name && ( */}
                      <a
                        // href={
                        //   company.domain.name.startsWith("http")
                        //     ? company.domain.name
                        //     : `https://${company.domain.name}`
                        // }
                        // target="_blank"
                        // rel="noopener noreferrer"
                        title="Company Website"
                      >
                        <LinkIcon className="h-4 w-4 text-green-600 hover:text-green-700 cursor-pointer" />
                      </a>
                      {/* )} */}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatEmployeeCount(company)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatRevenue(company.revenue)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {company.categories && company.categories.length > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 gap-1"
                          >
                            <span className="text-xs">
                              {company.categories[0]?.name}
                            </span>
                            {company.categories.length > 1 && (
                              <Badge
                                variant="secondary"
                                className="text-xs h-4 px-1"
                              >
                                +{company.categories.length - 1}
                              </Badge>
                            )}
                            <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">
                              All Industries
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {company.categories.map((cat, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {cat.name}
                                  {cat.isPrimary && " ⭐"}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <CompanyDetailDialogue company={company} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {companies.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} companies
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{page}</span>
            <span className="text-sm text-muted-foreground">of</span>
            <span className="text-sm font-medium">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

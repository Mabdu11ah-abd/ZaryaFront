"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  MailX,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
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
import { fetchPeople } from "@/lib/mock-api";
import { Checkbox } from "@/components/ui/checkbox";

export function PeopleTable({ filters, refreshTrigger, selectedPeople, setSelectedPeople  }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const loadPeople = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3004/people/list-with-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, pageSize, filters }),
      });

      console.log("Fetching people with filters:", { page, pageSize, filters });
      
      const data = await response.json();
      console.log("Fetched people data:", data);

      const items = Array.isArray(data.data) ? data.data : [];
      setPeople(items);
      setTotal(data?.total ?? (Array.isArray(items) ? items.length : 0));
      setTotalPages(data?.totalPages ?? 1);

      setLoading(false);
    };

    loadPeople();
  }, []);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="font-semibold">
                <Checkbox
                  checked={selectedPeople.length === people.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedPeople(people.map((person) => person.id));
                    } else {
                      setSelectedPeople([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">
                      No leads found matching your filters
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your filters or scrape new leads
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              people.map((person) => (
                <TableRow key={person.id} className="border-border">
                  <TableCell>
                    <Checkbox
                      checked={selectedPeople.includes(person.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedPeople((prev) => [...prev, person.id]);
                        } else {
                          setSelectedPeople((prev) =>
                            prev.filter((id) => id !== person.id)
                          );
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {person.fullName}
                      </span>
                      {person.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {person.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {person.roles.slice(0, 2).map((role, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                      {person.roles.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{person.role.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{person.companySlug ? person.companySlug : "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {person.hasEmail ? (
                      <Badge
                        variant="default"
                        className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20"
                      >
                        <Mail className="mr-1 h-3 w-3" />
                        Available
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground"
                      >
                        <MailX className="mr-1 h-3 w-3" />
                        Not found
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8 px-2"
                    >
                      <a
                        href={person.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
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
          Showing {people.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} leads
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

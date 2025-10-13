"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { label } from "@/components/ui/label";
import { useFilters } from "@/hooks/use-filter";
import { CompaniesFilter } from "@/components/company/companies-filter";
import { ScrapeDialog } from "@/components/people/scrape-dialog";
import { CompaniesTable } from "@/components/company/companies-table";
import AddToListDialog from "@/components/people/addToListDialog";
import { Building2, PlusCircle, Bookmark, Database, Users } from "lucide-react";

export default function CompaniesRevampPage() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const {
    filters,
    updateFilter,
    updateNested,
    resetFilters,
    activeFilterCount,
  } = useFilters(true);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleApplyFilters = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-balance">
                    Lead Finder
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Discover and connect with your ideal prospects
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/** Create new campaign dropdown button*/}
                <Button
                  variant="outline"
                  className={selectedCompanies.length === 0 ? "hidden" : ""}
                >
                  Find People
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Create New Campaign</Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => alert("Feature coming soon!")}
                    >
                      Start from Scratch
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <CompaniesFilter
                  filters={filters}
                  updateNested={updateNested}
                  resetFilters={resetFilters}
                  activeFilterCount={activeFilterCount}
                  onApply={() => {}}
                />
                <AddToListDialog
                  selectedItems={selectedCompanies}
                  type="company"
                />
                <ScrapeDialog />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Total Companies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Companies
                      </p>
                      <p className="text-2xl font-bold">1,248</p>
                    </div>
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* New Companies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        New Companies
                      </p>
                      <p className="text-2xl font-bold">82</p>
                    </div>
                    <PlusCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Saved Companies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Saved Companies
                      </p>
                      <p className="text-2xl font-bold">317</p>
                    </div>
                    <Bookmark className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Enriched Companies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Enriched Companies
                      </p>
                      <p className="text-2xl font-bold">954</p>
                    </div>
                    <Database className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* With People Data */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        With People Data
                      </p>
                      <p className="text-2xl font-bold">428</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>


          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <CompaniesTable
            filters={filters}
            refreshTrigger={refreshTrigger}
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
          />
        </main>
      </div>
    </>
  );
}

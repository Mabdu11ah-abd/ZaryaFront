"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { useFilters } from "@/hooks/use-filter";
import { FilterDialog } from "@/components/people/filter-dialog";
import { ScrapeDialog } from "@/components/people/scrape-dialog";
import { PeopleTable } from "@/components/people/people-table";
import { AddToListDialog } from "@/components/people/addToListDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function PeoplePage() {
  const {
    filters,
    updateFilter,
    updateNested,
    resetFilters,
    activeFilterCount,
  } = useFilters(true);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);  

  const handleApplyFilters = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Lead Finder</h1>
                <p className="text-sm text-muted-foreground">
                  Discover and connect with your ideal prospects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/** Create new campaign dropdown button*/}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Create New Campaign</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => alert("Feature coming soon!")}>
                    Start from Scratch
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AddToListDialog selectedPeople={selectedPeople} />
              <FilterDialog
                filters={filters}
                updateNested={updateNested}
                resetFilters={resetFilters}
                activeFilterCount={activeFilterCount}
                onApply={handleApplyFilters}
              />
              <ScrapeDialog />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm  font-medium text-muted-foreground">
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,857</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+12%</span> from last month
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  With Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,241</div>
                <p className="text-xs text-muted-foreground mt-1">
                  67% email coverage
                </p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeFilterCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Refining your search
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <PeopleTable
          filters={filters}
          refreshTrigger={refreshTrigger}
          selectedPeople={selectedPeople}
          setSelectedPeople={setSelectedPeople}
        />
      </main>
    </div>
  );
}

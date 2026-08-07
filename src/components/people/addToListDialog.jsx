"use client";
import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock function to simulate fetching collections with membership info
// const fetchCollectionsWithMembership = async (type, selectedIds) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500));

//   // Mock data for existing lists
//   const mockLists = type === "companies"
//     ? [
//         { id: "list-1", name: "Sales Q4 Targets", itemCount: 45 },
//         { id: "list-2", name: "Hot Leads", itemCount: 23 },
//         { id: "list-3", name: "Marketing Prospects", itemCount: 67 },
//         { id: "list-4", name: "Cold Outreach", itemCount: 89 },
//       ]
//     : [
//         { id: "list-1", name: "Key Decision Makers", itemCount: 34 },
//         { id: "list-2", name: "Engineering Contacts", itemCount: 56 },
//         { id: "list-3", name: "C-Suite Prospects", itemCount: 12 },
//         { id: "list-4", name: "Follow-up Queue", itemCount: 78 },
//       ];

//   return mockLists;
// };

const baseapiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001";
const fetchCollectionsWithMembership = async (type, selectedIds) => {
  if (type === "companies") {
      const response = await fetch(`${baseapiUrl}/lists?type=COMPANY_LIST`)
    const data = await response.json();
    return data;
  } else {
    const response = await fetch(`${baseapiUrl}/lists?type=PEOPLE_LIST`);
    const data = await response.json();
    return data;
  }
};

// Mock function to get existing memberships for selected items
const getItemMemberships = async (type, selectedIds) => {
  // is company boolean
  const isCompany = type === "companies" || type === "company";
  console.log("Fetching memberships for", isCompany ? "companies" : "people", selectedIds);
  // promise of an array of lists
  const promises = selectedIds.map(async (id) => {
    const url = isCompany ? `/companies/${id}/lists` : `/people/${id}/lists`; // construct url based on is company
    const res = await fetch(url);
    if (!res.ok) return { id, existingLists: [] };
    const lists = await res.json();
    // expecting array of lists
    return { id, existingLists: Array.isArray(lists) ? lists : [] };
  });

  return Promise.all(promises);
};

export function AddToListDialog({
  selectedPeople,
  selectedCompanies,
  selectedItems,
  type = "people",
}) {
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [itemMemberships, setItemMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [previewExpanded, setPreviewExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize selected items
  const selected = selectedCompanies || selectedPeople || selectedItems || [];
  const isCompany = type === "companies" || type === "company";
  const itemLabel = isCompany ? "company" : "person";
  const itemPlural = isCompany ? "companies" : "people";

  const getItemName = (item) => {
    if (isCompany) {
      return item.name || item.fullName || "Unknown Company";
    }
    return (
      `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
      "Unknown Person"
    );
  };

  const openDialog = async (next) => {
    setOpen(next);
    if (next) {
      setLoading(true);
      try {
        console.log("in open dialog selected is  ")
        console.log(selected)

        // Fetch both collections and membership info
        const [cols, memberships] = await Promise.all([
          fetchCollectionsWithMembership(type, selected),
          getItemMemberships(type, selected),
        ]);

        setCollections(cols);
        setItemMemberships(memberships);
        if (cols.length > 0) setSelectedCollection(cols[0].id);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      // Creating a new list (create + add items)
      if (creatingNew) {
        if (!newListName.trim()) {
          alert("Please provide a name for the new list");
          setLoading(false);
          return;
        }
        console.log("Creating new list:", newListName);
        console.log("selected items:", selected);
        const response = await fetch("http://localhost:4001/lists/createwithitems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newListName,
            type: isCompany ? "COMPANY_LIST" : "PEOPLE_LIST",
            items: selected,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create new list");
        }

        // created successfully — close dialog and reset creation state
        setOpen(false);
        setNewListName("");
        setCreatingNew(false);
        return;
      }

      // Adding to an existing list
      if (!selectedCollection) {
        alert("Select a list to add to");
        setLoading(false);
        return;
      }

      const ids = selected.map((item) => item._id || item.id).filter(Boolean);
      if (ids.length === 0) {
        alert("No items selected to add");
        setLoading(false);
        return;
      }

      const endpoint = `http://localhost:4001/lists/${selectedCollection}/${
        isCompany ? "companies" : "people"
      }`;

      const payload = isCompany
        ? { companyIds: ids, items: ids }
        : { personIds: ids, items: ids };

      const addRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!addRes.ok) {
        throw new Error("Failed to add items to list");
      }

      // success
      setOpen(false);
    } catch (err) {
      console.error("Error adding to list:", err);
      alert("Error adding to list");
    } finally {
      setLoading(false);
    }
  };

  // Calculate duplicates per list
  const getDuplicateCount = (listId) => {
    return itemMemberships.filter((membership) =>
      membership.existingLists.some((list) => list.id === listId)
    ).length;
  };

  // Filter collections based on search
  const filteredCollections = collections.filter((col) =>
    col.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative bg-transparent"
          disabled={selected.length === 0}
        >
          <Filter className="mr-2 h-4 w-4" />
          Add {selected.length > 0 ? selected.length : ""} to List
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[6    0vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add {itemPlural.charAt(0).toUpperCase() + itemPlural.slice(1)} to
            List
          </DialogTitle>
          <DialogDescription>
            Review selected {itemPlural} and choose a list to add them to.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-2">
            {/* Selected Items Preview */}
            <div className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setPreviewExpanded(!previewExpanded)}
                className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium">
                  Selected{" "}
                  {itemPlural.charAt(0).toUpperCase() + itemPlural.slice(1)} (
                  {selected.length})
                </span>
                {previewExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {previewExpanded && (
                <div className="p-3 space-y-3">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">
                      Loading memberships...
                    </p>
                  ) : (
                    selected.map((item, idx) => {
                      const membership = itemMemberships.find(
                        (m) => m.id === (item._id || item.id)
                      );
                      const existingLists = membership?.existingLists || [];

                      return (
                        <div
                          key={item._id || item.id || idx}
                          className="flex items-start gap-2 p-2 bg-background rounded border border-border/50"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {getItemName(item)}
                            </div>
                            {existingLists.length > 0 ? (
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  Already in:
                                </span>
                                {existingLists.map((list) => (
                                  <Badge
                                    key={list.id}
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0"
                                  >
                                    {list.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground mt-1">
                                Not in any lists
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Search Lists */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Choose a list to add to
              </label>
              <Input
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />

              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading lists...
                </p>
              ) : (
                <RadioGroup
                  value={selectedCollection}
                  onValueChange={setSelectedCollection}
                  className="space-y-2"
                >
                  {filteredCollections.map((col) => {
                    const duplicates = getDuplicateCount(col.id);
                    return (
                      <div
                        key={col.id}
                        className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <RadioGroupItem value={col.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{col.name}</div>
                            {duplicates > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {duplicates} duplicate
                                {duplicates > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {col.itemCount} {itemPlural} total
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}

              {filteredCollections.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No lists found
                </p>
              )}
            </div>

            <Separator />

            {/* Create New List */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Or create a new list
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={creatingNew}
                  onChange={(e) => {
                    setCreatingNew(e.target.checked);
                    if (e.target.checked) setSelectedCollection("");
                  }}
                  className="h-4 w-4"
                />
                <Input
                  placeholder="New list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  disabled={!creatingNew}
                  className={!creatingNew ? "opacity-50" : ""}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setNewListName("");
              setCreatingNew(false);
              setSearchQuery("");
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleAdd}>
            Add {selected.length} {itemPlural}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToListDialog;

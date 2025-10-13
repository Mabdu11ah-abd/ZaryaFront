"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

const COMMON_ROLES = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "VP",
  "Director",
  "Manager",
  "Lead",
  "Senior",
  "Principal",
  "Head of",
  "Chief",
  "President",
  "Founder",
  "Engineering",
  "Marketing",
  "Sales",
  "Product",
  "Design",
  "Operations",
  "Finance",
  "HR",
  "Legal",
  "Business Development",
  "Customer Success",
];

export default function RoleSelector(props) {
  const companyRoles = props.companyRoles || [];
  const selectedRoles = props.selectedRoles;
  const onRolesChange = props.onRolesChange;
  const placeholder = props.placeholder || "Add roles...";
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = COMMON_ROLES.filter(
    (role) =>
      role.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedRoles.includes(role)
  );

  const addRole = (role) => {
    if (role.trim() && !selectedRoles.includes(role.trim())) {
      onRolesChange([...selectedRoles, role.trim()]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeRole = (roleToRemove) => {
    onRolesChange(selectedRoles.filter((role) => role !== roleToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addRole(inputValue);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex flex-wrap gap-2">
            {companyRoles.map((role) => (
              <Badge
                key={role}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(role)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addRole(inputValue)}
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((role) => (
              <button
                key={role}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                onClick={() => addRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected roles */}
      {selectedRoles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedRoles.map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {role}
              <button
                type="button"
                onClick={() => removeRole(role)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {selectedRoles.length === 0 && (
        <p className="text-sm text-gray-500">
          No roles selected. Add roles to target specific employee types.
        </p>
      )}
    </div>
  );
}

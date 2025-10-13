'use client'
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function ZaryaSearch() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      console.log('Searching for:', query);
      // Here you would handle the search/filter logic
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Geometric shapes background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large circle - top right */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-40"
          style={{ background: 'linear-gradient(135deg, oklch(0.6 0.18 250 / 0.3), oklch(0.55 0.18 280 / 0.2))' }}
        />
        
        {/* Small circle - bottom left */}
        <div 
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-30"
          style={{ background: 'linear-gradient(225deg, oklch(0.6 0.15 200 / 0.25), oklch(0.65 0.12 180 / 0.2))' }}
        />
        
        {/* Rectangle - middle left */}
        <div 
          className="absolute top-1/4 -left-12 w-40 h-56 rotate-12 opacity-20"
          style={{ 
            background: 'linear-gradient(180deg, oklch(0.58 0.16 220 / 0.3), transparent)',
            borderRadius: '8px'
          }}
        />
        
        {/* Triangle effect - bottom right */}
        <div 
          className="absolute bottom-32 right-24 w-0 h-0 opacity-25"
          style={{
            borderLeft: '100px solid transparent',
            borderRight: '100px solid transparent',
            borderBottom: '173px solid oklch(0.55 0.2 250 / 0.2)',
            transform: 'rotate(25deg)'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 text-foreground tracking-tight">
            Zarya
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your next lead
          </p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <div 
            className={`relative flex items-center transition-all duration-300 ${
              isFocused ? 'scale-[1.02]' : 'scale-100'
            }`}
          >
            <div className="absolute left-6 pointer-events-none">
              <Search 
                className={`w-5 h-5 transition-colors duration-200 ${
                  isFocused ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search companies, industries, or keywords..."
              className="w-full pl-16 pr-6 py-5 text-lg bg-card border-2 border-border rounded-xl
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-ring/20
                       transition-all duration-200 text-foreground placeholder:text-muted-foreground
                       shadow-sm hover:shadow-md"
            />
          </div>

          {/* Search hint */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Enter</kbd> to search
          </div>
        </div>

        {/* Optional: Quick filters or tags */}
        <div className="mt-12 flex flex-wrap gap-2 justify-center">
          {['Technology', 'Finance', 'Healthcare', 'E-commerce'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground 
                       rounded-full text-sm transition-colors duration-200"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
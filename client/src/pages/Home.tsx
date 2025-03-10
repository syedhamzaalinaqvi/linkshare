import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GroupCard from "@/components/GroupCard";
import { WhatsAppGroup } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredGroups, setFilteredGroups] = useState<WhatsAppGroup[]>([]);

  const { data: groups, isLoading } = useQuery<WhatsAppGroup[]>({
    queryKey: ["/api/groups"],
  });

  // Apply filters when groups data, search query, or selected category changes
  useEffect(() => {
    if (!groups) return;

    let filtered = [...groups];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(group => group.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(query) || 
        group.description.toLowerCase().includes(query) || 
        group.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredGroups(filtered);
  }, [groups, searchQuery, selectedCategory]);

  // List of categories from our schema
  const categories = [
    "all",
    "education",
    "technology",
    "entertainment",
    "sports",
    "business",
    "lifestyle",
    "other"
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find & Share WhatsApp Groups</h1>
          <p className="text-lg text-gray-600 mb-6">Join communities, share interests, and connect with people worldwide</p>
          <div className="relative max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Search groups by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-full pr-12"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-8 w-8 p-0"
              variant="default"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-primary hover:text-white"
              }`}
            >
              {category === "all" ? "All Groups" : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading groups...</p>
        </div>
      ) : (
        <>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-medium text-gray-800">No groups found</h3>
              <p className="mt-2 text-gray-600">
                {searchQuery 
                  ? "Try a different search term or category" 
                  : "There are no groups available in this category yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

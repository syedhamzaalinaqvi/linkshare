import { WhatsAppGroup } from "@shared/schema";
import { useState } from "react";
import { Users, MapPin, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface GroupCardProps {
  group: WhatsAppGroup;
}

export default function GroupCard({ group }: GroupCardProps) {
  // Function to format the timestamp into relative time string
  const formatRelativeTime = (timestamp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const secondsAgo = now - timestamp;

    if (secondsAgo < 60) {
      return `${secondsAgo}s ago`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)}m ago`;
    } else if (secondsAgo < 86400) {
      return `${Math.floor(secondsAgo / 3600)}h ago`;
    } else if (secondsAgo < 2592000) {
      return `${Math.floor(secondsAgo / 86400)}d ago`;
    } else if (secondsAgo < 31536000) {
      return `${Math.floor(secondsAgo / 2592000)}mo ago`;
    } else {
      return `${Math.floor(secondsAgo / 31536000)}y ago`;
    }
  };

  // Convert group link to a more readable URL for the route
  const getGroupSlug = () => {
    return `group/${group.id}/${encodeURIComponent(group.name.toLowerCase().replace(/\s+/g, '-'))}`;
  };

  return (
    <div className="group-card bg-white rounded-lg shadow-md overflow-hidden" data-category={group.category}>
      <div className="p-1 bg-primary"></div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
          <div className="flex space-x-2">
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full capitalize">{group.category}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-2 text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{group.country}</span>
          <span className="mx-2">•</span>
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatRelativeTime(group.createdAt)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{group.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            {group.members} members
          </div>
          
          <Link href={getGroupSlug()}>
            <button 
              className="bg-primary text-white hover:bg-primary/80 px-4 py-1.5 rounded text-sm transition-colors font-medium"
            >
              Join Group
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

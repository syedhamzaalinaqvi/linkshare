import { whatsappGroups, type WhatsAppGroup, type InsertWhatsAppGroup } from "@shared/schema";

export interface IStorage {
  getAllGroups(): Promise<WhatsAppGroup[]>;
  getGroupById(id: number): Promise<WhatsAppGroup | undefined>;
  getGroupsByCategory(category: string): Promise<WhatsAppGroup[]>;
  createGroup(group: InsertWhatsAppGroup): Promise<WhatsAppGroup>;
}

export class MemStorage implements IStorage {
  private groups: Map<number, WhatsAppGroup>;
  private currentId: number;

  constructor() {
    this.groups = new Map();
    this.currentId = 1;
    
    // Add some initial demo groups
    this.initializeDemoGroups();
  }

  private initializeDemoGroups() {
    const demoGroups: Omit<WhatsAppGroup, "id">[] = [
      {
        name: "Study Group: Mathematics",
        description: "A community for mathematics students to share problems, solutions and study materials.",
        category: "education",
        country: "United States",
        link: "https://chat.whatsapp.com/example1",
        owner: "Math Teacher",
        members: 250,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30, // 30 days ago
      },
      {
        name: "Web Developers Community",
        description: "Connect with web developers and designers. Share resources, tips and job opportunities.",
        category: "technology",
        country: "India",
        link: "https://chat.whatsapp.com/example2",
        owner: "Tech Lead",
        members: 500,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 20, // 20 days ago
      },
      {
        name: "Movie Buffs Club",
        description: "For cinephiles and movie enthusiasts. Discuss films, share recommendations and reviews.",
        category: "entertainment",
        country: "United Kingdom",
        link: "https://chat.whatsapp.com/example3",
        owner: "Film Director",
        members: 350,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 15, // 15 days ago
      },
      {
        name: "Football Fans United",
        description: "Connect with football fans worldwide. Discuss matches, transfers, and your favorite teams.",
        category: "sports",
        country: "Global",
        link: "https://chat.whatsapp.com/example4",
        owner: "Sports Commentator",
        members: 1000,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 10, // 10 days ago
      },
      {
        name: "Entrepreneurs Network",
        description: "A group for entrepreneurs to network, share ideas, and find potential business partners.",
        category: "business",
        country: "Canada",
        link: "https://chat.whatsapp.com/example5",
        owner: "Startup Founder",
        members: 450,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 5, // 5 days ago
      },
      {
        name: "Fitness & Wellness",
        description: "Share fitness tips, workout routines, nutrition advice and wellness practices.",
        category: "lifestyle",
        country: "Australia",
        link: "https://chat.whatsapp.com/example6",
        owner: "Fitness Coach",
        members: 720,
        createdAt: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 2, // 2 days ago
      }
    ];

    demoGroups.forEach(group => {
      const id = this.currentId++;
      this.groups.set(id, { ...group, id });
    });
  }

  async getAllGroups(): Promise<WhatsAppGroup[]> {
    return Array.from(this.groups.values()).sort((a, b) => b.createdAt - a.createdAt);
  }

  async getGroupById(id: number): Promise<WhatsAppGroup | undefined> {
    return this.groups.get(id);
  }

  async getGroupsByCategory(category: string): Promise<WhatsAppGroup[]> {
    return Array.from(this.groups.values())
      .filter(group => group.category === category)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async createGroup(groupData: InsertWhatsAppGroup): Promise<WhatsAppGroup> {
    const id = this.currentId++;
    const timestamp = Math.floor(Date.now() / 1000);
    
    const newGroup: WhatsAppGroup = {
      ...groupData,
      id,
      members: groupData.members || 0, // Ensure members is set
      createdAt: timestamp,
    };
    
    this.groups.set(id, newGroup);
    return newGroup;
  }
}

export const storage = new MemStorage();

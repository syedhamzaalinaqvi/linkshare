import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWhatsAppGroupSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import ogs from 'open-graph-scraper';

// Define types for open-graph-scraper
interface OpenGraphImage {
  url?: string;
  width?: string;
  height?: string;
  type?: string;
}

interface TwitterImage {
  url?: string;
  width?: string;
  height?: string;
  alt?: string;
}

interface OpenGraphResult {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: OpenGraphImage | OpenGraphImage[];
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: TwitterImage | TwitterImage[];
  [key: string]: any;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all WhatsApp groups
  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getAllGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch groups",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get WhatsApp groups by category
  app.get("/api/groups/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const groups = await storage.getGroupsByCategory(category);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch groups by category",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get WhatsApp group by ID
  app.get("/api/groups/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const group = await storage.getGroupById(id);
      
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      
      res.json(group);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch group",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get metadata for link preview
  app.get("/api/link-preview", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL parameter is required" });
      }

      if (!url.includes("chat.whatsapp.com")) {
        return res.status(400).json({ message: "Only WhatsApp links are supported" });
      }
      
      // Use open-graph-scraper to fetch metadata
      const options = { url, timeout: 5000 };
      const { result } = await ogs(options) as { result: OpenGraphResult };
      
      // Default image for WhatsApp groups
      const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png";
      
      // Extract image URL safely
      let imageUrl = defaultImage;
      
      if (result.ogImage) {
        if (Array.isArray(result.ogImage) && result.ogImage.length > 0 && result.ogImage[0]) {
          imageUrl = typeof result.ogImage[0].url === 'string' ? result.ogImage[0].url : defaultImage;
        } else if (!Array.isArray(result.ogImage) && typeof result.ogImage.url === 'string') {
          imageUrl = result.ogImage.url;
        }
      } else if (result.twitterImage) {
        if (Array.isArray(result.twitterImage) && result.twitterImage.length > 0 && result.twitterImage[0]) {
          imageUrl = typeof result.twitterImage[0].url === 'string' ? result.twitterImage[0].url : defaultImage;
        } else if (!Array.isArray(result.twitterImage) && typeof result.twitterImage.url === 'string') {
          imageUrl = result.twitterImage.url;
        }
      }
      
      const metadata = {
        title: result.ogTitle || result.twitterTitle || "WhatsApp Group",
        description: result.ogDescription || result.twitterDescription || `Join this WhatsApp group: ${url.split('/').pop()}`,
        image: imageUrl
      };
      
      res.json(metadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      
      // Return default values when metadata fetching fails
      res.json({
        title: "WhatsApp Group",
        description: "Click to join this WhatsApp group",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png"
      });
    }
  });

  // Create a new WhatsApp group
  app.post("/api/groups", async (req, res) => {
    try {
      const groupData = insertWhatsAppGroupSchema.parse(req.body);
      
      // Validate that the link is a WhatsApp group link
      if (!groupData.link.includes("chat.whatsapp.com")) {
        return res.status(400).json({ 
          message: "Invalid WhatsApp group link. Must contain 'chat.whatsapp.com'"
        });
      }
      
      const newGroup = await storage.createGroup(groupData);
      res.status(201).json(newGroup);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationError.details
        });
      }
      
      res.status(500).json({ 
        message: "Failed to create group",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

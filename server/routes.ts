import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWhatsAppGroupSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

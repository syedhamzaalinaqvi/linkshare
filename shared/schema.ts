import { pgTable, text, serial, integer, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const whatsappGroups = pgTable("whatsapp_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  country: varchar("country", { length: 50 }).notNull().default("Global"),
  link: text("link").notNull(),
  owner: varchar("owner", { length: 100 }).notNull(),
  members: integer("members").notNull().default(0),
  createdAt: integer("created_at").notNull().default(Math.floor(Date.now() / 1000)),
});

export const insertWhatsAppGroupSchema = createInsertSchema(whatsappGroups).omit({
  id: true,
  createdAt: true,
}).extend({
  link: z.string().url().includes("chat.whatsapp.com", {
    message: "Must be a valid WhatsApp group invite link",
  }),
  category: z.string().min(1, "Category is required"),
  country: z.string().optional().default("Global"),
});

// Categories for dropdown
export const categories = [
  "education", 
  "technology", 
  "entertainment", 
  "sports", 
  "business", 
  "lifestyle", 
  "other"
];

// List of countries for dropdown
export const countries = [
  "Global",
  "United States",
  "United Kingdom",
  "India",
  "Pakistan",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Nigeria",
  "South Africa",
  "Brazil",
  "Mexico",
  "Japan",
  "China",
  "Other"
];

export type InsertWhatsAppGroup = z.infer<typeof insertWhatsAppGroupSchema>;
export type WhatsAppGroup = typeof whatsappGroups.$inferSelect;

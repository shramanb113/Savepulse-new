import {
  serial,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
  pgSchema,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "hospital", "admin"]);

export const mySchema = pgSchema("my_schema");

export const hospitals = mySchema.table("hospitals", {
  hospital_id: serial("hospital_id").primaryKey(),

  hospital_name: text("hospital_name").notNull(),

  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),

  trauma_center: boolean("trauma_center").default(false),
  cardiac_center: boolean("cardiac_center").default(false),

  icu_beds_available: integer("icu_beds_available").default(0),
  general_beds_available: integer("general_beds_available").default(0),
  oxygen_beds_available: integer("oxygen_beds_available").default(0),

  total_beds: integer("total_beds"),
  current_occupancy_rate: doublePrecision("current_occupancy_rate"),

  hospital_rating: doublePrecision("hospital_rating"),
});

export const requests = mySchema.table("requests", {
  request_id: serial("request_id").primaryKey(),

  user_id: text("user_id").notNull(),

  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),

  emergency_type: text("emergency_type").notNull(),
  severity_level: integer("severity_level"),

  request_timestamp: timestamp("request_timestamp").defaultNow(),

  assigned_hospital_id: integer("assigned_hospital_id"),

  status: text("status").default("pending"),
});




export const user = mySchema.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone_number: text("phone_number"),
  address: text("address"),
  bloodGroup: text("blood_group"),
  emergencyContact: text("emergency_contact"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
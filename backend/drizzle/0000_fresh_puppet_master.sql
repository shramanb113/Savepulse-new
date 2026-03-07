CREATE SCHEMA "my_schema";
--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'hospital', 'admin');--> statement-breakpoint
CREATE TABLE "my_schema"."hospitals" (
	"hospital_id" serial PRIMARY KEY NOT NULL,
	"hospital_name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"trauma_center" boolean DEFAULT false,
	"cardiac_center" boolean DEFAULT false,
	"icu_beds_available" integer DEFAULT 0,
	"general_beds_available" integer DEFAULT 0,
	"oxygen_beds_available" integer DEFAULT 0,
	"total_beds" integer,
	"current_occupancy_rate" double precision,
	"hospital_rating" double precision
);
--> statement-breakpoint
CREATE TABLE "my_schema"."requests" (
	"request_id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"emergency_type" text NOT NULL,
	"severity_level" integer,
	"request_timestamp" timestamp DEFAULT now(),
	"assigned_hospital_id" integer,
	"status" text DEFAULT 'pending'
);
--> statement-breakpoint
CREATE TABLE "my_schema"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone_number" text,
	"address" text,
	"blood_group" text,
	"emergency_contact" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);

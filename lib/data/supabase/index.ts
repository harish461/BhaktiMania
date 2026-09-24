/**
 * BhaktiMania Supabase Data Access Layer
 * 
 * Provides clean, server-side data-access functions for reading published
 * devotional content from Supabase PostgreSQL.
 * 
 * Architectural Rule:
 * Page and UI components should import exclusively from this layer (or the static
 * fallback) and MUST NOT contain direct Supabase client or SQL query logic.
 */

export * from "./types";
export * from "./adapters";
export * from "./categories";
export * from "./articles";
export * from "./authors";
export * from "./admin";
export * from "./affiliate";


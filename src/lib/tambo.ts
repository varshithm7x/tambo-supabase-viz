/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { DataTable } from "@/components/data-table";
import { KanbanBoard } from "@/components/kanban-board";
import { SummaryCard } from "@/components/summary-card";
import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { querySupabase, manageDatabase, listTables } from "@/services/supabase-service";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "querySupabase",
    description: "Query data from a Supabase table.",
    tool: querySupabase,
    inputSchema: z.object({
      table: z.string().describe("The name of the table to query"),
      select: z.string().optional().describe("The columns to select (default: '*')"),
      limit: z.number().optional().describe("The number of rows to return (default: 10)"),
      filterColumn: z.string().optional().describe("The column to filter by"),
      filterValue: z.string().optional().describe("The value to filter by"),
    }),
    outputSchema: z.object({
      columns: z.array(z.string()),
      rows: z.array(
        z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
      ),
    }),
  },
  {
    name: "manageDatabase",
    description: "Execute raw SQL to create tables, alter columns, or manage schema. Use carefully for DDL operations.",
    tool: manageDatabase,
    inputSchema: z.object({
      sql: z.string().describe("The SQL command to execute (e.g. 'ALTER TABLE users ADD COLUMN age INT')"),
    }),
    outputSchema: z.array(z.object({
        message: z.string(),
        rowsAffected: z.number().optional().nullable(),
    })),
  },
  {
    name: "listTables",
    description: "List all custom tables in the public schema of the database.",
    tool: listTables,
    inputSchema: z.object({}),
    outputSchema: z.array(z.string()),
  },
  // Add more tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "DataTable",
    description: "Displays data in a tabular format.",
    component: DataTable,
    propsSchema: z.object({
      title: z.string().optional().describe("The title of the table"),
      columns: z.array(z.string()).describe("The column headers for the table"),
      rows: z.array(
        z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
      ).describe("The row data for the table"),
    }),
  },
  {
    name: "SummaryCard",
    description: "A card highlighting a key statistic with an optional trend indicator.",
    component: SummaryCard,
    propsSchema: z.object({
      title: z.string().describe("The label for the statistic (e.g., 'Total Revenue')"),
      value: z.union([z.string(), z.number()]).describe("The main value to display"),
      trend: z.number().optional().describe("Percentage change (positive or negative)"),
      trendLabel: z.string().optional().describe("Description of the trend (e.g., 'vs last month')"),
    }),
  },
  {
    name: "KanbanBoard",
    description: "A board visualizing items grouped by status or category.",
    component: KanbanBoard,
    propsSchema: z.object({
      title: z.string().optional().describe("The title of the board"),
      columns: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          items: z.array(
            z.object({
              id: z.union([z.string(), z.number()]),
              title: z.string(),
              tag: z.string().optional(),
              description: z.string().optional(),
            }),
          ),
        }),
      ).describe("Columns containing the items"),
    }),
  },
  // Add more components here
];

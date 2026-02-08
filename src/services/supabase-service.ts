import { supabase } from "@/lib/supabase";
import { executeSql } from "@/app/actions/sql";

const normalizeCell = (value: unknown): string | number | boolean | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  return JSON.stringify(value);
};

export async function querySupabase({
  table,
  select = "*",
  limit = 10,
  filterColumn,
  filterValue,
}: {
  table: string;
  select?: string;
  limit?: number;
  filterColumn?: string;
  filterValue?: string;
}) {
  let query = supabase.from(table).select(select).limit(limit);

  if (filterColumn && filterValue) {
      query = query.eq(filterColumn, filterValue);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  const rowsData = Array.isArray(data) ? data : [];
  const columnsSet = new Set<string>();

  rowsData.forEach((row) => {
    Object.keys(row || {}).forEach((key) => columnsSet.add(key));
  });

  const columns = Array.from(columnsSet);
  const rows = rowsData.map((row) =>
    columns.map((column) => normalizeCell((row as any)[column])),
  );

  return { columns, rows };
}

export async function manageDatabase({ sql }: { sql: string }) {
    if (!sql) return { error: "No SQL query provided" };
    
    // Simple safety check to prevent obviously dangerous commands if needed
    // In a real app, you might want stricter controls or a dedicated admin role.
    
    const result = await executeSql(sql);
    
    if (result.error) {
        throw new Error(`Database error: ${result.error}`);
    }
    
    return [
        { 
            message: `Executed successfully. Command: ${result.command}`, 
            rowsAffected: result.rowCount 
        }
    ];
}

export async function listTables() {
    const result = await executeSql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    
    if (result.error) {
        console.error("Failed to list tables:", result.error);
        return ["Error: Could not retrieve table list. Please verify DATABASE_URL is correct in .env.local"];
    }
    
    return result.rows?.map((row: any) => row.table_name) || [];
}

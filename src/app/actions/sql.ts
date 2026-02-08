"use server";

import { Pool } from "pg";
import dns from "dns";
import { parse } from "pg-connection-string";
import { promisify } from "util";

const lookup = promisify(dns.lookup);

// Force IPv4 resolution to fix connection issues with Supabase on some networks
if (dns && typeof dns.setDefaultResultOrder === "function") {
  try {
    dns.setDefaultResultOrder("ipv4first");
  } catch (e) {
    console.warn("Could not set default DNS result order:", e);
  }
}

let pool: Pool | null = null;

async function getPool() {
  if (pool) return pool;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  let config = parse(process.env.DATABASE_URL);

  // Manual IPv4 Lookup: Resolving the host to an IPv4 address manually
  // to prevent ECONNREFUSED issues on networks with unstable IPv6.
  if (config.host && !config.host.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    try {
      console.log(`Looking up IPv4 for ${config.host}...`);
      // Family 4 forces IPv4 address
      const { address } = await lookup(config.host, { family: 4 });
      if (address) {
        console.log(`Resolved ${config.host} to IPv4: ${address}`);
        config.host = address;
      }
    } catch (e) {
      console.error("IPv4 DNS lookup failed, falling back to hostname:", e);
    }
  }

  const poolConfig = {
    ...config,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000,
  };

  pool = new Pool(poolConfig as any);
  return pool;
}

export async function executeSql(query: string) {
  if (!process.env.DATABASE_URL) {
    return { error: "DATABASE_URL is not set in .env.local" };
  }

  try {
    const currentPool = await getPool();
    const client = await currentPool.connect();
    try {
      const result = await client.query(query);
      return { 
          success: true, 
          rowCount: result.rowCount, 
          rows: result.rows,
          command: result.command 
      };
    } finally {
      client.release();
    }
  } catch (error: any) {
    return { error: error.message };
  }
}

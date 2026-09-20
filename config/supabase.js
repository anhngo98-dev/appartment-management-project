const { Pool } = require('pg');

let pool;

function getSupabasePool() {
  if (!process.env.SUPABASE_DB_URL) {
    throw new Error('SUPABASE_DB_URL is not configured');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  }

  return pool;
}

async function connectSupabase() {
  const client = await getSupabasePool().connect();
  try {
    await client.query('select 1');
    console.log('✓ Supabase PostgreSQL connected');
  } finally {
    client.release();
  }
}

async function checkSupabaseConnection() {
  try {
    await getSupabasePool().query('select 1');
    return true;
  } catch (error) {
    console.error('✗ Supabase PostgreSQL connection error:', error.message);
    return false;
  }
}

module.exports = {
  getSupabasePool,
  connectSupabase,
  checkSupabaseConnection
};

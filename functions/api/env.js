/**
 * Cloudflare Pages Function: Inject Environment Variables
 * 
 * This function dynamically injects Supabase credentials into window.__ENV
 * so they never appear in source code or git history.
 * 
 * Deploy: Commit this file to your repo. Cloudflare automatically routes
 *         requests to /api/env to this function.
 */

export async function onRequest(context) {
  const { env } = context;

  // Get environment variables from Cloudflare Pages
  const supabaseUrl = env.SUPABASE_URL || '';
  const supabaseKey = env.SUPABASE_KEY || '';

  // Generate JavaScript that sets window.__ENV
  const envScript = `
window.__ENV = {
  SUPABASE_URL: '${supabaseUrl}',
  SUPABASE_KEY: '${supabaseKey}'
};
`;

  return new Response(envScript, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'max-age=300' // Cache for 5 minutes
    }
  });
}

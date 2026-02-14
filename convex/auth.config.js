// ═══════════════════════════════════════════════════════════════════════════════
// Convex auth configuration — trusts Clerk JWTs
// Clerk OIDC: Convex validates access tokens against Clerk JWKS
// ═══════════════════════════════════════════════════════════════════════════════
const authConfig = {
  providers: [
    {
      // Clerk OIDC issuer — must match the `iss` claim in the JWT
      // Set CLERK_JWT_ISSUER_DOMAIN in Convex Dashboard environment variables
      // Value: your Clerk Frontend API URL (e.g. https://verb-noun-00.clerk.accounts.dev)
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
export default authConfig;

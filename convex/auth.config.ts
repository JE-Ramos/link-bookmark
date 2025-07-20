const authConfig = {
  providers: [
    // Uncomment this once you have set up a Clerk app
    {
      // This uses the CLERK_JWT_ISSUER_DOMAIN environment variable
      // configured in the Convex Dashboard
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      // This must match the name of your JWT template in Clerk
      applicationID: "convex",
    },
  ],
};

export default authConfig;

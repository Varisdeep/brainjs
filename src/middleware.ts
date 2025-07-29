import { withAuth } from "next-auth/middleware";

// Middleware for protecting admin routes
export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // Only allow admin users
      return token?.role === "admin";
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"], // Protect all /admin routes
};

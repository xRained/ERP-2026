export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: any) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn && (nextUrl.pathname === "/auth/signin" || nextUrl.pathname === "/")) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.organizationId = token.organizationId as string
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id
        token.role = user.role
        token.organizationId = user.organizationId
      }
      return token
    },
  },
  providers: [],
}

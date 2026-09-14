export function middleware(request: Request) {
  const url = new URL(request.url)
  const isOnDashboard = url.pathname.startsWith("/dashboard")
  const isOnAuth = url.pathname.startsWith("/auth")
  const isRoot = url.pathname === "/"
  
  const hasSession = request.headers.get("cookie")?.includes("next-auth.session-token")

  if (isOnDashboard && !hasSession) {
    return Response.redirect(new URL("/auth/signin", url))
  } else if (isOnAuth && hasSession) {
    return Response.redirect(new URL("/dashboard", url))
  } else if (isRoot && hasSession) {
    return Response.redirect(new URL("/dashboard", url))
  } else if (isRoot && !hasSession) {
    return Response.redirect(new URL("/auth/signin", url))
  }
  return null
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

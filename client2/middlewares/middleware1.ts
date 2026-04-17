import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function withMiddleware1(middleware: NextMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const pathname = request.nextUrl.pathname;
    console.log("middleware 1 =>", { pathname });

    return middleware(request, event);
  };
}

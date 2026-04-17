import { chain } from "./middlewares/chain";
import { withMiddleware1 } from "./middlewares/middleware1";
import { withMiddleware2 } from "./middlewares/middleware2";
import { withLangMiddleware } from "./middlewares/langMiddleware";

const middlewares = [withMiddleware1, withLangMiddleware, withMiddleware2];

export default chain(middlewares);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

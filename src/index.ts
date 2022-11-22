import { makeBadge } from "./utils";

export interface Env {
  DB: KVNamespace;
}

async function fetchNav(request: Request, env: Env, ctx: ExecutionContext) {
  const { pathname, searchParams } = new URL(request.url);
  switch (pathname) {
    case "/visit":
      return handleVisit(searchParams, env.DB);
    default:
      return renderNotFound();
  }
}

async function handleVisit(searchParams: URLSearchParams, db: KVNamespace) {
  const visitCntInDB = await db.get("visitorCnt");
  let visitCnt = visitCntInDB ? parseInt(visitCntInDB) + 1 : 1;
  await db.put("visitorCnt", visitCnt.toString());

  return new Response(makeBadge(visitCnt), {
    headers: {
      "Content-Type": "image/svg+xml;",
      "Cache-Control": "no-cache",
      ETag: `"${Date.now().toString()}}"`,
    },
  });
}

function renderNotFound() {
  return new Response(null, { status: 404 });
}

export default {
  fetch: fetchNav,
};

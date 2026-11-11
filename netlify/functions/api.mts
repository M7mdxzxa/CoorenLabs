// Netlify Function that serves the whole Cooren API (all routes)

type FetchApp = { fetch: (request: Request) => Response | Promise<Response> };

let appPromise: Promise<FetchApp> | undefined;

// The app reads its config at import time, so SERVER_ORIGIN (used to build
// proxied stream links) is derived from the first request's origin when unset.
function loadApp(origin: string): Promise<FetchApp> {
  if (!appPromise) {
    if (!process.env.SERVER_ORIGIN) process.env.SERVER_ORIGIN = origin;
    appPromise = import("../../src/app").then((m) => m.default as unknown as FetchApp);
  }
  return appPromise;
}

export default async (req: Request) => {
  const app = await loadApp(new URL(req.url).origin);
  return app.fetch(req);
};

export const config = {
  path: "/*",
};

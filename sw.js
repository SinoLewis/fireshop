// Import the Workbox library
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js"
);

// Check if the import was successful
if (workbox) {
  // Configure Workbox
  workbox.setConfig({ debug: false });
  // workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);

  // Uncomment the code below to set a default caching strategy
  // workbox.routing.setDefaultHandler(workbox.strategies.networkFirst({
  //   cacheName: 'fallback',
  // }))

  // When the service worker is installed, skip waiting for activation
  self.addEventListener("install", (event) => {
    self.skipWaiting();
    console.log("SKIP WAITING SUCCESS");
  });

  // Define a caching strategy
  var defaultStrategy = workbox.strategies.networkFirst({
    cacheName: "fallback",
    plugins: [
      // Use the expiration plugin to automatically remove old cached entries
      new workbox.expiration.Plugin({
        maxEntries: 128, // Only cache up to 128 entries
        maxAgeSeconds: 7 * 24 * 60 * 60, // Cache entries for 1 week
        purgeOnQuotaError: true, // Automatically remove old entries if storage space runs low
      }),
      // Use the cacheable response plugin to cache responses with a status of 0 or 200
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200], // Only cache responses with a status of 0 or 200
      }),
    ],
  });

  // Register a caching strategy for JavaScript and CSS files
  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:js|css)/g),
    workbox.strategies.networkFirst()
  );

  // Register a caching strategy for image files
  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/g),
    workbox.strategies.cacheFirst()
  );

  // Set a default handler for all other requests
  workbox.routing.setDefaultHandler((args) => {
    // TODO: Post reqs. Check if its standard principle
    if (args.event.request.method === "GET") {
      return defaultStrategy.handle(args); // use default strategy
    } else {
      return null; // return null for non-GET requests
    }
  });
} else {
  console.log(`No workbox on this browser 😬`);
}

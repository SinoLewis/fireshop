<svelte:options tag="testin-button" />

<script lang="ts">
</script>

<head>
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</head>

<body>
  <h1>Maps in the trap</h1>
  <div id="map" />
  <!-- <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script> -->
  <!-- <script
    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""
  ></script> -->
  <script>
    function importScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    importScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then((L) => {
        // Script has been loaded and executed successfully
        console.log("Script loaded");
        var map = L.map("map").setView([51.505, -0.09], 13);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        console.log("LEAFLET Maps  Dir");
        console.dir(L);
      })
      .catch(() => {
        // An error occurred while loading or executing the script
        console.error("Error loading script");
      });
  </script>
</body>

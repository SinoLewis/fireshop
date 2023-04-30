import express from "express";
import cors from "cors";
import { meilisearch } from "./routes/meilisearch";
import { getDirections, getGeocode } from "./routes/ors";

const port = 3000;
const app = express();
// TODO: cors for NGROK_URL
app.use(cors({ origin: "*" }));

app.get("/meilisearch/:query", meilisearch);

app.get("/geocode/:place", getGeocode);

app.get("/directions/:start/:end", getDirections);

app.listen(port, () => {
  console.log(`💫 Fireshop server is up 🔥🔥🔥 at port ${port}`);
});

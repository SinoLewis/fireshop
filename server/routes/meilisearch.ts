import { MeiliSearch } from "meilisearch";

const client = new MeiliSearch({
  host: "http://localhost:7700",
});
const index = client.index("products");

export async function meilisearch(req: any, res: any) {
  const query = req.params.query;
  try {
    const data = await index.search(query, {
      hitsPerPage: 7,
      attributesToCrop: ["description"],
      attributesToHighlight: ["title", "description"],
      highlightPreTag: '<mark class="high">',
      highlightPostTag: "</mark>",
    });
    res.send(data);
    console.log(`MEILISEARCH: ${req.params.query} searched 🔍`);
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://172.17.0.2:4200" }));
axios.defaults.baseURL = "https://fulfillment-api.sendyit.com/v1";

// TODO: 4 sendy order api routes, the rest routes are admin only
// req body = [track, cancel. create, cost]
// Auth headers = [track, cancel. create, cost]
app.get("/testin", async (request, response) => {
  const apiResponse = await axios.get("/todos/1");
  response.json(apiResponse.data);
  console.log("testin complete");
});

app.get("/track", async (request, response) => {
  const apiResponse = await axios.get(
    `/orders/${request.body.orderId}/ track`,
    request.headers
  );
  response.json(apiResponse.data);
});

app.post("/create", async (request, response) => {
  const apiResponse = await axios.post("/orders", request.body);
  response.json(apiResponse.data);
});

app.post("/cost", async (request, response) => {
  const apiResponse = await axios.post("/orders/pricing", request.body);
  response.json(apiResponse.data);
});

app.patch("/cancel", async (request, response) => {
  const apiResponse = await axios.patch(
    `/orders/${request.body.orderId}/ cancel`
  );
  response.json(apiResponse.data);
});

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
    console.log("Press CTRL-C to stop\n");
  });
}

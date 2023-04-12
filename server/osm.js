const express = require("express");
const axios = require("axios");
const redis = require("redis");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: "*" }));

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

async function fetchGeocode(place) {
  const apiResponse = await axios.get(
    `https://api.openrouteservice.org/geocode/autocomplete?api_key=KendrickFEAR&text=${place}&boundary.country=KE`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function getGeocode(req, res) {
  const place = String(req.params.place).toLowerCase();
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(place);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchGeocode(place);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(place, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

async function fetchDirections(start, end) {
  const apiResponse = await axios.get(
    `https://api.openrouteservice.org/v2/directions/driving-car?api_key=TravisTRANCE&start=${start}&end=${end}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function getDirections(req, res) {
  const start = req.params.start;
  const end = req.params.end;
  const cacheKey = `${start}:${end}`;
  let results;
  let isCached = false;

  try {
    const cacheResults = await redisClient.get(cacheKey);
    if (cacheResults) {
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchDirections(start, end);
      if (results.length === 0) {
        throw "API returned an empty array";
      }
      await redisClient.set(cacheKey, JSON.stringify(results));
    }

    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}
app.get("/geocode/:place", getGeocode);
app.get("/directions/:start/:end", getDirections);

app.listen(port, () => {
  console.log(`Cached App listening on port ${port}`);
});

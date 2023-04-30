import axios from "axios";
import { redisClient } from "../redis";

async function fetchGeocode(place: any) {
  const apiResponse = await axios.get(
    `https://api.openrouteservice.org/geocode/autocomplete?api_key=5b3ce3597851110001cf624884d3e22b307546f5b0333ac9fe70efe9&text=${place}&boundary.country=KE`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function getGeocode(req: any, res: any) {
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
    console.log(`OSR GEOCODE: ${req.params.place} searched 🎯`);
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

async function fetchDirections(start: any, end: any) {
  const apiResponse = await axios.get(
    `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624884d3e22b307546f5b0333ac9fe70efe9&start=${start}&end=${end}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
}

async function getDirections(req: any, res: any) {
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
    console.log(`OSR DIRECTION: ${req.params.end} searched 🎯`);
    res.send({
      fromCache: isCached,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("Data unavailable");
  }
}

export { getGeocode, getDirections };

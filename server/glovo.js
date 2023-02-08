const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
axios.defaults.baseURL = "https://api.glovoapp.com";
// axios.defaults.baseURL = "https://stageapi.glovoapp.com";

app.post("/oauth/token", async (req, res) => {
  try {
    const cred = req.body;
    console.log('SERVER AUTH TOKEN: ', cred);
    const response = await axios.post("/oauth/token", cred);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST
app.post("/parcels", async (req, res) => {
  try {
    const parcel = req.body;
    console.log(`TEST POST: ${parcel}`);
    const response = await axios.post("/laas/parcels", parcel);
    res.status(201).send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/parcels/validation", async (req, res) => {
  try {
    const parcel = req.body;
    console.log(`TEST POST: ${parcel}`);
    const response = await axios.post("/laas/parcels/validation", parcel);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/parcels/working-areas", async (req, res) => {
  try {
    // console.log('SERVER WORKING AREAS: ', req.headers.authentication);
    const response = await axios.get("/laas/parcels/working-areas", { "Authorization": req.headers.authentication });
    console.log('SERVER WORKING AREAS: ', response);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// CANCEL
app.post("/parcels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.post(`/laas/parcels/${id}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET
app.get("/parcels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/parcels/:id/history", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/history`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/info", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/courier-contact`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/position", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/courier-position`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/link", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcel_tracking_links/${id}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/sim/:id/success", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(
      `/laas/parcels/${id}/simulate/successful-attempt`
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/sim/:id/fail", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(
      `/laas/parcels/${id}/simulate/exhausted-attempt`
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("Press CTRL-C to stop\n");
});

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
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

// POST
app.post("/parcels", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const parcel = req.body;
    console.log('CREATE PARCEL: ', parcel);
    const response = await axios.post("/laas/parcels", parcel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('CREATE PARCEL RESP: ', response.data);
    res.status(201).send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.post("/parcels/validation", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const parcel = req.body;
    console.log('VALIDATE PARCEL: ', typeof (parcel));
    const response = await axios.post("/laas/parcels/validation", parcel, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('VALIDATE PARCEL RESP: ', response.data);
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});
app.get("/parcels/working-areas", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('SERVER WORKING AUTH: ', token);
    const response = await axios.get("/laas/working-areas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log('SERVER WORKING AREAS: ', response);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

// CANCEL
app.post("/parcels/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.post(`/laas/parcels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

// GET
app.get("/parcels/:id", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/parcels/:id/history", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/courier/:id/info", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/courier-contact`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/courier/:id/position", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcels/${id}/courier-position`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/courier/:id/link", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(`/laas/parcel_tracking_links/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/sim/:id/success", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(
      `/laas/parcels/${id}/simulate/successful-attempt`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.get("/sim/:id/fail", async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    const response = await axios.get(
      `/laas/parcels/${id}/simulate/exhausted-attempt`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    );
    res.send(response.data);
  } catch (error) {
    res.status(error.response.status || 400).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("Press CTRL-C to stop\n");
});

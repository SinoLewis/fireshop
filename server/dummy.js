const express = require("express");
// const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
// axios.defaults.baseURL = 'https://stageapi.glovoapp.com';

// TODO: AUTH TOKEM
// TODO: POST Handlers = /oauth/token & /laas/parcelss & /laas/parcelss/validation (each has different body specified in insomnia)
// TODO: ALL GET Handlers = trackingNumber (as the only param)
app.post("/oauth/token", async (req, res) => {
  try {
    const cred = req.body;
    const auth = {
      accessToken: "{{TOKEN}}",
      tokenType: "bearer",
      expiresIn: 1199,
      refreshToken: "{{REFRESH_TOKEN}}",
      twoFactorToken: null,
      scope: null,
    };
    // Make a POST request to create a new user using axios
    console.log(`AUTH TOKEN: ${cred}`);
    res.send(JSON.stringify(auth));
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST
app.post("/parcels", async (req, res) => {
  try {
    const parcelReq = req.body;
    const createParcel = {
      address: {
        cityName: "Barcelona",
        country: "Spain",
        details: "Additional information",
        postalCode: 30123,
        rawAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
        formattedAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
        streetName: "Calle Oporto",
        streetNumber: 2,
        latitude: 41.47155,
        longitude: 2.011038,
      },
      cityCode: "BCN",
      contact: {
        email: "recipient@email.com",
        name: "Recipient",
        phone: "+346666666666",
      },
      label: "string",
      packageDetails: {
        contentType: "FOOD",
        description: "A RAM expansion",
        parcelValue: 50,
        weight: 1,
      },
      packageId: 1213122,
      partnerId: 1,
      pickupDetails: {
        address: {
          cityName: "Barcelona",
          country: "Spain",
          details: "Additional information",
          postalCode: 30123,
          rawAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
          formattedAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
          streetName: "Calle Oporto",
          streetNumber: 2,
          latitude: 41.47155,
          longitude: 2.011038,
        },
        pickupOrderCode: "PickupOrderCode123",
        pickupTime: "2019-08-24T14:15:22Z",
      },
      price: {
        delivery: {
          currencyCode: "EUR",
          value: 5.5,
        },
        parcel: {
          currencyCode: "EUR",
          value: 5.5,
        },
      },
      status: {
        createdAt: "2019-08-24T14:15:22Z",
        deliveryAt: "2019-08-24",
        lastUpdateAt: "2019-08-24T14:15:22Z",
        location: "OUT_FOR_DELIVERY",
        locationChangeHistory: [
          {
            changeType: "MARK_PICKED",
            date: "2019-08-24T14:15:22Z",
            reason: "Reason",
            value: "PICKED",
          },
        ],
        state: "PICKED",
        stateChangeHistory: [
          {
            changeType: "MARK_PICKED",
            date: "2019-08-24T14:15:22Z",
            reason: "Reason",
            value: "PICKED",
          },
        ],
      },
      trackingNumber: "GVALEBCN000088821238",
      orderCode: "WKGQJPF3",
      cancellable: true,
    };
    // Make a POST request to create a new user using axios
    console.log(`parcel POST: ${parcelReq}`);
    res.status(201).send(JSON.stringify(createParcel));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/parcels/validation", async (req, res) => {
  try {
    const parcelReq = req.body;
    const validation = {
      validationResult: "EXECUTABLE",
    };
    // Make a POST request to create a new user using axios
    console.log(`TEST POST: ${parcelReq}`);
    res.send(JSON.stringify(validation));
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/parcels/working-areas", async (req, res) => {
  try {
    // Make a POST request to create a new user using axios
    const workingAreas = {
      workingAreas: [
        {
          code: "BCN",
          cityName: "Barcelona",
          polygons: ["_rs{Fg{eL"],
          workingTime: {
            from: "07:00:00",
            duration: 1200,
          },
        },
        {
          code: "MCH",
          cityName: "Machakos",
          polygons: ["_rs{Fg{eL"],
          workingTime: {
            from: "07:00:00",
            duration: 1200,
          },
        },
        {
          code: "NAI",
          cityName: "Nairobi",
          polygons: ["_rs{Fg{eL"],
          workingTime: {
            from: "07:00:00",
            duration: 1200,
          },
        },
        {
          code: "NKR",
          cityName: "Nakuru",
          polygons: ["_rs{Fg{eL"],
          workingTime: {
            from: "07:00:00",
            duration: 1200,
          },
        },
      ],
    };
    console.log(`TEST POST: working-areas`);
    res.send(JSON.stringify(workingAreas));
  } catch (error) {
    res.status(500).send(error);
  }
});

// CANCEL
app.post("/parcels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    res.send(null);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET
app.get("/parcels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getParcel = {
      address: {
        cityName: "Barcelona",
        country: "Spain",
        details: "Additional information",
        postalCode: 30123,
        rawAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
        formattedAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
        streetName: "Calle Oporto",
        streetNumber: 2,
        latitude: 41.47155,
        longitude: 2.011038,
      },
      cityCode: "BCN",
      contact: {
        email: "recipient@email.com",
        name: "Recipient",
        phone: "+346666666666",
      },
      label: "string",
      packageDetails: {
        contentType: "FOOD",
        description: "A RAM expansion",
        parcelValue: 50,
        weight: 1,
      },
      packageId: 1213122,
      partnerId: 1,
      pickupDetails: {
        address: {
          cityName: "Barcelona",
          country: "Spain",
          details: "Additional information",
          postalCode: 30123,
          rawAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
          formattedAddress: "Calle Oporto 2, 30123, Barcelona, Spain",
          streetName: "Calle Oporto",
          streetNumber: 2,
          latitude: 41.47155,
          longitude: 2.011038,
        },
        pickupOrderCode: "PickupOrderCode123",
        pickupTime: "2019-08-24T14:15:22Z",
      },
      price: {
        delivery: {
          currencyCode: "EUR",
          value: 5.5,
        },
        parcel: {
          currencyCode: "EUR",
          value: 5.5,
        },
      },
      status: {
        createdAt: "2019-08-24T14:15:22Z",
        deliveryAt: "2019-08-24",
        lastUpdateAt: "2019-08-24T14:15:22Z",
        location: "OUT_FOR_DELIVERY",
        locationChangeHistory: [
          {
            changeType: "MARK_PICKED",
            date: "2019-08-24T14:15:22Z",
            reason: "Reason",
            value: "PICKED",
          },
        ],
        state: "PICKED",
        stateChangeHistory: [
          {
            changeType: "MARK_PICKED",
            date: "2019-08-24T14:15:22Z",
            reason: "Reason",
            value: "PICKED",
          },
        ],
      },
      trackingNumber: "GVALEBCN000088821238",
      orderCode: "WKGQJPF3",
      cancellable: true,
    };
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(getParcel));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/parcels/:id/history", async (req, res) => {
  try {
    const id = req.params.id;
    const history = {
      stateChangeHistory: [
        {
          state: "DELIVERED",
          updateTime: "2019-08-24T14:15:22Z",
        },
      ],
    };
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(history));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/info", async (req, res) => {
  try {
    const id = req.params.id;
    const info = {
      assignedCourier: {
        courierName: "Francisco",
        phone: 34666123123,
      },
    };
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(info));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/position", async (req, res) => {
  try {
    const id = req.params.id;
    const position = {
      latitude: 41.390205,
      longitude: 2.154007,
    };
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(position));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/courier/:id/link", async (req, res) => {
  try {
    const id = req.params.id;
    const link = {
      link: "https://testglovo.com/en/parcel-tracking/1234-test-uuid-1234",
    };
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(link));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/sim/:id/success", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(null));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/sim/:id/fail", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`TEST GET: ${id}`);
    res.send(JSON.stringify(null));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("Press CTRL-C to stop\n");
});

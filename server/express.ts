import express from "express";
import cors from "cors";
import { meilisearch } from "./routes/meilisearch";
import { getDirections, getGeocode } from "./routes/ors";
import { spawn } from "child_process";

const port = 3000;
const app = express();
// TODO: cors for NGROK_URL
app.use(cors({ origin: "*" }));

app.get("/meilisearch/:query", meilisearch);

app.get("/geocode/:place", getGeocode);

app.get("/directions/:start/:end", getDirections);

// Define the Docker Compose command to start the containers
const dockerStartCommand = ["docker", "start", "redis-stack", "meilisearch"];

// Use the spawn function to start the containers as a child process
const docker = spawn(dockerStartCommand[0], dockerStartCommand.slice(1));

// Log the output of the child process
docker.stdout.on("data", (data) => {
  console.log(`Docker stdout: ${data}`);
});

// Log any errors that occur during the child process execution
docker.stderr.on("data", (data) => {
  console.error(`Docker stderr: ${data}`);
});

// Log a message when the child process exits
docker.on("close", (code) => {
  console.log(`Docker child process exited with code ${code}`);

  // Start the Express server after the containers have started
  const server = app.listen(port, () => {
    console.log(`💫 Fireshop server is up 🔥🔥🔥 at port ${port}`);
  });

  // Listen for express app exit
  // server.on("close", () => {
  //   console.log("Express server stopped");
  //   const dockerStopCommand = ["docker", "start", "redis-stack", "meilisearch"];
  //   // Stop docker-compose containers
  //   const docker = spawn(dockerStopCommand[0], dockerStopCommand.slice(1));

  //   docker.on("close", (code) => {
  //     console.log(`Docker containers stopped with code ${code}`);
  //   });
  // });

  // Handle express app errors
  server.on("error", (err) => {
    console.error("Express server error", err);
  });
});

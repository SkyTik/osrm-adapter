import Agent from "agentkeepalive";
import axios, { AxiosInstance } from "axios";

const httpAgent: Agent = new Agent({
  maxSockets: 100,
  maxFreeSockets: 20,
  freeSocketTimeout: 10000,
});

const httpsAgent: Agent.HttpsAgent = new Agent.HttpsAgent({
  maxSockets: 100,
  maxFreeSockets: 20,
  freeSocketTimeout: 10000,
});

const clientAxios: AxiosInstance = axios.create({
  timeout: 5000,
  headers: { "User-Agent": "OSRM API" },
  httpsAgent,
  httpAgent,
});

export default clientAxios;

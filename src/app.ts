import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

// import { helmet } from "elysia-helmet";
import appV1 from "./routes/v1";
import logger from "./utils/logger";
import { getIp } from "./utils/utils";

const app = new Elysia()
  .use(cors())
  // .use(helmet())
  .onBeforeHandle(({ query, path, headers, params, body, set, request }) => {
    const logData = {
      remote_ip: getIp(headers),
      host: headers?.host,
      method: request.method,
      user_agent: headers["user-agent"],
      uri: path,
      params: JSON.stringify(params),
      query: JSON.stringify(query),
      body: JSON.stringify(body),
      status: set.status,
      request_time: "",
      response: "",
    };

    logger.info(logData);
  })

  .use(appV1)
  .onError(({ code, error }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
    logger.error(error);
  })
  .listen(8000);

logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export default app;

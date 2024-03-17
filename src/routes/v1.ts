import { HttpStatusCode } from "axios";
import { Elysia } from "elysia";

import { getDirections } from "../controllers/controller";
import hook from "./hook";

const appV1 = new Elysia({ prefix: "/v1" }).get(
  "/:profile/:mode/route/:coordinates",
  async ({ params: { profile, mode, coordinates }, query: { geometries = "polyline" }, set }) => {
    const result = await getDirections(profile, mode, coordinates, geometries);
    if (result) {
      return result;
    }

    set.status = HttpStatusCode.NotFound;
    return { message: "No suitable route found!" };
  },
  {
    ...hook,
    beforeHandle: ({ params: { profile, mode }, set }) => {
      if (mode === "bike" && profile === "google") {
        set.status = HttpStatusCode.BadRequest;
        return { message: "Google profile does not have mode bike" };
      }
    },
  },
);

export default appV1;

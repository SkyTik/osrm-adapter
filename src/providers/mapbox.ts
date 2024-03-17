import { RoutesResponse } from "../types/mapbox.types";
import { GeometryMode, OsrmResponse, Route } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import logger from "../utils/logger";

type MapboxMode = "DRIVING" | "WALKING" | "CYCLING";
const MapboxProfileMapping = {
  DRIVING: "/mapbox/driving",
  WALKING: "/mapbox/walking",
  CYCLING: "/mapbox/cycling",
};
const accessToken = Bun.env.MAPBOX_ACCESS_TOKEN;

async function getDirections(
  mode: MapboxMode,
  coordinates: string,
  geometries: GeometryMode,
): Promise<OsrmResponse | null> {
  const profile = MapboxProfileMapping[mode];

  const url: string = `https://api.mapbox.com/directions/v5${profile}/${coordinates}?access_token=${accessToken}&geometries=${geometries}`;

  try {
    const result = await axiosInstance.get<RoutesResponse>(url);

    if (result.data.code === "Ok") {
      const { duration, distance, geometry } = result.data.routes[0];
      const routes: Route[] = [
        {
          geometry,
          duration,
          distance,
        },
      ];

      return { code: "Ok", routes, provider: "mapbox" };
    }
  } catch (e) {
    logger.error(e);
  }

  return null;
}

export { getDirections, MapboxMode };

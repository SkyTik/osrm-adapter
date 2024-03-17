import {
  Client,
  DirectionsResponse,
  DirectionsResponseData,
  DirectionsStep,
  LatLng,
  RouteLeg,
  TravelMode,
  UnitSystem,
} from "@googlemaps/google-maps-services-js";
import _ from "lodash";

import { Coordinates, GeometryMode, OsrmResponse, Provider, Route } from "../types/types";
import Axios from "../utils/axiosInstance";
import logger from "../utils/logger";
import utils from "../utils/utils";

const { GOOGLE_MAPS_API_KEY } = Bun.env;

const client: Client = new Client({ axiosInstance: Axios });

function mapGoogleDirectionsResToOsrmRes(
  data: DirectionsResponseData,
  geometryMode: GeometryMode = "polyline",
  provider: Provider = "google",
): OsrmResponse {
  const coordinates: Array<Coordinates> = data.routes[0].legs
    .flatMap((leg: RouteLeg) =>
      leg.steps.flatMap((item: DirectionsStep) => [
        [item.start_location.lng, item.start_location.lat],
        [item.end_location.lng, item.end_location.lat],
      ]),
    )
    .filter(
      (item: Coordinates, index: number, array: Array<Coordinates>) =>
        index === 0 || !_.isEqual(item, array[index - 1]),
    );

  let geometry;
  if (geometryMode === "geojson") {
    geometry = { coordinates, type: "LineString" };
  } else {
    geometry = data.routes[0].overview_polyline?.points ?? data.routes[0].overview_polyline;
  }

  const duration = _.sum(
    data.routes[0].legs.flatMap((leg: RouteLeg) =>
      leg.steps.flatMap((item: DirectionsStep) => item.duration.value),
    ),
  );

  const distance = _.sum(
    data.routes[0].legs.flatMap((leg: RouteLeg) =>
      leg.steps.flatMap((item: DirectionsStep) => item.distance.value),
    ),
  );

  const routes: Route[] = [
    {
      geometry,
      duration,
      distance,
    },
  ];

  return { code: "Ok", routes, provider };
}

async function getDirections(
  mode: TravelMode | undefined,
  origin: LatLng,
  destination: LatLng,
  waypoints: LatLng[],
  geometries: GeometryMode,
): Promise<OsrmResponse | null> {
  const params = {
    mode: mode ?? TravelMode.driving,
    origin,
    destination,
    waypoints,
    key: GOOGLE_MAPS_API_KEY as string,
    units: UnitSystem.metric,
  };
  try {
    const result: DirectionsResponse = await client.directions({
      params,
    });

    if (result.data.status === "OK")
      return mapGoogleDirectionsResToOsrmRes(result.data, geometries);
  } catch (e) {
    logger.error(e);
  }

  return null;
}

function convertCoordinatesToParts(coordinates: string) {
  const arrayCoordinates: string[] = coordinates.split(";");
  const origin: string = utils.reverseCoordinateString(arrayCoordinates[0]);
  const destination: string = utils.reverseCoordinateString(
    arrayCoordinates[arrayCoordinates.length - 1],
  );
  const waypoints: string[] = arrayCoordinates
    .slice(1, -1)
    .map((coordinate: string) => utils.reverseCoordinateString(coordinate));

  return { origin, destination, waypoints };
}

export { convertCoordinatesToParts, getDirections, mapGoogleDirectionsResToOsrmRes };

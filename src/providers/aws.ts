import {
  CalculateRouteCommand,
  CalculateRouteCommandInput,
  CalculateRouteCommandOutput,
  Leg,
  LocationClient,
} from "@aws-sdk/client-location";
import polyline from "@mapbox/polyline";

import { Coordinates, GeometryMode, OsrmResponse, Route } from "../types/types";
import logger from "../utils/logger";

const client: LocationClient = new LocationClient({
  region: Bun.env.AWS_REGION,
});
const CALCULATOR_NAME = "grab.route.calculator";

type TravelMode = "Car" | "Truck" | "Walking" | "Bicycle" | "Motorcycle";

function mapAWSResToOsrm(
  data: CalculateRouteCommandOutput,
  geometries: GeometryMode = "polyline",
): OsrmResponse {
  if (!data.Legs) throw Error();

  const coordinates: Coordinates[] = data.Legs.flatMap(
    (leg: Leg) => leg.Geometry?.LineString,
  ) as Coordinates[];

  let geometry;

  if (geometries === "geojson") {
    geometry = {
      coordinates,
      type: "LineString",
    };
  } else {
    geometry = polyline.encode(coordinates.map((c) => c.reverse()) as [number, number][]);
  }

  const routes: Route[] = [
    {
      geometry,
      duration: data.Summary?.DurationSeconds ?? 0,
      distance: data.Summary?.Distance ? data.Summary.Distance * 1000 : 0,
    },
  ];

  return {
    code: "Ok",
    routes,
    provider: "aws",
  };
}

async function getDirections(
  mode: TravelMode | undefined,
  origin: Coordinates,
  destination: Coordinates,
  waypoints: Coordinates[],
  geometries: GeometryMode,
): Promise<null | OsrmResponse> {
  const input: CalculateRouteCommandInput = {
    CalculatorName: CALCULATOR_NAME,
    DeparturePosition: origin,
    DestinationPosition: destination,
    WaypointPositions: waypoints,
    TravelMode: mode ?? "Car",
    IncludeLegGeometry: true,
  };

  try {
    const command: CalculateRouteCommand = new CalculateRouteCommand(input);
    const result: CalculateRouteCommandOutput = await client.send(command);

    if (result?.Legs) return mapAWSResToOsrm(result, geometries);
  } catch (e) {
    logger.error(e);
  }
  return null;
}

function convertCoordinatesToParts(coordinates: string) {
  const arrayCoordinates: string[] = coordinates.split(";");

  const origin: number[] = arrayCoordinates[0].split(",").map((i) => Number(i));

  const destination: number[] = arrayCoordinates[arrayCoordinates.length - 1]
    .split(",")
    .map((i) => Number(i));

  const waypoints: number[][] = arrayCoordinates
    .slice(1, -1)
    .map((coordinate) => coordinate.split(",").map((i) => Number(i)));

  return {
    origin,
    destination,
    waypoints,
  };
}

export { convertCoordinatesToParts, getDirections };

import { TravelMode as AWSTravelMode } from "@aws-sdk/client-location/dist-types/models/models_0";
import { TravelMode } from "@googlemaps/google-maps-services-js";

import * as aws from "../providers/aws";
import * as google from "../providers/google";
import * as mapbox from "../providers/mapbox";
import { MapboxMode } from "../providers/mapbox";
import { GeometryMode, Mode, OsrmResponse, Profile } from "../types/types";
import { TravelModeMapping } from "../utils/constants";

async function getDirections(
  profile: Profile,
  mode: Mode,
  coordinates: string,
  geometries: GeometryMode,
): Promise<OsrmResponse | null> {
  const routingMode = TravelModeMapping[profile][mode];

  switch (profile) {
    case "google": {
      const { origin, destination, waypoints } = google.convertCoordinatesToParts(coordinates);
      return google.getDirections(
        routingMode as TravelMode,
        origin,
        destination,
        waypoints,
        geometries,
      );
    }
    case "aws": {
      const { origin, destination, waypoints } = aws.convertCoordinatesToParts(coordinates);
      return aws.getDirections(
        routingMode as AWSTravelMode,
        origin,
        destination,
        waypoints,
        geometries,
      );
    }
    case "mapbox": {
      return mapbox.getDirections(routingMode as MapboxMode, coordinates, geometries);
    }
    default:
      return null;
  }
}

export { getDirections };

export type Coordinates = number[] | [number, number];

export interface Route {
  geometry:
    | {
        coordinates: Coordinates[];
        type: string;
      }
    | string;
  duration: number;
  distance: number;
}

export interface OsrmResponse {
  code: string;
  routes: Route[];
  provider: Provider;
}

export type Provider = "google" | "aws" | "osrm" | "mapbox";

export type GeometryMode = "polyline" | "geojson";

export type Profile = "aws" | "google" | "mapbox";
export type Mode = "driving" | "walking" | "bicycle" | "bike";

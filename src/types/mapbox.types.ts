interface Route {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  legs: Leg[];
  geometry: string | Geometry;
}
interface Geometry {
  coordinates: number[][];
  type: string;
}

interface Leg {
  via_waypoints: any[];
  admins: Admin[];
  weight: number;
  duration: number;
  steps: any[];
  distance: number;
  summary: string;
}

interface Admin {
  iso_3166_1: string;
}

interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

export interface RoutesResponse {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

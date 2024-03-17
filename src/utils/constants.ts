import { TravelMode } from "@googlemaps/google-maps-services-js";

export const TravelModeMapping = {
  google: {
    driving: TravelMode.driving,
    walking: TravelMode.walking,
    bicycle: TravelMode.bicycling,
    bike: "",
  },
  aws: {
    driving: "Car",
    bike: "Motorcycle",
    walking: "Walking",
    bicycle: "Bicycle",
  },
  mapbox: {
    driving: "DRIVING",
    bike: "DRIVING",
    walking: "WALKING",
    bicycle: "BICYCLING",
  },
};

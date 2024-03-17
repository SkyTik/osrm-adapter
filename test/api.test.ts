import { edenTreaty } from "@elysiajs/eden";
import { describe, expect, it } from "bun:test";

import app from "../src/app";
import { Mode, Profile } from "../src/types/types";

const api = edenTreaty<typeof app>("http://localhost:8000");
type Version = "v1";
const testCoordinates = "106.628396,10.835149;106.721129,10.737651";

function testRoute(
  version: Version,
  routeName: Profile,
  coordinates: string,
  mode: Mode = "driving",
  itMessage?: string,
) {
  const testCase = `${version}/${routeName}/${mode}/route/:${coordinates}`;

  let result;

  it(itMessage ?? `GET ${testCase}`, async () => {
    result = await api[version][routeName][mode].route[coordinates].get({
      $query: { geometries: "polyline" },
    });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data).not.toBeNull();
    expect(result.data).not.toHaveProperty("message");

    if (result.data && !("message" in result.data)) {
      expect(result.data.code).toBe("Ok");
      expect(result.data?.routes).toBeDefined();
      expect(result.data?.routes?.length).toBeGreaterThan(0);
    }
  });
}

describe("v1", () => {
  testRoute("v1", "google", testCoordinates, "driving");
  testRoute("v1", "mapbox", testCoordinates, "driving");
  testRoute("v1", "aws", testCoordinates, "driving");

  it("Google should be failed with mode=bike", async () => {
    const result = await api.v1.google.bike.route[testCoordinates].get({
      $query: {
        geometries: "polyline",
      },
    });

    expect(result.status).toBe(400);
    expect(result.data).toBeDefined();
    expect(result.data).not.toBeNull();
    expect(result.data).toHaveProperty("message");
  });
});

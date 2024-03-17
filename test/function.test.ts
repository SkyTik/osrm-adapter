import { describe, expect, it } from "bun:test";

import { getDirections } from "../src/controllers/controller";

describe("get directions", () => {
  it("Google return directions", async () => {
    const directions = await getDirections(
      "google",
      "driving",
      "106.628396,10.835149;106.721129,10.737651",
      "polyline",
    );
    expect(directions?.code).toBe("Ok");
    expect(directions?.routes?.length).toBeGreaterThan(0);
  });

  it("AWS return directions", async () => {
    const directions = await getDirections(
      "aws",
      "driving",
      "106.628396,10.835149;106.721129,10.737651",
      "polyline",
    );
    expect(directions?.code).toBe("Ok");
    expect(directions?.routes?.length).toBeGreaterThan(0);
  });

  it("mapbox return directions", async () => {
    const directions = await getDirections(
      "mapbox",
      "driving",
      "106.628396,10.835149;106.721129,10.737651",
      "polyline",
    );
    expect(directions?.code).toBe("Ok");
    expect(directions?.routes?.length).toBeGreaterThan(0);
  });
});

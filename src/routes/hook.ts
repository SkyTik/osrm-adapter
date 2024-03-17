import { t } from "elysia";

export default {
  params: t.Object({
    profile: t.Union([t.Literal("aws"), t.Literal("google"), t.Literal("mapbox")]),
    mode: t.Union([
      t.Literal("driving"),
      t.Literal("walking"),
      t.Literal("bicycle"),
      t.Literal("bike"),
    ]),
    coordinates: t.RegExp(/^(\d+(?:\.\d+)?,\d+(?:\.\d+)?;)*\d+(?:\.\d+)?,\d+(?:\.\d+)?$/),
  }),
  query: t.Object({
    geometries: t.Optional(t.Union([t.Literal("geojson"), t.Literal("polyline")])),
    // these two fields are not used by this API but added as optional for backward compatibility
    alternatives: t.Optional(t.String()),
    overview: t.Optional(t.String()),
  }),
};

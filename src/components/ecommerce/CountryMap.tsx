import { useMemo } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json" with { type: "json" };

type CountryFeature = Feature<Geometry, Record<string, unknown>>;

const markers = [
  {
    name: "United States",
    latLng: [37.2580397, -104.657039] as const,
  },
  {
    name: "India",
    latLng: [20.7504374, 73.7276105] as const,
  },
  {
    name: "United Kingdom",
    latLng: [53.613, -11.6368] as const,
  },
  {
    name: "Sweden",
    latLng: [-25.0304388, 115.2092761] as const,
  },
];

interface CountryMapProps {
  mapColor?: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  const countries = useMemo(() => {
    const topology = worldData as Topology<Record<string, unknown>>;
    const objects = topology.objects as Record<string, unknown> | undefined;
    const countriesObject = objects?.countries;

    if (!countriesObject) {
      return [] as CountryFeature[];
    }

    const collection = feature(
      topology,
      countriesObject as unknown,
    ) as FeatureCollection<Geometry, Record<string, unknown>> | null;

    if (!collection) {
      return [] as CountryFeature[];
    }

    return collection.features as CountryFeature[];
  }, []);

  const projection = useMemo(() => {
    const projectionInstance = geoMercator();
    if (countries.length > 0) {
      projectionInstance.fitSize([760, 360], {
        type: "FeatureCollection",
        features: countries,
      });
    }
    return projectionInstance;
  }, [countries]);

  const pathGenerator = useMemo(() => geoPath(projection), [projection]);

  return (
    <svg viewBox="0 0 760 360" className="w-full h-auto" role="img" aria-label="World map with highlighted countries">
      <g>
        {countries.map((country) => {
          const path = pathGenerator(country);
          if (!path) return null;

          return (
            <path
              key={country.id ?? country.properties?.name ?? path}
              d={path}
              fill={mapColor ?? "#D0D5DD"}
              fillOpacity={1}
              stroke="none"
            />
          );
        })}
      </g>
      <g>
        {markers.map((marker) => {
          const [lat, lng] = marker.latLng;
          const projected = projection([lng, lat]);
          if (!projected) return null;

          return (
            <g key={marker.name} transform={`translate(${projected[0]}, ${projected[1]})`}>
              <circle
                r={6}
                fill="#465FFF"
                stroke="white"
                strokeWidth={2}
                opacity={0.9}
              />
              <text
                x={10}
                y={4}
                fill="#1F2933"
                fontSize={12}
                fontWeight={600}
              >
                {marker.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default CountryMap;

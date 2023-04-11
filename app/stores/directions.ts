import { writable } from "svelte/store";

interface Directions {
  type: string;
  features: Feature[];
  bbox: number[];
  metadata: Metadata;
}

interface Feature {
  bbox: number[];
  type: string;
  properties: Properties;
  geometry: Geometry;
}

interface Properties {
  segments: Segment[];
  summary: Summary;
  way_points: number[];
}

interface Segment {
  distance: number;
  duration: number;
  steps: Step[];
}

interface Step {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  way_points: number[];
}

interface Summary {
  distance: number;
  duration: number;
}

interface Geometry {
  coordinates: number[][];
  type: string;
}

interface Metadata {
  attribution: string;
  service: string;
  timestamp: number;
  query: Query;
  engine: Engine;
}

interface Query {
  coordinates: number[][];
  profile: string;
  format: string;
}

interface Engine {
  version: string;
  build_date: string;
  graph_date: string;
}

const directions = writable({} as Directions);

export { directions };

export type { Directions };

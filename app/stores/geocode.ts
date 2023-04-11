import { writable } from "svelte/store";

interface Geocode {
  geocoding: Geocoding;
  type: string;
  features: Feature;
  bbox: number[];
}

interface Geocoding {
  version: string;
  attribution: string;
  query: Query;
  warnings: string[];
  engine: Engine;
  timestamp: number;
}

interface Query {
  text: string;
  parser: string;
  parsed_text: ParsedText;
  size: number;
  layers: string[];
  private: boolean;
  lang: Lang;
  querySize: number;
}

interface ParsedText {
  subject: string;
}

interface Lang {
  name: string;
  iso6391: string;
  iso6393: string;
  via: string;
  defaulted: boolean;
}

interface Engine {
  name: string;
  author: string;
  version: string;
}

interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
  bbox?: number[];
}

interface Geometry {
  type: string;
  coordinates: number[];
}

interface Properties {
  id: string;
  gid: string;
  layer: string;
  source: string;
  source_id: string;
  name: string;
  accuracy: string;
  country: string;
  country_gid: string;
  country_a: string;
  region: string;
  region_gid: string;
  region_a?: string;
  county?: string;
  county_gid?: string;
  locality?: string;
  locality_gid?: string;
  continent: string;
  continent_gid: string;
  label: string;
  addendum: Addendum;
  county_a?: string;
  localadmin?: string;
  localadmin_gid?: string;
  macroregion?: string;
  macroregion_gid?: string;
  neighbourhood?: string;
  neighbourhood_gid?: string;
}

interface Addendum {
  concordances?: Concordances;
  geonames?: Geonames;
}

interface Concordances {
  "gn:id": number;
  "gp:id": number;
  "qs_pg:id": number;
  "qs:id"?: number;
  "dbp:id"?: string;
  "fb:id"?: string;
  "fct:id"?: string;
  "fips:code"?: string;
  "loc:id"?: string;
  "ne:id"?: number;
  "nyt:id"?: string;
  "wd:id"?: string;
  "wk:page"?: string;
  "hasc:id"?: string;
  "iso:id"?: string;
  "unlc:id"?: string;
}

interface Geonames {
  feature_code: string;
}

const geocode = writable({} as Geocode);

export { geocode };
export type { Geocode, Feature };

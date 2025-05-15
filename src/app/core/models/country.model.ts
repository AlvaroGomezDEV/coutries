export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [lang: string]: {
        official: string;
        common: string;
      };
    };
  };
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: {
    [code: string]: string;
  };
  latlng?: number[];
  landlocked?: boolean;
  borders?: string[];
  area?: number;
  demonyms?: {
    [lang: string]: {
      f: string;
      m: string;
    };
  };
  translations?: {
    [lang: string]: {
      official: string;
      common: string;
    };
  };
  flag?: string;
  flags: {
    png: string;
    svg: string;
    alt: string;
  };
  maps?: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population?: number;
  fifa?: string;
  car?: {
    signs?: string[];
    side?: 'left' | 'right';
  };
  timezones?: string[];
  continents?: string[];
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  startOfWeek?: string;
  capitalInfo?: {
    latlng?: number[];
  };
  postalCode?: {
    format?: string | null;
    regex?: string | null;
  };
}
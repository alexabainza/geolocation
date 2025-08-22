// DATA FROM FETCH SEARCH RESULTS
export type SearchResult = {
  anycast?: boolean;
  city?: string;
  country?: string;
  hostname?: string;
  ip?: string;
  locationData?: {
    latitude?: number;
    longitude?: number;
  };
  org?: string;
  postal?: string;
  region?: string;
  readme?: string;
  timezone?: string;
};

export type SearchItem = {
  _id?: string;
  ip_searched: string;
  locationData: {
    organization: string;
    city: string;
    country: string;
    hostname: string;
    ip: string;
    location: {
      latitude: number;
      longitude: number;
    };
    postal: string;
    region: string;
    timezone: string;
    anycast: boolean;
  };
  // createdAt: string;
  // updatedAt: string;
  // user: string;
};
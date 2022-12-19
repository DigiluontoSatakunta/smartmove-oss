import { gql, useQuery } from "@apollo/client";

export const GET_STATION_BY_COORDS = gql`
  query GET_WEATHER_STATION_BY_COORDS($lat: Float!, $lon: Float!) {
    openWeatherMapLocationsByCoordinates(lat: $lat, lon: $lon, limit: 10) {
      name
      lat
      lon
      country
      local_names {
        en
        fi
        __typename
      }
      __typename
    }
  }
`;

export const useCoordsToCity = coords => {
  const { data, loading, error } = useQuery(GET_STATION_BY_COORDS, {
    variables: {
      lat: parseFloat(coords[0]),
      lon: parseFloat(coords[1]),
    },
  });

  return {
    data: data?.openWeatherMapLocationsByCoordinates,
    loading,
    error,
  };
};

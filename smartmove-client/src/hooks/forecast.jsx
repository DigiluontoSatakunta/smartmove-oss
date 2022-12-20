import {gql, useQuery} from "@apollo/client";

export const GET_FORECAST = gql`
  query Forecast($location: String!) {
    forecast(location: $location) {
      place
      measurements {
        Temperature {
          label
          symbol
          values {
            time
            value
          }
        }
        WindSpeedMS {
          label
          symbol
          values {
            time
            value
          }
        }
        WeatherSymbol3 {
          label
          symbol
          values {
            time
            value
          }
        }
      }
      __typename
    }
  }
`;

export const useForecast = location => {
  const {data, loading, error} = useQuery(GET_FORECAST, {
    variables: {
      location: location,
    },
  });
  return {
    forecast: data?.forecast,
    loading,
    error,
  };
};

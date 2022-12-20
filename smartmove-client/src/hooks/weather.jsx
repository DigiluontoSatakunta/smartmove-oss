import {gql, useQuery} from "@apollo/client";

export const WeatherData = gql`
  query weatherData(
    $station: String!
    $element: Element!
    $start: String!
    $stop: String!
    $aggregateWindow: String
    $fn: String
  ) {
    weatherData(
      station: $station
      element: $element
      start: $start
      stop: $stop
      aggregateWindow: $aggregateWindow
      fn: $fn
    ) {
      time
      value
    }
  }
`;

export const useWeatherData = ({
  station,
  element,
  start,
  stop,
  aggregateWindow,
  fn,
}) => {
  const {data, loading, error} = useQuery(WeatherData, {
    variables: {
      station,
      element,
      start,
      stop,
      aggregateWindow,
      fn,
    },
  });

  return {
    data: data?.weatherData,
    loading,
    error,
  };
};

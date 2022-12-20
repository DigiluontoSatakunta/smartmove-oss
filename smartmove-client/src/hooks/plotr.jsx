import {gql, useQuery} from "@apollo/client";

export const GET_PLOTR = gql`
  query GET_PLOTR(
    $area_code: Int!
    $x_param: String!
    $y_param: String!
    $range_window: String
    $aggregate_window: String
  ) {
    plotr(
      area_code: $area_code
      x_param: $x_param
      y_param: $y_param
      range_window: $range_window
      aggregate_window: $aggregate_window
    ) {
      image
    }
  }
`;

export const usePlotr = ({
  area_code,
  x_param,
  y_param,
  range_window,
  aggregate_window,
}) => {
  const {data, loading, error} = useQuery(GET_PLOTR, {
    variables: {
      area_code,
      x_param,
      y_param,
      range_window,
      aggregate_window,
    },
  });

  return {
    image: `data:image/png;base64,${data?.plotr?.image}`,
    loading,
    error,
  };
};

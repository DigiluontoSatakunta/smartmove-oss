import {gql, useQuery} from "@apollo/client";

export const OperatorHeatmap = gql`
  query operatorHeatmap($start: String!, $stop: String!) {
    heatmapData(start: $start, stop: $stop) {
      value
      areaCode
    }
  }
`;

export const OperatorDataByAreaCode = gql`
  query operatorDataByAreaCode(
    $areaCode: Int!
    $start: String!
    $stop: String!
    $aggregateWindow: String
  ) {
    operatorDataByAreaCode(
      areaCode: $areaCode
      start: $start
      stop: $stop
      aggregateWindow: $aggregateWindow
    ) {
      time
      value
    }
  }
`;

export const useOperatorHeatmap = ({start, stop}) => {
  const {data, loading, error} = useQuery(OperatorHeatmap, {
    variables: {
      start,
      stop,
    },
  });

  return {
    data: data?.heatmapData,
    loading,
    error,
  };
};

export const useOperatorAreaData = ({
  areaCode,
  start,
  stop,
  aggregateWindow,
}) => {
  const {data, loading, error} = useQuery(OperatorDataByAreaCode, {
    variables: {
      areaCode,
      start,
      stop,
      aggregateWindow,
    },
  });

  return {
    data: data?.operatorDataByAreaCode,
    loading,
    error,
  };
};

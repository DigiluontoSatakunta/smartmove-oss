import {gql, useQuery} from "@apollo/client";

export const GET_NACE_AGGREGATIONS = gql`
  query GET_NACE_AGGREGATIONS($id: String!) {
    sykeNaceAggregations(id: $id) {
      nace
      naceName
      value
    }
  }
`;

export const useNaceAggregations = id => {
  const {data, loading, error} = useQuery(GET_NACE_AGGREGATIONS, {
    variables: {id},
  });

  return {
    naces: data?.sykeNaceAggregations,
    loading,
    error,
  };
};

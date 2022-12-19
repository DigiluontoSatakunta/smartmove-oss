import {gql, useQuery} from "@apollo/client";

export const GET_FIREPLACES = gql`
  query Fireplaces($county: String!, $type: String) {
    fireplaces(county: $county, type: $type) {
      id
      name
      type
      county
      coordinates
    }
  }
`;

export const useFireplaces = () => {
  const county = "Satakunta";

  const {data, loading, error} = useQuery(GET_FIREPLACES, {
    variables: {
      county,
    },
  });

  return {
    sites: data?.fireplaces,
    loading,
    error,
  };
};

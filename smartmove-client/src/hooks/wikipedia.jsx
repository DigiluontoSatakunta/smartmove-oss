import {gql, useQuery} from "@apollo/client";

// TODO: Use real coordinates
export const GET_WIKIPEDIA_GEOSEARCH = gql`
  query WikipediaGeosearchQuery {
    wikipediaGeoSearch(
      gscoords: "61.48653|21.79417"
      gsradius: 10000 # max 10km radius
      gslimit: 500
    ) {
      query {
        geosearch {
          id: pageid
          title
          lat
          lon
          __typename
        }
        __typename
      }
    }
  }
`;

export const GET_WIKIPEDIA_PAGE_QUERY = gql`
  query WikipediaPage($pageid: Int!) {
    wikipediaPage(pageid: $pageid) {
      query {
        pages {
          title
          pageid
          images {
            title
          }
          revisions {
            slots {
              main {
                contentmodel
                contentformat
                content
              }
              __typename
            }
          }
          __typename
        }
      }
      __typename
    }
  }
`;

export const GET_WIKIPEDIA_CONTENT_QUERY = gql`
  query WikipediaPageParsedContent($pageid: Int!) {
    wikipediaPageParsedContent(pageid: $pageid) {
      text
      __typename
    }
  }
`;

export const useWikipediaPage = pageid => {
  const {data, loading, error} = useQuery(GET_WIKIPEDIA_PAGE_QUERY, {
    variables: {
      pageid: pageid,
    },
  });

  return {
    page: data?.wikipediaPage?.query?.pages[0],
    loading,
    error,
  };
};

export const useWikipediaPageParsedContent = pageid => {
  const {data, loading, error} = useQuery(GET_WIKIPEDIA_CONTENT_QUERY, {
    variables: {
      pageid: pageid,
    },
  });

  return {
    text: data?.wikipediaPageParsedContent?.text,
    loading,
    error,
  };
};

export const useWikipediaGeoSearch = () => {
  const {data, loading, error} = useQuery(GET_WIKIPEDIA_GEOSEARCH);

  return {
    sites: data?.wikipediaGeoSearch?.query?.geosearch,
    loading,
    error,
  };
};

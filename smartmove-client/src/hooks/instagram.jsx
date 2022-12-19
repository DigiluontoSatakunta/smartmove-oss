import {gql, useQuery} from "@apollo/client";

export const GET_IMAGES_BY_HASHTAG = gql`
  query GET_IMAGES_BY_HASHTAG($hashtag: String!) {
    instagramFeedByHashtag(hashtag: $hashtag) {
      node {
        thumbnail_resources {
          src
          config_height
          config_width
        }
      }
    }
  }
`;

export const useIgImagesByHashTag = hashtag => {
  const {data, loading, error} = useQuery(GET_IMAGES_BY_HASHTAG, {
    variables: {
      hashtag,
    },
  });

  return {
    feed: data?.instagramFeedByHashtag,
    loading,
    error,
  };
};

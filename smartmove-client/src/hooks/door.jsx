import {gql, useQuery} from "@apollo/client";

const DOOR_PARTS = gql`
  fragment DoorParts on Door {
    result {
      uplink_message {
        received_at
        locations {
          user {
            latitude
            longitude
          }
        }
        decoded_payload {
          DOOR_OPEN_STATUS
          LAST_DOOR_OPEN_DURATION
        }
      }
    }
  }
`;

export const GET_DOOR_LATEST = gql`
  query Latest {
    doorLatest {
      result {
        uplink_message {
          received_at
          locations {
            user {
              latitude
              longitude
            }
          }
          decoded_payload {
            DOOR_OPEN_STATUS
            LAST_DOOR_OPEN_DURATION
          }
        }
      }
    }
  }
`;

export const GET_DOOR_HISTORY = gql`
  ${DOOR_PARTS}
  query DoorHistory {
    doorHistory {
      ...DoorParts
    }
  }
`;

export const useDoorLatest = () => {
  const {data, loading, error} = useQuery(GET_DOOR_LATEST);

  return {
    result: data?.doorLatest?.result,
    loading,
    error,
  };
};

export const useDoorHistory = () => {
  const {data, loading, error} = useQuery(GET_DOOR_HISTORY);

  return {
    results: data?.doorHistory,
    loading,
    error,
  };
};

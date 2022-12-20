import {gql, useQuery} from "@apollo/client";

export const GET_STATIONS = gql`
  query DIGITRAFFIC_STATIONS_METADATA {
    digitrafficTmsStationsMetaData {
      id
      name
      description
      type
      geometry {
        type
        coordinates
      }
      properties {
        roadStationId
        tmsNumber
        name
        collectionInterval
        collectionStatus
        municipality
        municipalityCode
        province
        provinceCode
        names {
          fi
        }
        roadAddress {
          roadNumber
          roadSection
        }
        startTime
        state
        purpose
        coordinatesETRS89
        direction1Municipality
        direction2Municipality
        freeFlowSpeed1
        freeFlowSpeed2
      }
    }
  }
`;

export const useStations = () => {
  const {data, loading, error} = useQuery(GET_STATIONS);

  return {
    sites: data?.digitrafficTmsStationsMetaData,
    loading,
    error,
  };
};

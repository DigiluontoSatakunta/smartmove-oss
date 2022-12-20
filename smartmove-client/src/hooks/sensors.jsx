import {gql, useQuery} from "@apollo/client";

export const GET_SENSORS = gql`
  query DIGITRAFFIC_SERSOR_METADATA {
    digitrafficTmsSensorMetaData {
      dataUpdatedTime
      dataLastCheckedTime
      roadStationSensors {
        id
        name
        lane
        unit
        shortName
        accuracy
        direction
        description
        descriptions
        vehicleClasses
        presentationNames
        sensorValueDescriptions {
          descriptionFi
          sensorValue
        }
      }
    }
  }
`;
export const GET_ALL_SENSOR_LAM_DATA = gql`
  query ALL_SENSOR_LAM_DATA {
    digitrafficAllSensorLamData {
      dateUpdatedTime
      tmsStations {
        id
        measuredTime
        sensorValues {
          id
          name
          sensorUnit
          sensorValue
          roadStationId
        }
      }
    }
  }
`;

export const GET_LAM_SENSOR = gql`
  query DIGITRAFFIC_SENSOR_LAMDATA($id: Int!) {
    digitrafficTmsSensorLamData(id: $id) {
      tmsStations {
        id
        tmsNumber
        measuredTime
        sensorValues {
          id
          name
          oldName
          shortName
          roadStationId
          sensorValue
          sensorUnit
          timeWindowStart
          timeWindowEnd
          measuredTime
        }
      }
    }
  }
`;

export const useAllLamSensor = () => {
  const {data, loading, error} = useQuery(GET_ALL_SENSOR_LAM_DATA);

  return {
    allSensors: data?.digitrafficAllSensorLamData,
    loading,
    error,
  };
};
export const useLamSensor = sensorid => {
  const {data, loading, error} = useQuery(GET_LAM_SENSOR, {
    variables: {
      id: Number.parseInt(sensorid),
    },
  });

  return {
    lamSensor: data?.digitrafficTmsSensorLamData?.tmsStations[0],
    loading,
    error,
  };
};

export const useSensors = () => {
  const {data, loading, error} = useQuery(GET_SENSORS);

  return {
    sensors: data,
    loading,
    error,
  };
};

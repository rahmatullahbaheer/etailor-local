import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const MapViewComponent = ({ lat, lng }) => {
  // const [currentLocation, setCurrentLocation] = useState({
  //   latitude: 33.9732309,
  //   longitude: 71.4773556,
  //   latitudeDelta: 0.00122,
  //   longitudeDelta: 0.00421,
  // });

  // useEffect(() => {
  //   if (lat && lng) {
  //     setCurrentLocation({ ...currentLocation, latitude: lat, longitude: lng });
  //   }
  // }, []);

  return (
    <View style={styles.mapContainer}>
      {
        lat ?
          <MapView
          style={styles.map}
          showsBuildings={true}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: lat ? 30.3753 : lat,
            longitude: lng ? 69.3451 : lng,
            latitudeDelta: 0.00122,
            longitudeDelta: 0.00421
          }}
        >
          <Marker
            coordinate={{
              latitude: lat === undefined ? 30.3753 : lat,
              longitude: lng === undefined ? 69.3451 : lng
            }}
            title={"Project location"}
            description={"Project location"}
          />
        </MapView>
        :
        null
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapViewComponent;

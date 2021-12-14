import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Helmet } from "react-helmet-async";

interface ICoords {
  latitude: number;
  longitude: number;
}

export const Dashboard: React.FC = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    latitude: 0,
    longitude: 0,
  });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = (position: GeolocationPosition) => {
    const {
      coords: { latitude, longitude },
    } = position;
    setDriverCoords({ latitude, longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude));
    setMap(map);
    setMaps(maps);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.latitude, driverCoords.longitude));
    }
  }, [driverCoords.latitude, driverCoords.longitude]);
  return (
    <div
      className="overflow-hidden"
      style={{ width: window.innerWidth, height: "50vh" }}
    >
      <Helmet>
        <title>Dashboard | Uber Eats</title>
      </Helmet>
      <GoogleMapReact
        defaultZoom={16}
        defaultCenter={{
          lat: 37,
          lng: 126,
        }}
        bootstrapURLKeys={{ key: "AIzaSyCSZWElP7VBeVAfaWKab6de0RaTAEoWMv4" }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={onApiLoaded}
      >
        <div
          //@ts-ignore
          lat={driverCoords.latitude}
          lng={driverCoords.longitude}
          className="flex justify-center items-center"
        >
          <span className="text-3xl pr-1 pb-1">🚗</span>
        </div>
      </GoogleMapReact>
    </div>
  );
};

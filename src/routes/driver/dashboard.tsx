import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Helmet } from "react-helmet-async";

interface ICoords {
  lat: number;
  lng: number;
}

// 구글 맵 컴포넌트 안에 컴포넌트를 넣기 위해 아래와 같은 타입이 필요하다. 없으면 워닝이 엄청 나타남.
interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}
const Driver: React.FC<IDriverProps> = () => (
  <div className="flex justify-center items-center">
    <span className="text-3xl pr-1 pb-1">🚗</span>
  </div>
);

export const Dashboard: React.FC = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 0,
    lng: 0,
  });
  const [map, setMap] = useState<google.maps.Map>();
  // maps는 브라우저가 로딩될 때 window에 이미 포함된다.
  // 따라서 maps가 필요하면 google.maps로 호출하고, maps를 따로 저장할 필요가 없다.
  // const [maps, setMaps] = useState<any>();
  const onSuccess = (position: GeolocationPosition) => {
    const {
      coords: { latitude: lat, longitude: lng },
    } = position;
    setDriverCoords({ lat, lng });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    // setMaps(maps);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (result, status) => {
          console.log(status, result);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);
  const onGetRouteClick = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionRenderer = new google.maps.DirectionsRenderer();
      directionRenderer.setMap(map);
      directionsService.route(
        {
          travelMode: google.maps.TravelMode.WALKING,
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat + 0.05,
              driverCoords.lng + 0.05
            ),
          },
        },
        (result) => {
          directionRenderer.setDirections(result);
        }
      );
    }
  };
  return (
    <>
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
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get route</button>
    </>
  );
};

import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import { Helmet } from "react-helmet-async";
import gql from "graphql-tag";
import { FULL_ORDER_FRAGMENT } from "../../fragments";
import { useMutation, useSubscription } from "@apollo/client";
import { cookedOrder } from "../../__generated__/cookedOrder";
import { Link } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__generated__/takeOrder";

const COOCKED_ORDER_SUBSCRIPTION = gql`
  subscription cookedOrder {
    cookedOrder {
      ...FullOrderFragment
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

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
  const [takeOrderMutation, { loading: takeOrderMutationLoading }] =
    useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION);
  const { data: subscriptionData } = useSubscription<cookedOrder>(
    COOCKED_ORDER_SUBSCRIPTION
  );
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 51.5,
    lng: -0.15,
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
  // useEffect(() => {
  //   if (map) {
  //     map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  //     const geocoder = new google.maps.Geocoder();
  //     geocoder.geocode(
  //       {
  //         location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
  //       },
  //       (result, status) => {
  //         console.log(status, result);
  //       }
  //     );
  //   }
  // }, [driverCoords.lat, driverCoords.lng, map]);
  const onTakeOrder = () => {
    if (takeOrderMutationLoading || !subscriptionData) {
      return;
    }
    takeOrderMutation({
      variables: {
        input: {
          id: subscriptionData.cookedOrder.id,
        },
      },
    });
  };
  useEffect(() => {
    if (subscriptionData?.cookedOrder.id && map) {
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
              driverCoords.lng
            ),
          },
        },
        (result) => {
          directionRenderer.setDirections(result);
        }
      );
    }
  }, [subscriptionData, driverCoords, map]);

  return (
    <div className="bg-white" style={{ height: "85vh" }}>
      <div
        className="overflow-hidden "
        style={{ width: window.innerWidth, height: "40vh" }}
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

      <div className="flex justify-center pt-20 ">
        {subscriptionData?.cookedOrder ? (
          <div className="w-full max-w-md border border-green-500 ">
            <h2 className="bg-green-500 font-medium text-white text-center text-xl py-4">
              New Cooked Order
            </h2>
            <h4 className="py-4 border-t border-gray-200 text-center">
              {`Pick it up soon at ${subscriptionData?.cookedOrder.restaurant?.name}`}
            </h4>
            <Link
              to={`/orders/${subscriptionData.cookedOrder.id}`}
              className="button flex justify-center"
              onClick={onTakeOrder}
            >
              Accept &rarr;
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-md ">
            <h2 className="text-gray-400 font-medium text-center text-2xl">
              No orders yet..
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

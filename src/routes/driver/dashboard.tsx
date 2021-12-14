import React from "react";
import GoogleMapReact from "google-map-react";
// import { Helmet } from "react-helmet-async";

export const Dashboard: React.FC = () => {
  return (
    <div
      className="overflow-hidden"
      style={{ width: window.innerWidth, height: "90vh" }}
    >
      {/* <Helmet>
        <title>Dashboard | Uber Eats</title>
      </Helmet> */}
      <GoogleMapReact
        defaultZoom={10}
        defaultCenter={{
          lat: 59.95,
          lng: 30.33,
        }}
        bootstrapURLKeys={{ key: "AIzaSyDux6IrqN9iRWoBX-Nb5_LqN2vcvlo0t7k" }}
      >
        <h1>hello</h1>
      </GoogleMapReact>
    </div>
  );
};

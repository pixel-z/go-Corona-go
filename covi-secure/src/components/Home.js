import React, { useState, useEffect } from "react";
import MapGL, {
  GeolocateControl,
  FlyToInterpolator,
  Marker,
  NavigationControl,
  Popup,
  Source,
  Layer,
} from "react-map-gl";
import axios from "axios";
import PolyLineOverlay from "./PolyLineOverlay";
import config from "./config";
import { heatmapLayer } from "./map-style";
import "./Home.css";

const mapRef = React.createRef();

const makeGeoJSON = (data) => {
  return {
    type: "FeatureCollection",
    features: data.map((feature, ind) => {
      return {
        type: "Feature",
        properties: {
          id: ind,
          mag: ind,
        },
        geometry: {
          type: "Point",
          coordinates: [feature[0], feature[1]],
        },
      };
    }),
  };
};

const Home = (props) => {
  const TOKEN = config.ACCESS_TOKEN;

  const [points, setPoints] = useState([]);
  const [data, setData] = useState(null);

  const [src, setSrc] = useState({});
  const [dest, setDest] = useState({});

  const [viewport, setViewPort] = useState({
    width: "100%",
    height: "100vh",
    zoom: 14,
    latitude: 0,
    longitude: 0,
    // style: "mapbox://styles/b30wulffz/ckpa6spae3ih118qtqiqyrfjb",
  });

  const testData = {
    latitude: 28.6438778,
    longitude: 77.1466734,
  };

  useEffect(() => {
    setSrc({
      latitude: testData.latitude,
      longitude: testData.longitude,
    });
    setViewPort({
      ...viewport,
      latitude: testData.latitude,
      longitude: testData.longitude,
    });

    axios
      .get("http://localhost:3000/population")
      .then((response) => {
        setData(makeGeoJSON(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const _onViewportChange = (newViewport) => {
    setViewPort({
      ...newViewport,
    });
  };

  const getCoordinates = (evt) => {
    console.log(evt.lngLat[0], evt.lngLat[1]);
    setDest({
      latitude: Number(evt.lngLat[1].toFixed(7)),
      longitude: Number(evt.lngLat[0].toFixed(7)),
    });
  };

  const getSafePath = (evt) => {
    // api call (src.latitude, src.logitude, dest.latitude, dest.longitude)
    // evt.clickOnLayer = true;
    // `https://api.mapbox.com/directions/v5/mapbox/driving/${src.longitude},${src.latitude};${dest.longitude},${dest.latitude}?geometries=geojson&access_token=${TOKEN}`
    setPoints([]);
    axios
      .post("http://localhost:3000/getpath", {
        start_la: src.latitude,
        start_lo: src.longitude,
        end_la: dest.latitude,
        end_lo: dest.longitude,
      })
      .then((response) => {
        // path coordinates returned from api
        console.log(response.data);
        setPoints(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <MapGL
        {...viewport}
        // transitionInterpolator={new FlyToInterpolator({ speed: 4 })}
        // transitionDuration="auto"
        mapboxApiAccessToken={TOKEN}
        mapStyle="mapbox://styles/b30wulffz/ckpa6spae3ih118qtqiqyrfjb"
        onViewportChange={_onViewportChange}
        maxZoom={20}
        style={{ position: "relative" }}
        onClick={(e) => {
          getCoordinates(e);
        }}
        ref={mapRef}
        className="map"
      >
        <div className="title-container">
          <div className="title">CoviSecure </div>
          <div className="subtitle">
            Select a location and generate the safest path
          </div>
        </div>
        <PolyLineOverlay points={points} />
        <GeolocateControl
          style={{
            float: "left",
            margin: "20px",
          }}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <div style={{ position: "absolute", right: 0, margin: "20px 50px" }}>
          <NavigationControl showCompass={false} />
        </div>
        {data && (
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
        {src.latitude ? (
          <Marker
            latitude={src.latitude}
            longitude={src.longitude}
            offsetLeft={-8}
            offsetTop={-8}
          >
            <div className="src-marker" />
          </Marker>
        ) : null}
        {dest.latitude ? (
          <Marker
            latitude={dest.latitude}
            longitude={dest.longitude}
            offsetLeft={-8}
            offsetTop={-8}
          >
            <div className="dest-marker" />
          </Marker>
        ) : null}
      </MapGL>
      <div className="search-button" onClick={(e) => getSafePath(e)}>
        Get Safe Route
      </div>
    </>
  );
};

export default Home;

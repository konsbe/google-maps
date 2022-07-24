import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
  Polygon,
} from "@react-google-maps/api";
import { useRef, useState } from "react";

const center = { lat: 48.8584, lng: 2.2945 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [path, setPath] = useState([
    { lat: 39.60313201801296, lng: 2.657888106161492 },
    { lat: 43.274789776329186, lng: 5.404470016122906 },
    { lat: 38.010862321844094, lng: 12.501637671463197 },
  ]);
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedMarker, setSelectedMarker] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  const onEdit = React.useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);
  const onLoad = React.useCallback(
    (polygon) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEdit),
        path.addListener("insert_at", onEdit),
        path.addListener("remove_at", onEdit)
      );
    },
    [onEdit]
  );

  // Clean up refs
  const onUnmount = React.useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);

  if (!isLoaded) {
    return <SkeletonText />;
  }
  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }
  const google = window.google;
  const locations = [
    {
      center: { lat: 37.98381, lng: 23.727539 },
      label: "Athens",
      description: "Down town",
      icon: {
        url: "/temple.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lng: 21.101621727218713, lat: 38.348038777977116 },
      label: "NO WHERE",
      description: "KiteSurfing in The midle of Nowhere",
      icon: {
        url: "/kite.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 38.33961733175312, lng: 21.849048153815723 },
      label: "Kitesurf",
      description: "KiteSurfing in Drepano",
      icon: {
        url: "/kite.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 37.038388552278946, lng: 25.10538126239318 },
      label: "Paros",
      description: "KiteSurfing in Paros",
      icon: {
        url: "/kite.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 35.8828120698457, lng: 27.759616033718867 },
      label: "Kitesurf",
      description: "KiteSurfing in Prasonisi",
      icon: {
        url: "/kite.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 36.00858842593921, lng: -5.6065255744128875 },
      label: "Kitesurf",
      description: "KiteSurfing in Tarifa",
      icon: {
        url: "/kite.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 50.08029942598413, lng: 14.434032758775926 },
      label: "Prague",
      description: "Chilling DownTown",
      icon: {
        url: "/temple.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 48.86739277051393, lng: 2.783625174369861 },
      label: "Disneyland",
      description: "Play with Mki",
      icon: {
        url: "/temple.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
    {
      center: { lat: 40.80526719492199, lng: 14.410203444054819 },
      label: "Vesuvio",
      description: "Beautifull  town of  Prasonisi",
      icon: {
        url: "/temple.svg",
        scaledSize: new window.google.maps.Size(40, 40),
        labelOrigin: new window.google.maps.Point(25, 50),
      },
    },
  ];

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      h="100vh"
      w="100vw"
    >
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <div>
            {selectedCenter && (
              <InfoWindow
                onCloseClick={() => {
                  setSelectedCenter("");
                }}
                position={selectedCenter}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <h3>Title: Title {selectedMarker.label}</h3>
                  <span>Description: {selectedMarker.description}</span>
                </div>
              </InfoWindow>
            )}
            {locations.map((location, index) => {
              return (
                <Marker
                  key={index}
                  position={location.center}
                  label={{
                    text: location.label,
                    color: "red",
                    margin: "10rem",
                  }}
                  icon={location.icon}
                  onClick={() => {
                    setSelectedCenter(location.center);
                    setSelectedMarker({
                      center: location.center,
                      label: location.label,
                      description: location.description,
                    });
                  }}
                />
              );
            })}
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </div>
          <Polygon
            // Make the Polygon editable / draggable
            editable
            draggable
            path={path}
            // Event used when manipulating and adding points
            onMouseUp={onEdit}
            // Event used when dragging the whole Polygon
            onDragEnd={onEdit}
            onLoad={onLoad}
            onUnmount={onUnmount}
          />
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius="lg"
        m={4}
        bgColor="white"
        shadow="base"
        minW="container.md"
        zIndex="1"
      >
        <HStack spacing={2} justifyContent="space-between">
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent="space-between">
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </HStack>
      </Box>
    </Flex>
  );
}

export default App;

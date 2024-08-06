"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createSignal, onMount, Show } from "solid-js";
import { createGeolocationWatcher } from "@solid-primitives/geolocation";
import { addPoint, updatePointLocation } from "~/api/server";

let map: L.Map;
let currentLocationMarker: L.Marker;

function buildMap(div: HTMLDivElement) {
  console.log("building map");
  let lcInitLat = 51.505;
  let lcInitLon = -0.09;

  map = L.map(div).setView([lcInitLat, lcInitLon], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const uni = 1234;

  currentLocationMarker = L.marker([lcInitLat, lcInitLon], { draggable: true })
    .addTo(map)
    .bindPopup(
      `<p class='help is-warning'>your current position is not loaded yet</p>
      <ul>
          <li>latitude: ${lcInitLat} </li>
          <li>longitude: ${lcInitLon} </li>
        </ul>
        `
    )
    .openPopup();
}

function addMarker(
  lat: number,
  lon: number,
  markerPointId: number,
  markerName: string,
  markerType: string
) {
  const marker = L.marker([lat, lon], { draggable: true })
    .addTo(map)
    .bindPopup(
      `${markerName} (${markerType})
      <ul>
        <li>latitude: ${lat} </li>
        <li>longitude: ${lon} </li>
      </ul>
  `
    )
    .openPopup();
  marker.on("dragend", function (event: any) {
    var latlng = event.target.getLatLng();
    console.log(
      "marker dragend will try to update marker point location data",
      markerPointId,
      markerName,
      markerType,
      latlng.lat,
      latlng.lng
    );
    updatePointLocation(markerPointId, latlng.lat, latlng.lng)
      .then((res) => console.log("res", res))
      .catch((err) => console.log("err", err));
  });
}

function addMarkersToMap(
  markers: {
    type: string;
    location: string;
    name: string;
    id: number;
    courseId: number | null;
  }[]
) {
  markers.forEach((m) => {
    const ll = JSON.parse(m.location);
    const { lat, lon } = ll;
    addMarker(lat, lon, m.id, m.name, m.type);
  });
}

function CoursePointsMap(
  props: { markers: any | undefined; courseId: number | undefined } | undefined
) {
  const watcher = createGeolocationWatcher(true);
  if (watcher.error) {
    console.log("watcher error!", watcher.error);
  }

  let mapDiv: any;
  onMount(async () => {
    buildMap(mapDiv);
    addMarkersToMap(props?.markers);
    setTimeout(centerMapHandler, 100);
  });

  const centerMapHandler = () => {
    if (watcher.error) {
      console.log("centerMapHandler watcher error", watcher.error);

      currentLocationMarker
        .bindPopup(
          `<p class='help is-danger'>Your current position is not enabled!</p>
           <p class='help is-danger'>${watcher.error.message}</p>
          `
        )
        .openPopup();
      return;
    }
    if (!watcher.location?.latitude || !watcher.location?.longitude) {
      return;
    }
    map.panTo(
      new L.LatLng(watcher.location!.latitude, watcher.location!.longitude)
    );

    currentLocationMarker
      .setLatLng(
        new L.LatLng(watcher.location!.latitude, watcher.location!.longitude)
      )
      .bindPopup(
        `your current position
      <ul>
          <li>latitude: ${watcher.location?.latitude} </li>
          <li>longitude: ${watcher.location?.longitude} </li>
        </ul>
        `
      )
      .openPopup();

    console.log(
      "centerMapHandler panning map to watcher.location",
      watcher.location!.latitude,
      watcher.location!.longitude
    );
  };
  const [showAddPoint, setShowAddPoint] = createSignal(false);

  const [pointName, setPointName] = createSignal("");
  const [pointType, setPointType] = createSignal("");

  const handleAddNewPoint = () => {
    const fd = new FormData();
    fd.append("name", pointName());
    fd.append("type", pointType());
    fd.append(
      "location",
      `{"lat": ${watcher.location!.latitude}, "lon": ${
        watcher.location!.longitude
      }}`
    );

    let markerPointId: number | bigint = 0;
    addPoint(props?.courseId, fd)
      .then((res) => {
        console.log("res", res);
        markerPointId = res;
      })
      .catch((err) => console.log("err", err));

    console.log("handleAddNewPoint", pointType(), pointName());
    addMarker(
      watcher.location!.latitude,
      watcher.location!.longitude,
      markerPointId,
      pointName(),
      pointType()
    );

    setPointName("");
    setPointType("");
    setShowAddPoint(false);
  };

  return (
    <>
      <div>
        <button class="button" onclick={centerMapHandler}>
          center map by location
        </button>
        <button class="button" onClick={() => setShowAddPoint(true)}>
          new point
        </button>
      </div>
      <Show when={showAddPoint()}>
        <div>
          <div class="field">
            <label class="label">Point Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                name="name"
                onChange={(e) => {
                  setPointName(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="field">
            <div class="select is-normal">
              <select
                name="type"
                onChange={(e) => {
                  setPointType(e.target.value);
                }}
                value={pointType()}
              >
                <option value="teepad">Teepad</option>
                <option value="basket">Basket</option>
                <option value="ob-point">OB point</option>
                <option value="water-point">Water point</option>
              </select>
            </div>
          </div>
          <div>
            <button name="new" onclick={handleAddNewPoint} class="button">
              save point
            </button>
          </div>
        </div>
      </Show>
      <div ref={mapDiv} id="main-map" />
    </>
  );
}

export default CoursePointsMap;

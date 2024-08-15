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

  const currentIcon = L.icon({
    iconUrl: "/icon-marker-trasp.png",
    shadowUrl: undefined,
    iconSize: [50, 50],
    iconAnchor: [25, 49],
    popupAnchor: [0, -45],
  });

  currentLocationMarker = L.marker([lcInitLat, lcInitLon], {
    draggable: true,
    icon: currentIcon,
  })
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
  const blackIcon = L.icon({
    iconUrl: "/icon-marker-black.png",
    shadowUrl: undefined,
    iconSize: [50, 50],
    iconAnchor: [25, 49],
    popupAnchor: [0, -45],
  });

  const marker = L.marker([lat, lon], { draggable: true, icon: blackIcon })
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
  props:
    | {
        markers: any | undefined;
        courseId: number | undefined;
        userId: number | undefined;
      }
    | undefined
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
      <div class="is-inline">
        <button
          class="button mr-2"
          onclick={centerMapHandler}
          title="center map by location"
        >
          center
        </button>
        <Show when={props?.userId !== undefined}>
          <button
            class="button mr-2"
            onClick={() => setShowAddPoint(true)}
            title="add new point"
          >
            new
          </button>
        </Show>
      </div>
      <Show when={showAddPoint()}>
        <div class="modal is-active">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">add new point</p>
              <button
                class="delete"
                aria-label="close"
                onclick={() => setShowAddPoint(false)}
              ></button>
            </header>
            <section class="modal-card-body">
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
              </div>
            </section>
            <footer class="modal-card-foot">
              <div class="buttons">
                <button
                  name="new"
                  onclick={() => handleAddNewPoint()}
                  class="button"
                >
                  add new point
                </button>
                <button class="button" onclick={() => setShowAddPoint(false)}>
                  cancel
                </button>
              </div>
            </footer>
          </div>
        </div>
      </Show>
      <div ref={mapDiv} id="main-map" class="mt-3"></div>
    </>
  );
}

export default CoursePointsMap;

const center = [-73.9878967, 40.748169];
mapboxgl.accessToken = 'SET MAPBOX ACCESS TOKEN';
const stopsURL = `http://localhost:3000/stops?lat=${center[1]}&lon=${center[0]}`;
const stopInfoURL = (code) => `http://localhost:3000/stop/${code}`;
var busInterval = 0;
// This is the map instance
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/navigation-day-v1',
  center,
  zoom: 15,
});
let busesMarkers = [];
let selectedStopHTML;

const init = async () => {
  const {
    code,
    data: { list },
  } = await makeRequest(stopsURL);
  if (code === 200) {
    showStops(list);
  }
};

const showStops = async (list) => {
  for (let item of list) {
    const stopHTML = `<h2>${item.name}</h2>Direction: ${item.direction}<br/>Incomming buses:<span id="incommingBuses"></span>`;
    const el = document.createElement('div');
    el.className = 'bus-stop-marker';
    const marker = new mapboxgl.Marker(el).setLngLat([item.lon, item.lat]).addTo(map);
    marker.getElement().addEventListener('click', async (el) => {
      if (selectedStopHTML !== undefined) {
        selectedStopHTML.classList.remove('selected-bus-stop-marker');
        selectedStopHTML.classList.add('bus-stop-marker');
      }
      selectedStopHTML = el.target;
      selectedStopHTML.classList.add('selected-bus-stop-marker');
      selectedStopHTML.classList.remove('bus-stop-marker');
      document.getElementById('selectedStop').innerHTML = stopHTML;
      clearInterval(busInterval);
      updateStop(item.code);
      busInterval = setInterval(updateStop, 10000, item.code);
    });
  }
};

const updateStop = async (code) => {
  const stopInfo = await makeRequest(stopInfoURL(code));
  buses = stopInfo.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.map(
    (msv) => msv.MonitoredVehicleJourney
  );
  document.getElementById('incommingBuses').innerHTML = buses.length;
  setBuses(buses);
};

const setBuses = async (buses) => {
  for (marker of busesMarkers) marker.remove();
  busesMarkers = [];
  for (let bus of buses) {
    const el = document.createElement('div');
    el.className = 'bus-marker';
    const marker = new mapboxgl.Marker(el)
      .setLngLat([bus.VehicleLocation.Longitude, bus.VehicleLocation.Latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${bus.DestinationName}</h3><h4>${bus.MonitoredCall.ArrivalProximityText}</h4>${
            bus.MonitoredCall.ExpectedArrivalTime && 'Arriving at: ' + bus.MonitoredCall.ExpectedArrivalTime
          }`
        )
      )
      .addTo(map);
    busesMarkers.push(marker);
  }
};

const makeRequest = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Do not edit code past this point
if (typeof module !== 'undefined') {
  module.exports = { init, showStops };
}

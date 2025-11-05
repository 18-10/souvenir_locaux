async function getCoordinates(city) {
  const apiKey = "AIzaSyDO97DkNg_sloX8CXrzthhhMTgtob60df8";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.results && data.results[0]) {
    return data.results[0].geometry.location;
  }
  throw new Error("Ville introuvable");
}

async function getPlaces(lat, lng) {
  const apiKey = "AIzaSyDO97DkNg_sloX8CXrzthhhMTgtob60df8";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.slice(0, 10);
}

async function searchCity() {
  const city = document.getElementById("cityInput").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "🔍 Recherche en cours...";

  try {
    const coords = await getCoordinates(city);
    const places = await getPlaces(coords.lat, coords.lng);

    resultsDiv.innerHTML = `
      <h2>🗺️ Lieux recommandés près de ${city}</h2>
      <ul>
        ${places
          .map(
            (p) => `
          <li>
            <strong>${p.name}</strong><br>
            Note : ${p.rating || "N/A"} ⭐<br>
            ${p.vicinity || ""}
          </li>`
          )
          .join("")}
      </ul>`;
  } catch (error) {
    resultsDiv.innerHTML = "❌ Erreur : " + error.message;
  }
}

function initMap() {
  console.log("Google Maps chargé avec succès");
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("searchBtn")
    .addEventListener("click", searchCity);
});

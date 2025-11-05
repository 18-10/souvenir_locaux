function initApp() {
  console.log("✅ Google Maps SDK chargé");

  const form = document.getElementById("city-form");
  const resultsDiv = document.getElementById("results");

  if (!form) {
    console.error("❌ Formulaire non trouvé");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value.trim();
    if (!city) return;
    console.log("🔎 Recherche pour :", city);
    searchPlaces(city);
  });

  function searchPlaces(city) {
    const query = `souvenirs artisanat spécialités ${city}`;
    const apiKey = "AIzaSyDRyW3FsIM3VJJmREadSY6kciBqYcQov9w";
    const url = `https://places.googleapis.com/v1/places:searchText`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.location",
      },
      body: JSON.stringify({ textQuery: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📍 Résultats API :", data);

        if (!data.places || data.places.length === 0) {
          resultsDiv.innerHTML = "<p>Aucun résultat trouvé pour cette ville.</p>";
          return;
        }

        const html = data.places
          .slice(0, 10)
          .map(
            (p) => `
              <div class="result-card">
                <strong>${p.displayName?.text || "Nom inconnu"}</strong><br>
                ${p.formattedAddress || ""}
                ${
                  p.rating
                    ? `<br>⭐ ${p.rating}/5 (${p.userRatingCount || 0} avis)`
                    : ""
                }
                ${
                  p.websiteUri
                    ? `<br><a href="${p.websiteUri}" target="_blank">🔗 Voir le site</a>`
                    : ""
                }
                ${
                  p.location
                    ? `<div class="map" id="map-${p.displayName?.text
                        ?.replace(/\s/g, "-")
                        .toLowerCase()}"></div>`
                    : ""
                }
              </div>`
          )
          .join("");

        resultsDiv.innerHTML = `<h3>Résultats pour ${city}</h3>${html}`;

        // Affiche les mini-cartes
        data.places.slice(0, 5).forEach((p, i) => {
          if (p.location) {
            const mapDiv = document.getElementById(
              `map-${p.displayName?.text?.replace(/\s/g, "-").toLowerCase()}`
            );
            if (mapDiv) {
              const map = new google.maps.Map(mapDiv, {
                center: {
                  lat: p.location.latitude,
                  lng: p.location.longitude,
                },
                zoom: 14,
              });
              new google.maps.Marker({
                position: {
                  lat: p.location.latitude,
                  lng: p.location.longitude,
                },
                map: map,
              });
            }
          }
        });
      })
      .catch((err) => {
        console.error("Erreur API Google Places :", err);
        resultsDiv.innerHTML =
          "<p>Une erreur est survenue lors de la recherche. Vérifiez la console.</p>";
      });
  }
}

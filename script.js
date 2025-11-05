function initApp() {
  console.log("✅ Google Maps SDK chargé");

  const form = document.getElementById("city-form");
  const resultsDiv = document.getElementById("results");

  if (!form) {
    console.error("❌ Formulaire non trouvé dans le DOM.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value.trim();
    console.log("🔎 Recherche pour :", city);
    if (!city) return;
    searchPlaces(city);
  });

  function searchPlaces(city) {
    const service = new google.maps.places.PlacesService(document.createElement("div"));
    const request = {
      query: `spécialités locales artisanat souvenir ${city}`,
      region: "fr",
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const html = results
          .slice(0, 10)
          .map(
            (r) => `
              <div style="margin-bottom:10px;padding:10px;border:1px solid #ccc;border-radius:8px;">
                <strong>${r.name}</strong><br>
                ${r.formatted_address || ""}
                ${r.rating ? `<br>⭐ ${r.rating} / 5` : ""}
                ${r.user_ratings_total ? ` (${r.user_ratings_total} avis)` : ""}
              </div>`
          )
          .join("");
        resultsDiv.innerHTML = `<h3>Résultats pour ${city}</h3>${html}`;
      } else {
        resultsDiv.innerHTML = "Aucun résultat trouvé pour cette ville.";
      }
    });
  }
}

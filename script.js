async function chargerDonnees() {
  const response = await fetch('data.json');
  const data = await response.json();
  return data;
}

document.getElementById('searchForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const recherche = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultatsDiv = document.getElementById('results');
  resultatsDiv.innerHTML = "<p>🔍 Recherche en cours...</p>";

  const data = await chargerDonnees();
  const region = Object.keys(data).find(ville => recherche.includes(ville));

  if (!region) {
    resultatsDiv.innerHTML = "<p>Aucune information trouvée pour cette localité.</p>";
    return;
  }

  const infos = data[region];
  let html = `<h2>🎁 Idées cadeaux à rapporter de ${region.charAt(0).toUpperCase() + region.slice(1)}</h2>`;

  infos.souvenirs.forEach(souvenir => {
    html += `
      <div class="souvenir">
        <h3>${souvenir.nom}</h3>
        <p>${souvenir.description}</p>
        <ul>
          ${souvenir.lieux.map(lieu => `
            <li>
              <strong>${lieu.nom}</strong> — ⭐ ${lieu.note}<br>
              ${lieu.adresse}<br>
              <a href="${lieu.maps}" target="_blank">Voir sur Google Maps</a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  resultatsDiv.innerHTML = html;
});
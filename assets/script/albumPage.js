// Ottieni i parametri dall'URL
const token = "e85f7e1b6amsh3a1e91a6c83fe6ep14f6a0jsn1120c9a61274";
const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get("id"); // Assicurati che il parametro sia 'id'
console.log("ID dell'album:", albumId);

if (albumId) {
  fetchAlbumDetails(albumId); // Chiama la funzione solo se esiste l'ID dell'album
} else {
  console.error("ID dell'album non trovato nell'URL");
}

// Costruisci l'URL API utilizzando l'ID dell'album
const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/album/${playlistId}`;
console.log("URL API:", apiUrl);

// Imposta le opzioni per la richiesta fetch, inclusi i parametri dell'intestazione
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": token, // Sostituisci con la tua chiave API
    "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

fetch(apiUrl, options)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Errore API: ${response.status}`);
    }
    return response.json(); // Converti la risposta in formato JSON
  })
  .then((data) => {
    console.log("Dati dell'album ricevuti:", data);
    populateAlbumDetails(data); // Popola i dettagli dell'album con i dati ricevuti
  })
  .catch((error) => {
    console.error("Errore nella richiesta:", error); // Gestisci eventuali errori
  });

// Funzione per popolare i dettagli dell'album sulla pagina
function populateAlbumDetails(album) {
  console.log("Popolamento dettagli dell'album");

  // Imposta la copertina dell'album
  document.getElementById("album-cover").src = album.cover_medium;
  // Imposta il titolo dell'album
  document.getElementById("album-title").textContent = album.title;
  // Imposta il nome dell'artista
  document.getElementById("album-artist").textContent = album.artist.name;
  // Imposta la data di rilascio dell'album
  document.getElementById("album-release-date").textContent = album.release_date;
  // Imposta il numero di tracce dell'album
  document.getElementById("album-track-count").textContent = `${album.nb_tracks} brani`;

  // Seleziona il contenitore della tracklist e svuotalo
  const trackListContainer = document.getElementById("track-list");
  trackListContainer.innerHTML = ""; // Pulisci la tracklist esistente

  console.log("Popolamento tracklist");

  // Itera attraverso le tracce dell'album e crea righe per ciascuna traccia
  album.tracks.data.forEach((track, index) => {
    const trackRow = document.createElement("div");
    trackRow.classList.add("row", "mb-2");

    trackRow.innerHTML = `
      <div class="col-1">${index + 1}</div>
      <div class="col-5">
        <a href="#" class="text-decoration-none">${track.title}</a>
      </div>
      <div class="col-3">
        <a href="#" class="text-decoration-none">${album.artist.name}</a>
      </div>
      <div class="col-2">${track.rank}</div>
      <div class="col-1">${(track.duration / 60).toFixed(2)}</div>
    `;

    trackListContainer.appendChild(trackRow);
  });

  console.log("Dettagli dell'album e tracklist popolati con successo");
}

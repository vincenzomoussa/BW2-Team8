// Quando il contenuto della pagina è completamente caricato, esegui questa funzione
document.addEventListener("DOMContentLoaded", function () {
  console.log("Pagina caricata");

  // Ottieni i parametri dall'URL
  const urlParams = new URLSearchParams(window.location.search);
  // Estrarre l'ID dell'album dai parametri dell'URL
  const albumId = urlParams.get("id");
  console.log("ID dell'album:", albumId);

  // Se l'ID dell'album è presente, chiama la funzione per ottenere i dettagli dell'album
  if (albumId) {
    fetchAlbumDetails(albumId);
  } else {
    console.error("ID dell'album non trovato nell'URL");
  }
});

// Funzione per ottenere i dettagli dell'album dall'API
function fetchAlbumDetails(albumId) {
  console.log("Richiesta dettagli album per ID:", albumId);

  // Costruisci l'URL API utilizzando l'ID dell'album
  const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;
  console.log("URL API:", apiUrl);

  // Imposta le opzioni per la richiesta fetch, inclusi i parametri dell'intestazione
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "e85f7e1b6amsh3a1e91a6c83fe6ep14f6a0jsn1120c9a61274",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  // Esegui la richiesta fetch all'API
  fetch(apiUrl, options)
    .then((response) => response.json()) // Converti la risposta in formato JSON
    .then((data) => {
      console.log("Dati dell'album ricevuti:", data);
      populateAlbumDetails(data); // Popola i dettagli dell'album con i dati ricevuti
    })
    .catch((error) => console.error("Errore nella richiesta:", error)); // Gestisci eventuali errori
}

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
  document.getElementById("album-track-count").textContent = album.nb_tracks;

  // Seleziona il contenitore della tracklist e svuotalo
  const trackListContainer = document.querySelector(".container.mt-5 .row.mb-3").nextElementSibling;
  trackListContainer.innerHTML = ""; // Pulisci la tracklist esistente

  console.log("Popolamento tracklist");

  // Itera attraverso le tracce dell'album e crea righe per ciascuna traccia
  album.tracks.data.forEach((track, index) => {
    // Crea un nuovo elemento div per la riga della traccia
    const trackRow = document.createElement("div");
    trackRow.classList.add("row", "mb-2");

    // Imposta il contenuto HTML della riga della traccia
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

    // Aggiungi la nuova riga della traccia al contenitore della tracklist
    trackListContainer.appendChild(trackRow);
  });

  console.log("Dettagli dell'album e tracklist popolati con successo");
}

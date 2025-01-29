const url = "deezerdevs-deezer.p.rapidapi.com";
const token = "e85f7e1b6amsh3a1e91a6c83fe6ep14f6a0jsn1120c9a61274";

// Funzione per ottenere tutti gli album
function fetchAllAlbums() {
  const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/search?q=album`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": token,
      "x-rapidapi-host": url,
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Tutti gli album ricevuti:", data);
      const albumList = document.getElementById("album-list");
      albumList.innerHTML = ""; // Pulisci la lista esistente

      data.data.forEach((album) => {
        const albumRow = document.createElement("div");
        albumRow.classList.add("row", "mb-2");

        albumRow.innerHTML = `
          <div class="col-2">
            <img src="${album.album.cover_medium}" alt="${album.album.title}" class="img-fluid">
          </div>
          <div class="col-8">
            <h3>${album.album.title}</h3>
            <p>${album.artist.name}</p>
          </div>
          <div class="col-2">
            <button class="btn btn-primary" onclick="fetchAlbumDetails(${album.album.id})">Vedi Dettagli</button>
          </div>
        `;

        albumList.appendChild(albumRow);
      });
    })
    .catch((error) => {
      console.error("Errore nella richiesta:", error);
    });
}

// Funzione per ottenere i dettagli di un singolo album dall'API
function fetchAlbumDetails(albumId) {
  const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/album/${albumId}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": token,
      "x-rapidapi-host": url,
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Dati dell'album ricevuti:", data);
      populateAlbumDetails(data);
    })
    .catch((error) => {
      console.error("Errore nella richiesta:", error);
    });
}

// Funzione per popolare i dettagli dell'album sulla pagina
function populateAlbumDetails(album) {
  console.log("Popolamento dettagli dell'album");

  const albumDetails = `
    <div class="row">
      <div class="col-md-4">
        <img src="${album.cover_medium}" alt="${album.title}" class="img-fluid">
      </div>
      <div class="col-md-8">
        <h1>${album.title}</h1>
        <p>${album.artist.name}</p>
        <p>Data di rilascio: ${album.release_date}</p>
        <p>${album.nb_tracks} brani</p>
        <h3>Tracklist</h3>
        <div id="track-list"></div>
      </div>
    </div>
  `;

  const albumList = document.getElementById("album-list");
  albumList.innerHTML = albumDetails; // Sostituisci con i dettagli dell'album

  const trackListContainer = document.getElementById("track-list");
  trackListContainer.innerHTML = ""; // Pulisci la tracklist esistente

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

// Chiama la funzione per ottenere tutti gli album quando la pagina viene caricata
document.addEventListener("DOMContentLoaded", function () {
  fetchAllAlbums();
});

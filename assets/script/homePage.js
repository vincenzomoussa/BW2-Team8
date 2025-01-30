const playlistId = "3155776842"; // Sostituisci con un ID playlist valido
const carouselItems = document.getElementById("carousel-items");
const errorMessageElement = document.getElementById("error-message");

const url = "deezerdevs-deezer.p.rapidapi.com";
const token = "e85f7e1b6amsh3a1e91a6c83fe6ep14f6a0jsn1120c9a61274";

// Funzione per ottenere tutte le playlist
function fetchAllPlaylists() {
  const apiUrl = `https://deezerdevs-deezer.p.rapidapi.com/search?q=playlist`;
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
      console.log("Tutte le playlist ricevute:", data);
      const playlistList = document.getElementById("playlist-list");
      playlistList.innerHTML = ""; // Pulisci la lista esistente

      data.data.forEach((playlist) => {
        const playlistRow = document.createElement("div");
        playlistRow.classList.add("col-12");

        playlistRow.innerHTML = `
          <a href="#" class="playlist-link fs-5 text-dark">${playlist.title}</a>
        `;

        playlistList.appendChild(playlistRow);
      });
    })
    .catch((error) => {
      showError("Si è verificato un errore nel caricare le playlist.");
      console.error("Errore nella richiesta:", error);
    });
}

// Funzione per ottenere i brani di una playlist
function fetchPlaylistTracks() {
  fetch(`https://deezerdevs-deezer.p.rapidapi.com/playlist/${playlistId}`, {
    headers: {
      "X-RapidAPI-Key": token,
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore API: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const tracks = data.tracks.data;
      carouselItems.innerHTML = "";

      // Raggruppa i brani in set di 4
      for (let i = 0; i < tracks.length; i += 4) {
        const trackGroup = tracks.slice(i, i + 4);
        const item = document.createElement("div");
        item.classList.add("carousel-item");
        if (i === 0) item.classList.add("active");

        const row = document.createElement("div");
        row.classList.add("row", "gx-3");

        trackGroup.forEach((track) => {
          const col = document.createElement("div");
          col.classList.add("col-md-3");

          col.innerHTML = `
          <div class="product-card text-white h-100 p-2 rounded">
             <img src="${track.album.cover}" class="card-img-top" alt="${track.title}">
             <div class="product-card-body mt-2">
               <h5 class="product-title">${track.album.title}</h5>
               <p class="artist-name">Artista: ${track.artist.name}</p>
             </div>
           </div>
       `;
          row.appendChild(col);
        });

        item.appendChild(row);
        carouselItems.appendChild(item);
      }
    })
    .catch((error) => {
      showError("Errore durante il recupero dei brani.");
      console.error(error);
    });
}

// Funzione per mostrare errori
function showError(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove("d-none");
  setTimeout(() => {
    errorMessageElement.classList.add("d-none");
  }, 5000);
}

// Chiama le funzioni per ottenere playlist e brani quando la pagina viene caricata
document.addEventListener("DOMContentLoaded", function () {
  fetchAllPlaylists();
  fetchPlaylistTracks();
});

const token = "9db9d09e3amshfadb6a696215d2bp15a0a3jsna579b87fdc3a";
const playlistId = "3155776842"; // Sostituisci con un ID playlist valido
const carouselItems = document.getElementById("carousel-items");
const errorMessageElement = document.getElementById("error-message");

function showError(message) {
  errorMessageElement.textContent = message;
  errorMessageElement.classList.remove("d-none");
  setTimeout(() => {
    errorMessageElement.classList.add("d-none");
  }, 5000);
}

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
             <div class="product-card bg-dark text-white h-100 p-2 rounded">
      <img src="${track.album.cover}" class="card-img-top" alt="${track.title}">
      <div class="product-card-body mt-2">
        <h5 class="product-title">${track.title}</h5>
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

fetchPlaylistTracks();

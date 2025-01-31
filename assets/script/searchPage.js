const inputSearchBar = document.getElementById("inputSearchBar");
const braniList = document.getElementById("braniList");
const sfoglia = document.querySelector(".sfoglia");
const braniCercati = document.querySelector(".ricerca.text-white");
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
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
          <a style="text-decoration:none; href="#" id="playlist-link ">${playlist.title}</a>
        `;

        playlistList.appendChild(playlistRow);
      });
    })
    .catch((error) => {
      showError("Si è verificato un errore nel caricare le playlist.");
      console.error("Errore nella richiesta:", error);
    });
}
document.addEventListener("DOMContentLoaded", function () {
  fetchAllPlaylists();
  fetchPlaylistTracks();
});
const barMusicinfo = function () {
  let oggArtistaStorage = JSON.parse(localStorage.getItem("oggArtista"));

  if (oggArtistaStorage) {
    audio.src = oggArtistaStorage.preview;
    imgBarMusic.src = oggArtistaStorage.imgAlbum;
    titoloCanzoneBarMusic.innerText = oggArtistaStorage.titolo;
    nomeArtistaBarMusic.innerHTML = oggArtistaStorage.nomeArtista;
    nomeArtistaBarMusic.addEventListener("click", function () {
      window.location.href = `./artistPage.html?id=${oggArtistaStorage.idArtista}`;
    });
  } else {
    audio.src = "https://cdn-preview-a.dzcdn.net/stream/c-a97dcc722aae5375f05d9a74f9d69a76-3.mp3";
  }
};

inputSearchBar.addEventListener(
  "input",
  debounce((e) => {
    const query = inputSearchBar.value;
    if (inputSearchBar.value === "") {
      console.log(inputSearchBar.value, "dentro il primo if");
      sfoglia.classList.remove("d-none");
      braniCercati.classList.add("d-none");
    } else {
      console.log(inputSearchBar.value, "dentro la seconda if");
      fetch(`https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`)
        .then((response) => {
          if (response) {
            return response.json();
          } else {
            throw new Error("richiesta non andata a buon fine!");
          }
        })
        .then((ogg) => {
          console.log("dentro al then");
          sfoglia.classList.add("d-none");
          braniCercati.classList.remove("d-none");
          braniList.innerHTML = "";
          ogg.data.forEach((song) => {
            let durata = convertSecondsSearch(song.duration);
            const li = document.createElement("li");
            li.classList.add("d-flex", "justify-content-between", "w-100", "align-items-center", "mb-3", "p-2");
            li.innerHTML = `
        <div>
              <img src="${song.album.cover_xl}" width="45px" />
              <div class="d-inline-block align-middle ps-3">
                <p class="mb-0 cursor-pointer" onclick="goToAlbum(${song.album.id})" >${song.title_short}</p>
                <p class="mb-0 cursor-pointer" onclick="goToArtist(${song.album.id})">${song.artist.name}</p>
              </div>
            </div>
            <p class="mb-0">${durata}</p>
        `;
            braniList.appendChild(li);
          });
        })
        .catch((err) => {
          console.log("errore", err);
        });
    }
  }, 300)
);

function convertSecondsSearch(seconds) {
  const minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds.toString()}`;
  }

  return `${minutes} : ${remainingSeconds}`;
}

function goToAlbum(id) {
  window.location.href = `./albumPage.html?id=${id} `;
}
function goToArtist(id) {
  window.location.href = `./artistPage.html?id=${id} `;
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

const getInfoCantante = function (idAlbum, index) {
  let apiCantante = ` https://striveschool-api.herokuapp.com/api/deezer/album/${idAlbum}`;
  fetch(apiCantante)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("LA RISPOSTA DEL SERVER NON è OK");
      }
    })
    .then((album) => {
      let titolo = "";
      let img = "";
      console.log(album);

      titolo = album.title;
      img = album.cover_medium;
      let id = album.id;
      idAlbum = id;

      console.log(id);

      stampaAlbum(titolo, index, img, id);
    })
    .catch((error) => {
      console.log("errore", error);
    });
};

let playListCard = document.querySelectorAll(".playlist-card");
console.log(playListCard);

const stampaAlbum = function (titolo, index, img, id) {
  playListCard[index].innerHTML = ` 
  <p class="playlist-name">${titolo}</p>
  <img src=${img} alt="Playlist Cover" class="playlist-cover1" />
  `;

  playListCard[index].addEventListener("click", function () {
    window.location.href = `./albumPage.html?id=${id} `;
  });
};

getInfoCantante("103248", 0); //103248

getInfoCantante("75621062", 1); //15116337

getInfoCantante("107540", 2); //1075407

getInfoCantante("11375450", 3); //11375450

getInfoCantante("74434962", 4); //74434962

getInfoCantante("523974", 5); //523909312

getInfoCantante("103248", 6); //103248

getInfoCantante("75621062", 7); //15116337

getInfoCantante("107540", 8); //1075407

getInfoCantante("11375450", 9); //11375450

getInfoCantante("74434962", 10); //74434962

getInfoCantante("523974", 11); //523909312

getInfoCantante("107540", 12); //1075407

getInfoCantante("11375450", 13); //11375450

getInfoCantante("74434962", 14); //74434962

getInfoCantante("523974", 15); //523909312

//funzione per mettere like
function getLike(heartElementId) {
  const heartElement = document.getElementById(heartElementId);

  if (heartElement) {
    heartElement.addEventListener("click", function () {
      const heartIcon = this.querySelector("ion-icon");
      console.log("Icon clicked");
      if (heartIcon.getAttribute("name") === "heart-outline") {
        console.log("Changing to heart");
        heartIcon.setAttribute("name", "heart");
        heartIcon.style.color = "grey";
      } else {
        console.log("Changing to heart-outline");
        heartIcon.setAttribute("name", "heart-outline");
        heartIcon.style.color = "";
      }
    });
  } else {
    console.error(`Element with id "${heartElementId}" not found.`);
  }
}

getLike("heart");

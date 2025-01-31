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
        heartIcon.style.color = "red";
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

let albumId = new URLSearchParams(location.search).get("id");
let table = document.querySelector("table");
let table2 = document.querySelector(".table2");
let main = document.querySelector("main");
let spinner = document.querySelector(".spinner");
let buttonAltro = document.getElementById("altro");
let arrayOggArtista = [];

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

const getArtistFromAlbum = function (albumId) {
  let apiAlbum = `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`;

  fetch(apiAlbum)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("LA RISPOSTA DEL SERVER NON è OK");
      }
    })
    .then((album) => {
      console.log("info album", album);

      if (album.artist && album.artist.id) {
        let artistId = album.artist.id;

        getInfoArtist(artistId);
      } else {
        console.error("ID dell'artista non trovato nell'album");
      }
    })
    .catch((error) => {
      console.log("errore", error);
    });
};

const getInfoArtist = function (artistId) {
  let apiArtist = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;

  fetch(apiArtist)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("LA RISPOSTA DEL SERVER NON è OK");
      }
    })
    .then((artist) => {
      console.log("info artista", artist);
      let trackList = artist.tracklist;
      console.log(artist.tracklist);
      fetch(trackList)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("LA RISPOSTA DEL SERVER NON è OK");
          }
        })
        .then((trackList) => {
          const heroArtist = document.querySelector(".hero-artist");
          heroArtist.style.backgroundImage = `url(${artist.picture_xl})`;
          heroArtist.style.backgroundPosition = "0 20%";
          console.log(trackList);
          let title = document.getElementById("artistTitle");
          title.innerText = artist.name;

          let fanCount = document.getElementById("fanCount");
          fanCount.innerText = ` ${artist.nb_fan} ascoltatori mensili`;

          for (let i = 0; i < trackList.data.length; i++) {
            let newRow = document.createElement("tr");
            if (i >= 6) {
              newRow.classList.add("d-none");
            }
            newRow.innerHTML = `<td class="number">${i + 1}</td>
                    <td class="artist-img">
                    <img src= ${trackList.data[i].album.cover_small} width="35px" />
                    </td>
                    <td class="song">
                    <p onclick="playMusic(${i})" class="bold cursor-pointer text-white"> ${trackList.data[i].title}</p>
                    <p class='d-none'>${trackList.data[i].rank}</p>
                  </td>
                  <td class="riproduzioni">${trackList.data[i].rank}</td>
                                    <td class="durata widthTD">${convertSeconds(trackList.data[i].duration)}</td>
                  `;

            table.appendChild(newRow);
            arrayOggArtista.push(trackList.data[i]);
          }

          let roundedImage = document.querySelector(".roundedImg");
          roundedImage.src = artist.picture_small;
          let infoNameArtist = document.getElementById("info");
          infoNameArtist.innerText = ` Di ${artist.name}`;

          main.classList.add("d-block");
          spinner.classList.add("d-none");
          let trDisplayNone = document.querySelectorAll("tr.d-none");
          console.log(trDisplayNone);

          let tableAperta = true;

          buttonAltro.addEventListener("click", function () {
            if (tableAperta) {
              trDisplayNone.forEach((tr) => {
                tr.classList.remove("d-none");
              });

              buttonAltro.innerText = "NASCONDI";
              tableAperta = false;
            } else {
              trDisplayNone.forEach((tr) => {
                tr.classList.add("d-none");
              });

              buttonAltro.innerText = "VISUALIZZA ALTRO";
              tableAperta = true;
            }
          });
        });
    })
    .catch((error) => {
      console.log("errore", error);
    });
};

const playMusic = function (i) {
  let oggArtista = {
    titolo: arrayOggArtista[i].title_short,
    imgAlbum: arrayOggArtista[i].album.cover_small,
    nomeArtista: arrayOggArtista[i].artist.name,
    idArtista: arrayOggArtista[i].album.id,
    preview: arrayOggArtista[i].preview,
  };

  localStorage.setItem("oggArtista", JSON.stringify(oggArtista));
  barMusicinfo();

  isplaying = false;
  playStop();
};

getArtistFromAlbum(albumId);

function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} : ${remainingSeconds}`;
}

function convertMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ora ${remainingMinutes} min`;
}

getLike("heart");

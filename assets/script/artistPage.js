let albumId = new URLSearchParams(location.search).get("id");
let table = document.querySelector(".table");
let spinner = document.getElementById("spinner");
let bottoneAltro = document.getElementById("altro");
let arrayArtisti = [];

const getArtistFromAlbum = function (albumId) {
  let apiAlbum = `https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`;
  fetch(apiAlbum)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("LA RISPOSTA NON E' OK");
      }
    })
    .then((album) => {
      console.log("Info album: ", album);

      if (album.artist && album.artist.id) {
        let artistId = album.artist.id;
      }
    });
};

const getInfoArtist = function (artistId) {
  let apiArtist = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`;
  fetch(apiArtist)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("LA RISPOSTA NON E' OK");
      }
    })
    .then((artist) => {
      console.log("Info artista: ", artist);
      let trackList = artist.trackList;
      console.log(trackList);
      fetch(trackList)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("LA RISPOSTA NON E' OK");
          }
        })
        .then((trackList) => {
          const heroArtist = document.querySelector(".hero-artist");
          heroArtist.style.backgroundImage = `url(${artist.picture_xl})`;
          let title = document.getElementById("artistTitle");
          title.innerText = artist.name;

          let fanCount = document.getElementById("fanCount");
          fanCount.innerText = `${artist.fans} ascoltatori mensili`;

          for (let i = 0; i < trackList.data.lenght; i++) {
            let rigaCanzone = document.createElement("tr");
            if (i >= 6) {
              rigaCanzone.classList.add("d-none");
            }
            rigaCanzone.innerHTML = `<td>${i + 1} </td>
            <td class="artist-img">
            <img src= ${trackList.data[i].album.cover_small} />
            </td>
            <td class="song">
            <p> ${trackList.data[i].title} </p>
            </td>
            <td class="riproduzioni"> ${trackList.data[i].rank} </td>
            <td class="durataCanzone"> ${convertiSecondi(trackList.data[i].duration)} </td>
            `;
            table.appendChild(rigaCanzone);
            arrayArtisti.push(trackList.data[i]);
          }
        });
    });
};

function convertiSecondi(seconds) {
  const minuti = Math.floor(seconds / 60);
}

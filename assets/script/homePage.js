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

let cantanti = "";
let idAlbum = "";

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
  <img src=${img} alt="Playlist Cover" class="playlist-cover" />
              <p class="playlist-name">${titolo}</p>`;

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

let buttonPlay = document.querySelector(".play");

const playMusicIndex = function () {
  let oggArtista = {
    titolo: "VIOLA (feat.Salmo)",
    imgAlbum: "https://e-cdns-images.dzcdn.net/images/cover/ebcd291a552cf494598b7613a878a386/500x500-000000-80-0-0.jpg",
    nomeArtista: "Fedez",
    idArtista: "3239781",
    preview: "https://cdn-preview-a.dzcdn.net/stream/c-a97dcc722aae5375f05d9a74f9d69a76-3.mp3",
  };

  localStorage.setItem("oggArtista", JSON.stringify(oggArtista));
  barMusicinfo();

  isplaying = false;
  playStop();
};

buttonPlay.addEventListener("click", function () {
  playMusicIndex();
});

getLike("heart"); //chiamo la funzione del like

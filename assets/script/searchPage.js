const inputSearchBar = document.getElementById("inputSearchBar");
const braniList = document.getElementById("braniList");
const sfoglia = document.querySelector(".sfoglia");
const braniCercati = document.querySelector(".ricerca.text-white");
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

const barMusicinfo = function () {
  let oggArtistaStorage = JSON.parse(localStorage.getItem("oggArtista"));

  if (oggArtistaStorage) {
    audio.src = oggArtistaStorage.preview;
    imgBarMusic.src = oggArtistaStorage.imgAlbum;
    titoloCanzoneBarMusic.innerText = oggArtistaStorage.titolo;
    nomeArtistaBarMusic.innerHTML = oggArtistaStorage.nomeArtista;
    nomeArtistaBarMusic.addEventListener("click", function () {
      window.location.href = `./artist.html?id=${oggArtistaStorage.idArtista}`;
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
  window.location.href = `./album.html?id=${id} `;
}
function goToArtist(id) {
  window.location.href = `./artist.html?id=${id} `;
}

function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

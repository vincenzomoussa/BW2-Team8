let id = new URLSearchParams(location.search).get("id");

let arrayCanzoni = [];

const getInfoAlbum = function (id) {
  let apiAlbum = `https://striveschool-api.herokuapp.com/api/deezer/album/${id}`;
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
      let songArray = album.tracks.data;
      console.log(songArray);

      let title = document.getElementById("title");
      title.innerText = album.title;
      let table = document.querySelector("table");
      let albumImage = document.getElementById("album-image");
      albumImage.src = album.cover_medium;
      let iconImage = document.getElementById("iconImage");
      iconImage.src = album.cover_small;
      let artistName = document.getElementById("artistName");
      artistName.innerText = album.artist.name;
      let year = document.getElementById("year");
      year.innerText = album.release_date;
      let numTracks = document.getElementById("numTracks");
      numTracks.innerText = album.nb_tracks;
      let albumDur = album.duration;
      let s = convertMinutes(albumDur);
      let totDuration = document.getElementById("totDuration");
      totDuration.innerText = s;
      let imageHero = album.cover_medium; // Ottieni l'URL dell'immagine
      document.getElementById("album-image").src = imageHero; // Imposta l'immagine nel DOM

      for (let i = 0; i < songArray.length; i++) {
        let newRow = document.createElement("tr");
        newRow.innerHTML = `<td class="c">${i + 1}</td>
                    <td class="l">
                      <p onclick="playMusic(${i})" class="bold text-white cursor-pointer">${songArray[i].title}</p>
                      <p>${songArray[i].artist.name}</p>
                    </td>
                    <td class="r">${songArray[i].rank}</td>
                    <td class="c">${convertSeconds(songArray[i].duration)}</td>`;
        table.appendChild(newRow);
        arrayCanzoni.push(songArray[i]);
      }
      // Chiamata alla funzione buildColor per elaborare l'immagine
      buildColor(imageHero);
    })
    .catch((error) => {
      console.log("errore", error);
    });
};

let artistName = document.getElementById("artistName");
artistName.addEventListener("click", function () {
  window.location.href = `./artistPage.html?id=${id}`;
});

function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} : ${remainingSeconds.toString().padStart(2, "0")}`;
}

function convertMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ora ${remainingMinutes} min`;
}

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

const playMusic = function (i) {
  let oggArtista = {
    titolo: arrayCanzoni[i].title_short,
    imgAlbum: arrayCanzoni[i].album.cover_small,
    nomeArtista: arrayCanzoni[i].artist.name,
    idArtista: arrayCanzoni[i].album.id,
    preview: arrayCanzoni[i].preview,
  };

  localStorage.setItem("oggArtista", JSON.stringify(oggArtista));
  barMusicinfo();

  isplaying = false;
  playStop();
};

const buildColor = function (imageHero) {
  // Crea un nuovo elemento immagine
  const imgElement = new Image();
  imgElement.crossOrigin = "Anonymous"; // Permetti CORS
  imgElement.src = imageHero; // Imposta la sorgente dell'immagine

  // Attendi il caricamento dell'immagine
  imgElement.onload = function () {
    console.log("Immagine caricata con successo");

    // Ottieni l'elemento canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Imposta le dimensioni del canvas in base alle dimensioni dell'immagine
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    // Disegna l'immagine sul canvas
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Ottieni i dati dell'immagine dal canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // console.log(imageData);

    // Converti i dati dell'immagine in un array RGB
    const rgbArray = buildRgb(imageData.data);
    // console.log(rgbArray);

    const quantColors = quantization(rgbArray, 0);
    // console.log(quantColors);

    // Controllo della lunghezza dell'array
    if (quantColors.length > 12) {
      let r = quantColors[12].r;
      let g = quantColors[12].g;
      let b = quantColors[12].b;
      let result = document.getElementById("result");
      result.style.background = `linear-gradient(180deg, rgb(${r}, ${g}, ${b}), #212121)`;
    } else {
      console.warn("Non ci sono abbastanza colori quantizzati.");
    }
  };

  imgElement.onerror = function () {
    console.error("Errore nel caricamento dell'immagine.");
  };
};

const buildRgb = (imageData) => {
  const rgbValues = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };
    rgbValues.push(rgb);
  }
  return rgbValues;
};

const quantization = (rgbValues, depth) => {
  const MAX_DEPTH = 4;

  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;
        return prev;
      },
      { r: 0, g: 0, b: 0 }
    );

    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);

    return [color];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

  const mid = rgbValues.length / 2;
  return [...quantization(rgbValues.slice(0, mid), depth + 1), ...quantization(rgbValues.slice(mid + 1), depth + 1)];
};

const findBiggestColorRange = (rgbValues) => {
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
};

getInfoAlbum(id);

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

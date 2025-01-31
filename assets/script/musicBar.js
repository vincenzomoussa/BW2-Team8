let buttonPrecedente = document.getElementById("canzone-precedente");
let buttonSuccessivo = document.getElementById("canzone-successiva");
let buttonPausaStart = document.getElementById("avvio-pausa");
let buttonRestart = document.getElementById("reset-canzone");
let regolaVolume = document.getElementById("volume-slider");
let barradurata = document.getElementById("seek-slider");
let currentTime = document.getElementById("current-time");
let duration = document.getElementById("duration");
let imgBarMusic = document.getElementById("img-bar-music");
let titoloCanzoneBarMusic = document.getElementById("titolo-canzone-bar-music");
let nomeArtistaBarMusic = document.getElementById("nome-artista-bar-music");
let buttonVolume = document.getElementById("volume");

let audio = new Audio();

let volumeAudio = localStorage.getItem("volume");

if (volumeAudio) {
  audio.volume = volumeAudio;
  regolaVolume.value = volumeAudio;
  updateSliderBackground2(regolaVolume);
}

let canzoneAvviata = localStorage.getItem("durataCanzone");

let isplaying;

barMusicinfo();

const playStop = function () {
  if (isplaying) {
    audio.pause();
    buttonPausaStart.style.color = "#b3b3b3";
    buttonPausaStart.innerHTML = `<ion-icon name="play-circle-sharp"></ion-icon>`;
    isplaying = false;
    localStorage.setItem("isplaying", false);
  } else {
    audio.play();
    buttonPausaStart.style.color = "#1ed760";
    buttonPausaStart.innerHTML = `<ion-icon name="pause-circle"></ion-icon>`;
    isplaying = true;
    localStorage.setItem("isplaying", true);
  }
};

if (canzoneAvviata) {
  barradurata.value = canzoneAvviata;
  audio.currentTime = (barradurata.value / 100) * localStorage.getItem("audioDuration");
}
updateSliderBackground(barradurata);

window.addEventListener("load", function () {
  if (localStorage.getItem("isplaying") === "true") {
    audio.play();
    buttonPausaStart.style.color = "#1ed760";
    buttonPausaStart.innerHTML = `<ion-icon name="pause-circle"></ion-icon>`;
    isplaying = true;
  } else {
    audio.pause();
    buttonPausaStart.style.color = "#b3b3b3";
    buttonPausaStart.innerHTML = `<ion-icon name="play-circle-sharp"></ion-icon>`;
    isplaying = false;
  }
});

buttonPausaStart.addEventListener("click", function () {
  playStop();
});

buttonRestart.addEventListener("click", function () {
  audio.currentTime = 0;
});

regolaVolume.addEventListener("input", function () {
  audio.volume = regolaVolume.value;
  localStorage.setItem("volume", regolaVolume.value);
  if (audio.volume === 0) {
    buttonVolume.innerHTML = `<ion-icon name="volume-mute-sharp"></ion-icon>`;
  } else {
    buttonVolume.innerHTML = ` <ion-icon name="volume-high-sharp"></ion-icon>`;
  }
});

function updateSliderBackground2(slider) {
  const value = slider.value * 100;
  slider.style.background = `linear-gradient(to right, #1ed760 ${value}%, #404040 ${value}%)`;
}

regolaVolume.addEventListener("input", function () {
  updateSliderBackground2(this);
});

regolaVolume.addEventListener("mouseenter", function () {
  updateSliderBackground2(this);
});

regolaVolume.addEventListener("mousedown", function () {
  updateSliderBackground2(this);
});

regolaVolume.addEventListener("mouseup", function () {
  updateSliderBackground2(this);
});

regolaVolume.addEventListener("mouseleave", function () {
  updateSliderBackground2(this);
});

audio.addEventListener("loadedmetadata", function () {
  duration.innerText = convertSeconds(audio.duration);
});

function updateSliderBackground(slider) {
  const value = slider.value;
  slider.style.background = `linear-gradient(to right, #1ed760 ${value}%, #404040 ${value}%)`;
}

// Aggiungi gli event listener solo una volta
barradurata.addEventListener("input", function () {
  // L'utente sta cercando di cambiare la posizione della canzone, aggiornando manualmente la barra
  audio.currentTime = (barradurata.value / 100) * audio.duration;
  updateSliderBackground(barradurata);
});

barradurata.addEventListener("mouseenter", function () {
  updateSliderBackground(this);
});

barradurata.addEventListener("mouseleave", function () {
  updateSliderBackground(this);
});

// Evento che aggiorna la barra del progresso durante la riproduzione della canzone
audio.addEventListener("timeupdate", function () {
  const durataTotale = (audio.currentTime / audio.duration) * 100;

  if (isNaN(durataTotale)) {
    barradurata.value = 0;
  } else {
    barradurata.value = durataTotale;
    localStorage.setItem("durataCanzone", barradurata.value);
    localStorage.setItem("audioDuration", audio.duration);
  }
  currentTime.innerText = convertSeconds(audio.currentTime);

  // Aggiorna lo sfondo della barra in base al progresso attuale della canzone
  updateSliderBackground(barradurata);
});

function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes} : ${remainingSeconds}`;
}

let volumeMute = false;

if (localStorage.getItem("volumeTruefalse")) {
  if (localStorage.getItem("volumeTruefalse") === "true") {
    audio.volume = 0;
    regolaVolume.value = 0;
    updateSliderBackground2(regolaVolume);
    buttonVolume.innerHTML = `<ion-icon name="volume-mute-sharp"></ion-icon>`;
    volumeMute = true;
  } else {
    audio.volume = volumeAudio;
    regolaVolume.value = volumeAudio;
    updateSliderBackground2(regolaVolume);
    buttonVolume.innerHTML = ` <ion-icon name="volume-high-sharp"></ion-icon>`;
    volumeMute = false;
  }
}

buttonVolume.addEventListener("click", function () {
  if (volumeMute) {
    audio.volume = localStorage.getItem("volume");
    regolaVolume.value = localStorage.getItem("volume");
    updateSliderBackground2(regolaVolume);
    buttonVolume.innerHTML = ` <ion-icon name="volume-high-sharp"></ion-icon>`;
    volumeMute = false;
    localStorage.setItem("volume", regolaVolume.value);
    localStorage.setItem("volumeTruefalse", volumeMute);
  } else {
    audio.volume = 0;
    regolaVolume.value = 0;
    updateSliderBackground2(regolaVolume);
    buttonVolume.innerHTML = `<ion-icon name="volume-mute-sharp"></ion-icon>`;
    volumeMute = true;
    localStorage.setItem("volume", regolaVolume.value);
    localStorage.setItem("volumeTruefalse", volumeMute);
  }
});

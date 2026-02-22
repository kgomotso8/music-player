const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");

// Add your songs here
const songs = [
  {
    name: "song1",
    title: "First Song"
  },
  {
    name: "song2",
    title: "Second Song"
  }
];

let songIndex = 0;

// Load song
function loadSong(song) {
  title.innerText = song.title;
  audio.src = `music/${song.name}.mp3`;

  // Highlight the current song in the menu
  const listItems = document.querySelectorAll("#song-list li");
  listItems.forEach((item) => item.classList.remove("active"));
  if (listItems[songIndex]) {
    listItems[songIndex].classList.add("active");
  }
}

// --- Song Menu ---
const songListContainer = document.createElement("div");
songListContainer.id = "song-list-container";
const songList = document.createElement("ul");
songList.id = "song-list";

songs.forEach((song, index) => {
  const listItem = document.createElement("li");
  listItem.innerText = song.title;
  listItem.setAttribute("data-index", index);
  songList.appendChild(listItem);
});

songListContainer.appendChild(songList);
document.body.appendChild(songListContainer);

// Style the song menu
const style = document.createElement("style");
style.innerHTML = `
  #song-list-container { position: absolute; top: 20px; right: 20px; background: rgba(0, 0, 0, 0.6); border-radius: 8px; max-height: 200px; overflow-y: auto; }
  #song-list { list-style: none; padding: 5px; margin: 0; }
  #song-list li { padding: 8px 15px; cursor: pointer; transition: background 0.2s; border-radius: 4px; color: #fff; }
  #song-list li:hover { background: rgba(255, 255, 255, 0.1); }
  #song-list li.active { color: #28e98c; font-weight: bold; }
`;
document.head.appendChild(style);

// Handle clicks on the song menu
songList.addEventListener("click", (e) => {
  if (e.target && e.target.nodeName === "LI") {
    songIndex = parseInt(e.target.getAttribute("data-index"));
    loadSong(songs[songIndex]);
    playSong();
  }
});

loadSong(songs[songIndex]);

// Play song
function playSong() {
  audio.play();
  playBtn.innerText = "⏸";
}

// Pause song
function pauseSong() {
  audio.pause();
  playBtn.innerText = "▶";
}

// Play / Pause toggle
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// Previous song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Update progress bar
audio.addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
});

// Set progress when clicked
progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

// --- Galaxy Stars Background Effect ---
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Apply background to root to make z-index:-1 canvas visible
document.documentElement.style.background = "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)";
document.body.style.backgroundColor = "transparent";

// Style the canvas to sit behind the player
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-1";

let canvasWidth, canvasHeight;
let stars = [];

function resizeCanvas() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  initStars();
}

function initStars() {
  stars = [];
  const numStars = 200;
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: Math.random() * 2,
      offset: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    });
  }
}

function animateStars() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  const time = Date.now() * 0.05;

  stars.forEach((star) => {
    // Move star
    star.x += star.vx;
    star.y += star.vy;

    // Wrap stars around the screen if they go off-canvas
    if (star.x < 0) star.x = canvasWidth;
    if (star.x > canvasWidth) star.x = 0;
    if (star.y < 0) star.y = canvasHeight;
    if (star.y > canvasHeight) star.y = 0;

    // Wave of colors: Hue changes based on X position and time
    const hue = ((star.x / canvasWidth) * 360 + time) % 360;
    // Twinkle effect
    const alpha = 0.5 + 0.5 * Math.sin(time * 0.1 + star.offset);

    ctx.fillStyle = `hsla(${hue}, 100%, 75%, ${alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
animateStars();
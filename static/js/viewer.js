/* DEFAULT VALUES */
let slide = 1;
let code = "";
let presentation = "1fPdAfk9o9X_dQJnHMZgR_V992aJwRfs1rCZ4mCvfNmY";

/* DOM ELEMENTS */
const roomCodeInput = document.getElementById("inputRoomCode");
const next = document.getElementById("viewerNext");
const prev = document.getElementById("viewerPrev");
const join = document.getElementById("join");
const instructions = document.getElementById("instructions");

/* SOCKET.IO CONNECTION */
const socket = io("https://next-slide-please.glitch.me"); // not an error

/* CHANGE SLIDES WHEN THE "NEXT" BUTTON IS PRESSED */
socket.on("updateSlides", data => {
  slide = data.slide;
});

/* VIEWER CONTROLS */
const nextSlide = () => {
  socket.emit("nextSlide", { code: code });
};


const prevSlide = () => {
  slide = slide > 1 ? slide-1 : 1;
  socket.emit("prevSlide", { code: code });
};


/* JOIN A UNIQUE ROOM WITH A 4-DIGIT CODE */
const updateRoomCode = (code) => {
  if (code.length == 4) {
    join.classList.remove("inactive");
  } else {
    join.classList.add("inactive");}
}

const joinRoom = (code) => {
  socket.emit("joinRoom", {
    code
  });
};

socket.on("goToRoom", data => {
  code = data.code;
  document.getElementById("container").classList.add("not-displayed");
  document.getElementById("viewerControls").classList.remove("not-displayed");
});

socket.on("noRoomWithCode", data => {
  instructions.innerHTML = "<b style='color:red'>No room with that code is active right now.</b><br/>Try another room code?"
  join.classList.add("inactive");
});

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);
roomCodeInput.addEventListener("input", () => updateRoomCode(roomCodeInput.value));
join.addEventListener("click", () => joinRoom(roomCodeInput.value));
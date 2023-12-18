/* DEFAULT VALUES */
let slide = 1;
let rotation = 1;
let code = "";
let presentation = "1fPdAfk9o9X_dQJnHMZgR_V992aJwRfs1rCZ4mCvfNmY";
let canUpdate = true;
const delayMs = 1500; // delay between slide updates (in milliseconds)

/* DOM ELEMENTS */
const presentationInput = document.getElementById("inputPresentation");
const presentationURL = document.getElementById("presentationURL");
const startPresentation = document.getElementById("startPresentation");
const slideA = document.getElementById("slideA");
const slideB = document.getElementById("slideB");
const slideC = document.getElementById("slideC");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const reset = document.getElementById("reset");
const roomCode = document.getElementById("roomCode");

/* SOCKET.IO CONNECTION */
const socket = io("https://next-slide-please.glitch.me"); // not an error

/* Change which slide is shown to the audience */
/** 
  Because we can't send a signal directly to Google Slides, this app cheats a bit 
  by pre-loading the next and previous slides, then switching between them —
  sort of like shuffling a deck of cards, but what's shown on the cards changes
  whenever they aren't on top. 
  
  This means that we first want to show the "active" slide, then hide the other two,
  then change the content of the other two so we're prepared for the next update from the users.
*/
const updateSlide = () => {
  console.log(rotation);
  if (rotation == 1) { // Slide A is active
    slideA.classList.remove("invisible");
    slideA.muted = false;
    slideB.classList.add("invisible");
    slideB.muted = true;
    slideB.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`);
    slideC.classList.add("invisible");
    slideC.muted = true;
    slideC.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${Math.max(1,slide-1)}`);
  } else if (rotation == 2) { // Slide B is active
    slideB.classList.remove("invisible");
    slideB.muted = false;
    slideA.classList.add("invisible");
    slideA.muted = true;
    slideA.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${Math.max(1,slide-1)}`);
    slideC.classList.add("invisible");
    slideC.muted = true;
    slideC.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`);
  } else { // Slide C is active
    slideC.classList.remove("invisible");
    slideC.muted = false;
    slideA.classList.add("invisible");
    slideA.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`);
    slideA.muted = true;
    slideB.classList.add("invisible");
    slideB.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${Math.max(1,slide-1)}`);
    slideB.muted = true;
  }
}

const updatePresentationURL = (input) => {
  presentationInput.value = input;
  presentationURL.value = input;
  if (input.match(/\/d\/([A-Za-z0-9\-\_]+)\/?/)) {
    presentation = input.match(/\/d\/([A-Za-z0-9\-_]+)\/?/)[1] || presentation; // if the input is not a valid Google Slides URL, ignore it
    startPresentation.classList.remove("inactive");
    if (code !== "") { //updating the URL mid-presentation
      slide = 1;
      socket.emit("goToSlide", { slide: slide, code: code });
      updateSlide();
    }
  } else {
    startPresentation.classList.add("inactive");
  }
}

const nextSlide = () => {
  if (canUpdate) {
    slide++;
    rotation = rotation == 3 ? 1 : rotation + 1;
    updateSlide();
    canUpdate = false;
    setTimeout(() => {
      canUpdate = true;
    }, delayMs);
  } 
}

const prevSlide = () => {
  if (canUpdate) {
    slide = slide > 1 ? slide-1 : 1;
    rotation = rotation == 1 ? 3 : rotation - 1;
    updateSlide();
    canUpdate = false;
    setTimeout(() => {
      canUpdate = true;
    }, delayMs);
  }
}

const resetSlides = () => {
  slide = 1;
  rotation = 1;
  
  slideA.classList.add("invisible");
  slideB.classList.add("invisible");
  slideC.classList.add("invisible");
  
  slideA.muted = true;
  slideB.muted = true;
  slideC.muted = true;
  
  slideA.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide}`);
  slideB.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide+1}`);
  slideC.setAttribute("src", `https://docs.google.com/presentation/d/${presentation}/preview?rm=minimal&slide=${slide}`);

  slideA.classList.remove("invisible"); 
  slideA.muted = false;
  
  
  canUpdate = false;
  setTimeout(() => {
    canUpdate = true;
  }, delayMs);
}

const beginPresentation = (input) => {
  if (input.match(/\/d\/([A-Za-z0-9\-\_]+)/)) {
    document.body.classList.add("theatre-mode");
    if (code ==  "") { // If we are not already in a room, create a new one
      socket.emit("createRoom");
    }
    resetSlides();
  }
}

const toggleRoomCode = () => {
  roomCode.innerText = roomCode.innerText == "🔒 code" ? code : "🔒 code";
}

const hideRoomCode = () => {
  roomCode.innerText = "🔒 code";
}

socket.on("nextSlide", data => {
  nextSlide();
});

socket.on("prevSlide", data => {
  if (slide > 1) {
    prevSlide();
  }
});

socket.on("goToRoom", data => {
  code = data.code;
  document.getElementById("container").classList.add("not-displayed");
  document.getElementById("presenterScreen").classList.remove("not-displayed");
  document.getElementById("presenterControls").classList.remove("not-displayed");
});

// Event listeners
startPresentation.addEventListener("click", () => beginPresentation(presentationInput.value));
presentationInput.addEventListener("input", (e) => updatePresentationURL(e.target.value));
presentationURL.addEventListener("input", (e) => updatePresentationURL(e.target.value));
next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);
reset.addEventListener("click", resetSlides);
roomCode.addEventListener("click", toggleRoomCode);
roomCode.addEventListener("mouseleave", hideRoomCode);
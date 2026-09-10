const imageButton = document.getElementById("mouseButton");
const rickrollImage = document.getElementById("rickrollImage");
const enriqueSound = document.getElementById("enriqueSound");

imageButton.addEventListener("click", () => {
  // Hide the starting image
  imageButton.classList.add("hidden");

  // Show the animated GIF
  rickrollImage.classList.remove("hidden");

  // Play the MP3 sound
  enriqueSound.currentTime = 0;

  enriqueSound.play().catch((error) => {
    console.error("The sound could not play:", error);
  });
});
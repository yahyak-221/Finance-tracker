const lockScreen = document.getElementById("lock-screen");
const pinInput = document.getElementById("pin-input");
const unlockBtn = document.getElementById("unlock-btn");
const pinError = document.getElementById("pin-error");

const setPinScreen = document.getElementById("set-pin-screen");
const newPinInput = document.getElementById("new-pin");
const setPinBtn = document.getElementById("set-pin-btn");

const glassOverlay = document.getElementById("glass-overlay");
const appContent = document.getElementById("app-content");

const storedPin = localStorage.getItem("userPIN");

// Show lock screen or PIN setup
function showLockScreen() {
  if (!storedPin) {
    setPinScreen.classList.remove("hidden");
    showGlassOverlay();
  } else {
    lockScreen.classList.remove("hidden");
    showGlassOverlay();
  }
}

function showGlassOverlay() {
  glassOverlay.style.display = "block";
  appContent.style.pointerEvents = "none";
}

function hideGlassOverlay() {
  glassOverlay.style.display = "none";
  appContent.style.pointerEvents = "auto";
}

// Unlock attempt
unlockBtn.addEventListener("click", () => {
  const enteredPin = pinInput.value.trim();
  if (enteredPin === storedPin) {
    lockScreen.classList.add("hidden");
    pinInput.value = "";
    pinError.textContent = "";
    hideGlassOverlay();
  } else {
    pinError.textContent = "Incorrect PIN";
  }
});

// Set new PIN
setPinBtn.addEventListener("click", () => {
  const newPin = newPinInput.value.trim();
  if (newPin.length >= 4 && /^\d+$/.test(newPin)) {
    localStorage.setItem("userPIN", newPin);
    setPinScreen.classList.add("hidden");
    alert("PIN set successfully");
    hideGlassOverlay();
  } else {
    alert("Please enter a valid 4-digit PIN");
  }
});

// On page load
window.addEventListener("load", showLockScreen);

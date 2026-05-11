// i really dont want to clean this code... might as well release the website.
let timespeed = 1;
let gameStarted = false;
let accelerate = document.getElementById("accelerate");
let state;
const waterImg = document.getElementById("water")
let sunInterval;
let tempDisplay = document.getElementById("temperatureDisplay")
let isDay = true;
let lastTimespeed = -1
let sunPosition = 0;
let decelerate = document.getElementById("decelerate");
let pause = document.getElementById("pause");
let askwater = document.getElementById("askWater");
let comment = document.getElementById("comment");
let restart = document.getElementById("restart");
let asksoil = document.getElementById("askSoil");
let titleDisplay = document.getElementById("titleDisplay");
let sunlightdisplay = document.getElementById("sunLightDisplay")
let timespeeddisplay = document.getElementById("timeSpeedDisplay");
let popup = document.getElementById("popup");
let goodBtn = document.getElementById("goodSoil");
let badBtn = document.getElementById("badSoil");
let plantImg = document.getElementById("plant");
let choice = "";
let playedDeathSound = false;
let daynight = document.getElementById("DayNightCycle")
const sunSlider = document.getElementById("sunSlider");


function updateSunTransition(timespeed) {
   timespeed = Math.max(0.1, timespeed);
  const duration = 12 / timespeed;

  const computed = getComputedStyle(daynight);

  const currentTop = computed.top;
  const currentRight = computed.right;

  daynight.style.transition = "none";

  daynight.style.top = currentTop;
  daynight.style.right = currentRight;

  void daynight.offsetWidth;

  daynight.style.transition = `top ${duration}s linear, right ${duration}s linear`;

  daynight.style.top = "250px";
  daynight.style.right = "5px";
}
function loopSunTransition(daynight, timespeed) {
  const duration = 12 / Math.max(0.1, timespeed);

  daynight.style.transition = "none";

  daynight.style.top = "5px";
  daynight.style.right = "250px";

  void daynight.offsetWidth;

  daynight.style.transition = `top ${duration}s linear, right ${duration}s linear`;

  daynight.style.top = "250px";
  daynight.style.right = "5px";
}
const upgrade = new Audio('upgrade.wav');
upgrade.volume = 0.05;
goodBtn.onclick = function() {
  plant.soilType = "good";
  popup.style.display = "none";
    gameStarted = true;
  choice = "goodbtn"
};

badBtn.onclick = function() {
  plant.soilType = "bad";
  popup.style.display = "none";
    gameStarted = true;
  choice = "badbtn"

};
accelerate.addEventListener("click", function() {
    if (timespeed < 10) timespeed += 1;
    timespeeddisplay.innerHTML = timespeed;
    upgrade.play();

})
decelerate.addEventListener("click", function() {
    if (timespeed > 1 ) {
        timespeed-=1;
        timespeeddisplay.innerHTML = timespeed;
    }
    upgrade.play();

})
pause.addEventListener("click", function() {
    timespeed = 0;
    timespeeddisplay.innerHTML = timespeed;
    upgrade.play();

})


class Plant {
  constructor(img) {
    this.img = img;
    this.size = 50;
    this.water = 30;
    this.age = 0;
    this.soilMultiplier;
    this.problem = ""
    this.currentstate = "healthy";
    this.maxSize = Math.floor(Math.random() * (250 - 125 + 1)) + 125;
    this.maxAge = Math.floor(Math.random() * (75 - 50 + 1)) + 50;
    this.sunLight = 10
    this.temperature = 15
  }
  changeState(timeSpeed) {
    if (this.water <= 0 ) {
    state = "dead";
  } else if (this.water < 10 ) {
    state = "verydry"
  } else if (this.water < 20 ) {
    state = "dry"
  } else {
    state = "healthy"
  }
  if (this.currentstate != state) {
    this.currentstate = state;
  }
  if (this.currentstate == "dry") {
    this.img.src = "plant_dry.png"
    comment.innerHTML = "The plant is dry. "
    askwater.style.display = "none";    
  if (this.water < 20) {
  askwater.style.display = "block";
  askwater.style.width = "120px";
  askwater.style.height = "auto";
  waterImg.style.width = "120px";
  waterImg.style.height = "auto";
  }
  } else if (this.currentstate == "verydry") {
      this.img.src = "plant_verydry.png"
      if (this.water < 10) {
  askwater.style.display = "block";
  askwater.style.width = "120px";
  askwater.style.height = "auto";
  waterImg.style.width = "120px";
  waterImg.style.height = "auto";
  }
    comment.innerHTML = "Danger ! The plant is very dry!"
  } else if (this.currentstate == "dead") {
    this.problem = "Not enough water !"
       this.die()
  }  else if (this.currentstate == "healthy") {
      this.img.src = "plant_alive.png"
        comment.innerHTML = "";
  }
  }
  update(timeSpeed) {

  let targetTemp;
  tempDisplay.innerHTML = Math.round(this.temperature) + "°C"
  if (isDay) {
    targetTemp = 25;
  } else {
    targetTemp = 10;
  }

  this.temperature += (targetTemp - this.temperature) *0.01*timespeed;

    askwater.style.display = "none";
      if (this.age >= this.maxAge) {
        this.problem = "Too old !"
    this.die();
    return;
  }
  if (choice === "goodbtn") {
  this.soilMultiplier = 1;
}
if (Math.random() < 0.005 && timespeed != 0) {
  this.temperature += 5;
}

if (choice === "badbtn") {
  this.soilMultiplier = 0.5;
}
let diff = Math.abs(this.temperature - 20);

let tempFactor = 1 - diff * 0.02;

tempFactor = Math.max(0.6, tempFactor);

  if (this.size <= this.maxSize) {
    if (isDay) {
this.size += 0.1 * timespeed * this.soilMultiplier * (this.sunLight / 10) *tempFactor
    } else if (!isDay) {
this.size += 0.1 * timespeed * this.soilMultiplier* tempFactor
    }
  }  else {comment.innerHTML = "Max Size reached !"}
  this.age += 0.01 * timespeed;
let drain = 0.01 * timespeed;

if (this.sunLight > 16) {
  drain *= 2;
}
if (this.temp > 30) {
  drain*= 2
} else if (this.temp > 25) {
  drain*= 1.5
}
this.water -= drain;  
    this.img.style.width = this.size + "px";
    this.img.style.height = "auto";
    if (timespeed === 0) {
  plantImg.style.opacity = 0.6;
} else {
  plantImg.style.opacity = 1;
}
sunlightdisplay.innerHTML = this.sunLight
this.changeState(timespeed)
  }
  die() {
  this.img.src = "plant_dead.png";
  titleDisplay.innerHTML = "Plant is dead because of " + this.problem;
  const death = new Audio('death-sound.wav');
  if (!playedDeathSound) {
    death.play();
    playedDeathSound = true;
  }
  comment.innerHTML = "";}
}
let plant = new Plant(plantImg);
function loop() {

  if (gameStarted) {
      plant.update(timespeed);
      if (timespeed !== lastTimespeed) {
        updateSunTransition(timespeed);
        lastTimespeed = timespeed;
      }
    }
  requestAnimationFrame(loop);
}

daynight.addEventListener("transitionend", (e) => {
  if (e.propertyName !== "top") return;

  if (daynight.src.includes("sun.png")) {
    daynight.src = "moon.png";
    isDay = false;
    
  } else {
    isDay = true;
    daynight.src = "sun.png";
  }
      loopSunTransition(daynight, timespeed)
});
function restartSunTransition(daynight, timespeed) {
  const duration = 12 / Math.max(0.1, timespeed);
  daynight.style.transition = "none";
  daynight.style.top = "5px";
  daynight.style.right = "250px";
  daynight.src = "sun.png"; 
  void daynight.offsetWidth;
  isDay = true;
  daynight.style.transition = `top ${duration}s linear, right ${duration}s linear`;
}
function resetSun() {
    daynight.style.transition = "none"; 

    void daynight.offsetWidth;

    daynight.style.transition = ""; 
    restartSunTransition(daynight, timespeed);
    updateSunTransition(timespeed);
}
loop();
restart.addEventListener("click", function() {
  plant = new Plant(plantImg);
  resetSun()
  upgrade.play();
})
askwater.addEventListener("click", function() {
  plant.water += 10;
  const water_drop = new Audio('water-drop.mp3');
    water_drop.play();
  plant.update(timespeed);
})
sunSlider.addEventListener("input", (e) => {
  plant.sunLight = Number(e.target.value);
});


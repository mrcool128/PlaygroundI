// PS for anyone reading : this code is TRASH, definently couldve remove like 30 lines but at least it works lol
let scoreDisplay = document.getElementById("score");
function checkAnswer() {
    let userValue = parseFloat(convertInto.value);
    if (Math.abs(userValue - trueAnswer) < 0.1) {
        score += 1;
        scoreDisplay.textContent = score + " true answer"
        convertInto.value = "";
        decision.textContent = "That's true!";
        decision.style.color = "green";
        decision.style.fontSize = "30px"
        getRandomValue()
    } else {
        convertInto.value = ""
        decision.textContent = `Oh, that's wrong. The right value is : ${Math.round(trueAnswer * 10) / 10}`
        decision.style.color = "red";
        decision.style.fontSize = "20px"
        getRandomValue()
    }
}
let firstConversion = document.getElementById("FirstConversion");
let FirstRandomConversion = {
    1: "kilometers",
    2: "miles",
    3: "centimeters",
    4: "fahrenheit",
    5: "celsius",
    6: "kilograms",
    7: "pounds",
    8: "minutes", 
    9: "seconds",
    10: "meters"
}
let trueAnswer = 0;
let score = 0;
let convertInto = document.getElementById("ConversionGuess")
function getRandomValue() {
    let randomKey = Math.floor(Math.random() * 10) + 1
    let randomUnit = FirstRandomConversion[randomKey];
    let number =     Math.floor(Math.random() * 300)
    firstConversion.textContent =
    number + " " +  randomUnit;
    if (randomUnit === "kilometers") {
    convertInto.placeholder = "Miles"
    trueAnswer = Math.round((number/1.609)*10) / 10
} else if (randomUnit === "miles") {
    convertInto.placeholder = "Kilometers"
    trueAnswer = Math.round((number*1.609)*10) / 10
} else if (randomUnit === "centimeters") {
    convertInto.placeholder = "Meters"
    trueAnswer = number/100
} else if (randomUnit === "fahrenheit") {
    convertInto.placeholder = "Celsius"
    trueAnswer = Math.round(((number-30)/1.8)*10) / 10
} else if (randomUnit === "celsius") {
    convertInto.placeholder = "Fahrenheit"
    trueAnswer = Math.round(((number*1.8)+32)*10) / 10
} else if (randomUnit === "kilograms") {
    convertInto.placeholder = "Pounds"
    trueAnswer = Math.round((number*2.2)*10) / 10
} else if (randomUnit === "pounds") {
    convertInto.placeholder = "Kilograms"
    trueAnswer = Math.round((number/2.2)*10) / 10
} else if (randomUnit === "minutes") {
    convertInto.placeholder = "seconds"
    trueAnswer = number*60
} else if (randomUnit === "seconds") {
    convertInto.placeholder = "Minutes"
    trueAnswer = number/60
} else if (randomUnit === "meters") {
    convertInto.placeholder = "Centimeters"
    trueAnswer = number*100
}

}
getRandomValue()

let decision = document.getElementById("Decision");
convertInto.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
let popUp = false;
let helpbutton = document.getElementById("helpbutton")
helpbutton.addEventListener("click", function() {
    if (!popUp) {
            decision.innerHTML += `
        <br><strong>Conversion Table:</strong><br>
        1 kilometer = 0.621 miles<br>
        1 mile = 1.609 kilometers<br>
        1 centimeter = 0.01 meters<br>
        1 meter = 100 centimeters<br>
        Fahrenheit → Celsius: (F - 32) / 1.8<br>
        Celsius → Fahrenheit: C * 1.8 + 32<br>
        1 kilogram = 2.2 pounds<br>
        1 pound = 0.454 kilograms<br>
        1 minute = 60 seconds<br>
        1 second = 1/60 minutes
    `;
    decision.style.color = "black";
    decision.style.fontSize = "20px";
    popUp = true
    } else {
        decision.innerHTML = "";
        popUp = false
    }
})
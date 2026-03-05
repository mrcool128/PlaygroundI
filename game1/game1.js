let clickFold = document.getElementById("fold");
let clickUnfold = document.getElementById("unfold");
let description = document.getElementById("infoPaper");
let paper = 4;
let dimensions = {
  A0: "84.1 x 118.9 cm",
  A1: "59.4 x 84.1 cm",
  A2: "42.0 x 59.4 cm",
  A3: "29.7 x 42.0 cm",
  A4: "21.0 x 29.7 cm",
  A5: "14.8 x 21.0 cm",
  A6: "10.5 x 14.8 cm",
  A7: "7.4 x 10.5 cm",
  A8: "5.2 x 7.4 cm",
  A9: "3.7 x 5.2 cm",
  A10: "2.6 x 3.7 cm",
  A11: "1.8 x 2.6 cm",
  A12: "1.3 x 1.8 cm",
  A13: "0.9 x 1.3 cm",
  A14: "0.6 x 0.9 cm",
  A15: "0.4 x 0.6 cm",
  A16: "0.3 x 0.4 cm",
  A17: "0.2 x 0.3 cm",
  A18: "0.1 x 0.2 cm",
  A19: "0.1 x 0.1 cm",
  A20: "~0.1 x ~0.1 cm",
};
let descriptionList = {
  A0: "GIANT. Used for large maps and big displays.",
  A1: "Large wall poster. Great for presentations and panels.",
  A2: "Medium poster. Common for artwork and technical drawings.",
  A3: "Two A4 sheets side by side. Good for diagrams and layouts.",
  A4: "The standard paper. Used for school, printers, and documents.",
  A5: "Small notebook size. Flyers and notepads.",
  A6: "Postcard size. Invitations and small cards.",
  A7: "Very small format. Labels and tiny notes.",
  A8: "Business card size. Mini labels.",
  A9: "Stamp size. Almost invisible to the eye.",
  A10: "why and how are you still here lol.",
  A11: "Currently smaller than a fingernail. Cool !",
  A12: "Now it's the size of a grain of rize !",
  A13: "a dot. like this :  .  ",
  A14: "smaller than a pixel on your screen",
  A15: "reality starts to break...",
  A16: "you're basically folding atoms.",
  A17: "Paper has left the physical world",
  A18: "Paper? More like Air !",
  A19: "A point? Even I don't know lol.",
  A20: "You have folded reality itself. GG",
};
const img = [
    "A0.jpeg",
    "A1.jpeg",
    "A2.jpeg",
    "A3.jpeg",
    "A4.jpeg",
    "A5.jpeg",
    "A6.jpeg",
]
let scale = 1;
clickFold.addEventListener("click", function() {
    if (paper < 20) {
        paper = paper+1
    }
    let key = "A" + paper
    if (paper <= 20) {
        let paperImage = document.getElementById("paper");
        if (paper <= 6) {
            paperImage.src = img[paper]
        } else {
            paperImage.src = "paper.jpg"
        }
        description.textContent = key + " - " + dimensions[key]
        description.innerHTML += "<br>" + descriptionList[key]
        foldSound.currentTime = 0;
        foldSound.play();
}});
clickUnfold.addEventListener("click", function() {
    if (paper > 0) {
        paper = paper-1
    }
    let key = "A" + paper
    if (paper <= 20) {
        description.textContent = key + " - " + dimensions[key]
        description.innerHTML += "<br>" + descriptionList[key]
        let paperImage = document.getElementById("paper");
        if (paper <= 6) {
            paperImage.src = img[paper]
        }
    }
    foldSound.currentTime = 0;
    foldSound.play();
})
clickFold.addEventListener("mouseover", function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "rgb(255, 0, 30)"
});
clickFold.addEventListener("mouseout", function() {
    this.style.cursor = "normal";
    this.style.backgroundColor = "rgb(220, 0, 30)";
})
clickUnfold.addEventListener("mouseover", function() {
    this.style.cursor = "pointer";
    this.style.backgroundColor = "rgb(0, 200, 0)"
});
clickUnfold.addEventListener("mouseout", function() {
    this.style.cursor = "normal";
    this.style.backgroundColor = "rgb(0, 184, 0)";
}) 
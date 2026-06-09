let footer = document.getElementById("footer");

let info = "PlaygroundII stores your best scores and settings only in your browser (localStorage). No data is sent to our servers, and no personal information is collected.";
let original = footer.innerHTML;

footer.addEventListener("click", function () {
if (footer.innerHTML === original) {
        footer.innerHTML = info;
        footer.style.fontSize = "20px";
    } else {
        footer.innerHTML = original;
        footer.style.fontSize = "12px";
    }
});
const buttons = document.querySelectorAll("a");

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        button.style.transform = "scale(0.98)";

        setTimeout(function () {
            button.style.transform = "";
        }, 100);
    });
});
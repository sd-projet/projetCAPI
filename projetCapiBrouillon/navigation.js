// navigation.js
document.addEventListener("DOMContentLoaded", function () {
    const mainPage = document.getElementById("main-page");
    const newGamePage = document.getElementById("new-game-page");

    const mainPageBtn = document.getElementById("main-page-btn");
    const newGameBtn = document.getElementById("new-game-btn");

    mainPageBtn.addEventListener("click", function () {
        showPage(mainPage);
    });

    newGameBtn.addEventListener("click", function () {
        // Ajoute la redirection vers la page "nouvelle-partie.html"
        window.location.href = "nouvelle-partie.html";
    });

    // Fonction pour afficher une page et masquer les autres
    function showPage(page) {
        // Masque toutes les pages
        mainPage.classList.add("hidden");
        newGamePage.classList.add("hidden");

        // Affiche la page spécifiée
        page.classList.remove("hidden");
    }
});

// main-page.js
const voteManager = new VoteManager(); // Assurez-vous de passer les paramètres nécessaires si besoin

document.addEventListener("DOMContentLoaded", function () {
    const newGameBtn = document.getElementById("new-game-btn");
    const loadGameBtn = document.getElementById("load-game-btn");

    const mainPage = document.getElementById("main-page-btn");
    const newGamePage = document.getElementById("new-game-page");
    const navBar = document.getElementById("nav-bar");

    const mainPageBtn = document.getElementById("main-page-btn");

    newGameBtn.addEventListener("click", function () {
        // Masque la page principale
        mainPage.classList.add("hidden");

        // Affiche la nouvelle page
        newGamePage.classList.remove("hidden");

        // Affiche la barre de navigation
        navBar.classList.remove("hidden");
    });

    mainPageBtn.addEventListener("click", function () {
        // Affiche la page principale
        mainPage.classList.remove("hidden");

        // Masque les autres pages
        newGamePage.classList.add("hidden");

        // Masque la barre de navigation (ou adapte selon les besoins)
        navBar.classList.add("hidden");
    });

    // Ajoutez le gestionnaire d'événements pour le bouton "Charger Partie"
    const loadGameButton = document.getElementById("load-game-btn");
    loadGameButton.addEventListener("click", function () {
        // Ouvrir la boîte de dialogue pour sélectionner un fichier
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                // Lire le contenu du fichier
                const reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        // Analyser le contenu JSON
                        const jsonData = JSON.parse(e.target.result);

                        // Extraire les données pertinentes
                        const featureName = jsonData.featureName;
                        const player = jsonData.player;
                        const votes = jsonData.vote;

                        // Réinitialiser les votes dans le gestionnaire de votes
                        voteManager.resetVotes();

                        // Reprendre le jeu avec les nouvelles données
                        resumeGame(featureName,player, votes);
                    } catch (error) {
                        console.error("Erreur lors de la lecture du fichier JSON : ", error);
                    }
                };

                reader.readAsText(file);
            }
        });

        input.click(); // Déclencher le clic sur l'élément d'entrée de fichier
    });

    // Fonction pour reprendre le jeu avec les données chargées
    function resumeGame(featureName, votes) {
        // Mettez en œuvre la reprise du jeu avec les données chargées

        // Par exemple, vous pouvez afficher la première fonctionnalité
        displayNextFeature(featureName);

        // Ensuite, vous pouvez rétablir les votes
        votes.forEach(vote => {
            voteManager.recordVote(vote);
        });

        // Notifiez les observateurs après avoir rétabli les votes
        voteManager.notifyObservers();
    }

});



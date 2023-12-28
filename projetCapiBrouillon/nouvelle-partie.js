// nouvelle-partie.js

document.addEventListener("DOMContentLoaded", function () {
    const playerCountInput = document.getElementById("player-count");

    const playersList = document.getElementById("players-list");
    const ruleSelect = document.getElementById("rule-select");

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");

    const nextStepBtn = document.getElementById("next-step-btn");
    const nextStepBtn2 = document.getElementById("next-step-btn-2");
    const nextStepBtn3 = document.getElementById("next-step-btn-3");

    const entryOptions = document.querySelectorAll(".entry-option");
    const finishBtn = document.getElementById("finish-btn");

    const addFeatureBtn = document.getElementById("add-feature-btn");
    const manualFeaturesInput = document.getElementById("manual-features");
    const featureList = document.getElementById("feature-list");


    let currentPlayerStep = 1; // Indique la phase actuelle

    nextStepBtn.addEventListener("click", function () {
        if (currentPlayerStep === 1) {
            const playerCount = parseInt(playerCountInput.value, 10);
            if (playerCount > 0) {
                // Masque l'étape 1
                step1.classList.add("hidden");

                // Génère les champs de saisie pour les pseudos
                generatePlayerFields(playerCount);

                // Affiche l'étape suivante (étape 2)
                currentPlayerStep++;
                step2.style.display = "block";
            } else {
                alert("Veuillez choisir un nombre de joueurs valide.");
            }
        }
    });

    nextStepBtn2.addEventListener("click", function () {
        if (currentPlayerStep === 2) {
            // Masque l'étape 2
            step2.classList.add("hidden");

            // Récupère la règle choisie
            const selectedRule = ruleSelect.value;
            console.log("Règle choisie :", selectedRule);

            // Affiche l'étape suivante (étape 3)
            currentPlayerStep++;
            step3.style.display = "block";
        }
    });

    nextStepBtn3.addEventListener("click", function () {
        if (currentPlayerStep === 3) {
            // Masque l'étape 3
            step3.classList.add("hidden");

            // Affiche l'étape suivante (étape 4)
            currentPlayerStep++;
            step4.style.display = "block";

            entryOptions.forEach(option => option.classList.remove("hidden"));
            document.getElementById("manual-entry").classList.remove("hidden");
        }
    });

    addFeatureBtn.addEventListener("click", function () {
        const featureText = manualFeaturesInput.value.trim();

        if (featureText !== "") {
            // Ajoute la fonctionnalité à la liste
            const li = document.createElement("li");
            li.textContent = featureText;
            featureList.appendChild(li);

            // Réinitialise le champ de saisie
            manualFeaturesInput.value = "";
        }
    });

    finishBtn.addEventListener("click", function () {
        // Récupérer les fonctionnalités saisies ou importées
        const manuallyEnteredFeatures = Array.from(featureList.querySelectorAll("li")).map(li => li.textContent);

        // Récupérer les informations nécessaires pour la nouvelle page
        const playerNames = getPlayerNames(); // Utiliser la nouvelle fonction

        const selectedRule = ruleSelect.value;

        // Sélectionner la première fonctionnalité (vous pouvez adapter cela en fonction de votre logique)
        const selectedFeature = manuallyEnteredFeatures.length > 0 ? manuallyEnteredFeatures[0] : "Aucune fonctionnalité";

        // Passer les données à la nouvelle page via l'URL
        const queryString = `?player=${playerNames}&feature=${manuallyEnteredFeatures}&rule=${selectedRule}`;
        const votePageURL = `vote.html${queryString}`;

        // Rediriger vers la nouvelle page
        window.location.href = votePageURL;
    });


    // Fonction pour générer les champs de saisie des pseudos
    function generatePlayerFields(count) {
        for (let i = 1; i <= count; i++) {
            const li = document.createElement("li");
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Joueur " + i;
            li.appendChild(input);
            playersList.appendChild(li);
        }
    }

    function getPlayerNames() {
        const playerInputs = Array.from(playersList.querySelectorAll("input"));
        const playerNames = playerInputs.map(input => input.value.trim()).filter(name => name !== "");
        return playerNames;
    }

});


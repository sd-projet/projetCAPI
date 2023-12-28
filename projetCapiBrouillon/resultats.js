// resultats.js

document.addEventListener("DOMContentLoaded", function () {
    const voteManager = new VoteManager();

    // Récupérez les résultats du vote
    const featureName = voteManager.getFeatureName();
    const featureVotes = voteManager.getVotesForFeature();
    const difficultyEstimations = {
        featureName: featureName,
        votes: featureVotes
    };

    // Affichez les résultats du vote (ajustez cela en fonction de votre structure HTML)
    const resultsElement = document.createElement("div");
    resultsElement.textContent = JSON.stringify(difficultyEstimations, null, 2);
    document.body.appendChild(resultsElement);

    // Ajoutez un gestionnaire d'événements au bouton de téléchargement
    const downloadButton = document.getElementById("downloadButton");
    downloadButton.addEventListener("click", function () {
        // Enregistrez le fichier JSON
        downloadJSON(difficultyEstimations, 'estimations_difficulte.json');
    });

    function downloadJSON(data, filename) {
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(jsonBlob);
        a.download = filename;

        // Ajouter le lien au corps, déclencher le clic, puis le supprimer
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Inclure le fichier resultats.js après la déclaration de featureName
    const scriptResultats = document.createElement("script");
    scriptResultats.src = "votes.js";
    document.head.appendChild(scriptResultats);

});

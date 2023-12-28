// vote.js

// class Backlog qui gère les fonctionnalités
class Backlog {
    constructor() {
        if (!Backlog.instance) {
            // Initialisation de la classe Backlog
            this.tasks = [];
            Backlog.instance = this;
        }
        return Backlog.instance;
    }

    addTask(task) {
        this.tasks.push(task);
    }
    getTasks() {
        return this.tasks;
    }
}

// class GameManager qui gère les stratégies de validation pour déterminer si la fonctionnalité est validée en utilisant le pattern Singleton
class GameManager {
    constructor(validationStrategy) {
        this.validationStrategy = validationStrategy;
        this.currentGame = null;
    }

    startGame(game) {
        this.currentGame = game;
        console.log(`Le jeu "${game}" a commencé.`);
    }

    getCurrentGame() {
        return this.currentGame;
    }

    validateFeature(votes) {
        // Utilisez la stratégie de validation pour déterminer si la fonctionnalité est validée
        return this.validationStrategy ? this.validationStrategy.validate(votes) : true;
    }
}

// class VoteManager qui gère les votes en fonction du pattern Strategy
class VoteManager {
    constructor(featureName,validationStrategy) {
        this.observers = [];
        this.votes = [];
        this.validationStrategy = null;
        this.featureName = featureName;

        if (validationStrategy) {
            this.setValidationStrategy(validationStrategy);
        }
    }

    addObserver(observer) {
        if (!this.observers.some(obs => obs.name === observer.name)) {
            this.observers.push(observer);
        }
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.votes));
    }
    setValidationStrategy(validationStrategy) {
        this.validationStrategy = validationStrategy;
    }
    resetVotes() {
        this.votes = [];
    }

    recordVote(vote) {
        this.votes.push(vote);

        // Vérifiez que la stratégie de validation est définie et a une méthode validate
        if (this.validationStrategy && typeof this.validationStrategy.validate === 'function') {
            if (this.validationStrategy.validate(this.votes)) {
                this.notifyObservers();
            } else {
                console.log("Vote invalide selon la stratégie de validation actuelle.");
            }
        } else {
            console.log("Stratégie de validation non définie ou invalide.");
        }
    }
    getVotesForFeature() {
        return this.votes;
    }
    getFeatureName() {
        return this.featureName;
    }
}

// class Joueur pour gérer les joueurs qui sont considérer comme des observateurs
class Joueur {
    constructor(name) {
        this.name = name;
    }

    update(votes, currentPlayer) {
        // Vérifiez si le joueur actuel correspond à ce joueur
        if (this.name === currentPlayer ) {
            console.log(`Le joueur ${this.name} : a voté ${JSON.stringify(votes)}`);
        }
    }
}

// Interface pour les stratégies de validations
class ValidationStrategy {
    validate(votes) {
        throw new Error("La méthode validate doit être implémentée par les sous-classes.");
    }
}

// Stratégie de validation stricte
class StrictValidationStrategy extends ValidationStrategy {
    /*validate(votes) {
        // Filtrer les votes pour ne conserver que ceux avec des valeurs numériques
        const numericVotes = votes.filter(vote => !isNaN(vote.vote));

        // Vérifier si toutes les valeurs de vote numériques sont identiques
        const areVotesEqual = numericVotes.length > 0 && numericVotes.every(vote => vote.vote === numericVotes[0].vote);

        if (areVotesEqual) {
            console.log("Votes égaux");
        } else {
            alert("Les votes numériques sont différents. Recommencez le vote.");
        }
        return areVotesEqual;
    }*/
    validate(votes) {
        // Filtrer les votes pour ne conserver que ceux avec des valeurs non vides
        const nonEmptyVotes = votes.filter(vote => vote.vote !== "");

        // Vérifier si toutes les valeurs de vote non vides sont identiques
        const areVotesEqual = nonEmptyVotes.length > 0 && nonEmptyVotes.every(vote => vote.vote === nonEmptyVotes[0].vote);

        if (areVotesEqual) {
            console.log("Votes égaux");
        } else {
            alert("Les votes sont différents. Recommencez le vote.");
        }

        return areVotesEqual;
    }
}

// Stratégie de validation moyenne
class AverageValidationStrategy extends ValidationStrategy {
    validate(votes) {
        // Implémentation de la validation moyenne
        // Exemple : La valeur moyenne doit être dans une plage spécifique
        //const totalVotes = votes.reduce((acc, vote) => acc + parseInt(vote), 0);
        const totalVotes = votes.reduce((acc, vote) => acc + Number(vote), 0);

        const average = totalVotes / votes.length;
        return average >= 0 && average <= 10;
    }
}

// Stratégie de validation médiane
class MedianValidationStrategy extends ValidationStrategy {
    validate(votes) {
        // Implémentation de la validation médiane
        // Exemple : La médiane doit être dans une plage spécifique
        const sortedVotes = votes.map(vote => parseInt(vote)).sort((a, b) => a - b);
        const medianIndex = Math.floor(sortedVotes.length / 2);
        const median = sortedVotes.length % 2 === 0
            ? (sortedVotes[medianIndex - 1] + sortedVotes[medianIndex]) / 2
            : sortedVotes[medianIndex];
        return median >= 0 && median <= 10;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    // compteurs
    let votesCount = 0;
    let currentPlayerIndex = 0;
    let currentFeatureIndex = 0;
    let cafeVotesCount = 0;
    let voteViaCard = false;  // Variable pour suivre si le vote a été fait via une carte

    //recupere les fonctionnalité à travers l'URL
    const featureNameParam = urlParams.get('feature');
    const featureName = featureNameParam.split(',');
    const featureElement = document.createElement("h2");
    featureElement.textContent = `Fonctionnalité en cours : ${featureName[currentFeatureIndex]}`;
    document.body.appendChild(featureElement);

    // recupere les joueurs à travers l'URL
    const playerNameParam = urlParams.get('player');
    const playerName = playerNameParam.split(',');
    const playerElement = document.createElement("h3");
    playerElement.textContent = `Joueur : ${playerName[currentPlayerIndex]}`;
    document.body.appendChild(playerElement);

    // instanciation des classes
    const voteManager = new VoteManager(featureName);
    const backlog = new Backlog();
    const gameManager = new GameManager();
    const playerObjects = playerName.map(playerName => new Joueur(playerName));

    // Récupérez l'élément rule existant
    const selectedRule = urlParams.get('rule');
    handleRuleSelection(selectedRule);

    // Ajouter les joueurs en tant qu'observateurs
    playerObjects.forEach(player => {
        voteManager.addObserver(player);
    });

    featureName.forEach(task => backlog.addTask(task));

    const tasksParam = new URLSearchParams(window.location.search).get('tasks');
    const tasks = tasksParam ? tasksParam.split(',') : [];

    // Ajouter les tâches au backlog
    tasks.forEach(task => backlog.addTask(task));


    // attribution de valeurs aux cartes sous forme de bouton
    const cards = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', 'interro', 'cafe'];
    const featureList = document.createElement("div");
    featureList.id = "feature-list";
    document.body.appendChild(featureList);

    for (const cardValue of cards) {
        const button = createCardButton(cardValue, `/static/images/cartes_${cardValue}.png`);
        featureList.appendChild(button);
    }

    // création du bouton nouveau joueur
    const nextPlayerButton = createNextPlayerButton();
    nextPlayerButton.style.display = "none";
    featureList.appendChild(nextPlayerButton);

    // lancement du jeu
    featureList.addEventListener("click", function (event) {
        const selectedCard = event.target;
        handleVote(selectedCard);
    });

    // La fonction appelée lorsqu'une règle est sélectionnée
    function handleRuleSelection(selectedRule) {
        const validationStrategy = createValidationStrategy(selectedRule);
        voteManager.setValidationStrategy(validationStrategy);
    }

    // fonction pour gérer le choix des règles
    function createValidationStrategy(selectedRule) {
        switch (selectedRule) {
            case "Stricte":
                return new StrictValidationStrategy();
            case "Moyenne":
                return new AverageValidationStrategy();
            case "Mediane":
                return new MedianValidationStrategy();
            default:
                console.error("Règle de validation inconnue :", selectedRule);
                return new AverageValidationStrategy(); // Remplacez par votre stratégie par défaut
        }
    }

    // création des boutons des cartes
    function createCardButton(value, imagePath) {
        const button = document.createElement("button");
        button.value = value;
        button.classList.add("button");

        const img = document.createElement("img");
        img.src = imagePath;
        img.width = 50;
        img.height = 75;

        // Ajoutez un attribut de données pour stocker la valeur
        button.setAttribute("data-value", value);
        button.appendChild(img);

        button.addEventListener("click", function () {
            // Récupérez la valeur à partir de l'attribut de données
            const selectedValue = event.currentTarget.getAttribute("data-value");
            console.log(`Carte sélectionnée : ${selectedValue}`);
            handleVote(selectedValue);
        });

        return button;
    }

    // fonction qui gère les évènements du bouton joueur suivant
    function createNextPlayerButton() {
        const button = document.createElement("button");
        button.textContent = "Joueur suivant";
        button.addEventListener("click", function () {
            nextPlayer();
            if (currentPlayerIndex === 0) {
                displayNextFeature(featureName);
            }
        });

        return button;
    }

    // fonction qui gere les votes
    function handleVote(selectedValue) {
        const currentPlayer = playerName[currentPlayerIndex];
        if (selectedValue === "cafe") {
            cafeVotesCount++;
        }
        if (selectedValue !== "") {
            voteManager.recordVote({ feature: featureName[currentFeatureIndex],player: currentPlayer, vote: selectedValue });
        } else {
            console.log("Aucune valeur sélectionnée pour le vote.");
        }
        if (selectedValue !== "nextPlayer") {
            voteViaCard = true;
        }

        votesCount++;
        nextPlayerButton.style.display = "block";

        // Appelez la méthode update pour chaque joueur en passant currentPlayer
        playerObjects.forEach(player => {
            if (selectedValue !== null && selectedValue !== "") {
                player.update({
                    feature: featureName[currentFeatureIndex],
                    player: currentPlayer,
                    vote: selectedValue
                });
            }
        });
        // Appelez notifyObservers seulement si tous les joueurs ont voté
        if (currentPlayerIndex >= playerName.length - 1) {
            voteManager.notifyObservers();
        }
        // Vérifier si tous les joueurs ont voté pour la carte "café"
        if (cafeVotesCount === playerName.length) {
            downloadResults();
        }
    }

    // fonction pour télécharger les données actuelle lors de l'utilisation de la carte café
    function downloadResults() {
        // Enregistrer les estimations de difficulté au format JSON
        const difficultyEstimations = createDifficultyEstimations();
        downloadJSON(difficultyEstimations, './estimations_difficulte.json');
    }

    // fonction pour afficher les prochaines fonctionnalités
    function displayNextFeature(selectedValue) {
        currentFeatureIndex++;
        if (currentFeatureIndex < featureName.length) {
            const nextFeature = featureName[currentFeatureIndex];
            featureElement.textContent = `Fonctionnalité en cours : ${nextFeature}`;
            currentPlayerIndex = 0; // Réinitialiser l'index du joueur actuel à zéro
            // Réinitialiser la liste des votes
            //voteManager.resetVotes();

            // Appeler la méthode notifyObservers pour informer les joueurs du changement de fonctionnalité
            //voteManager.notifyObservers();
        } else {
            alert("Toutes les fonctionnalités ont été affichées.");

            // Enregistrer les estimations de difficulté au format JSON
            //const difficultyEstimations = createDifficultyEstimations();
            //downloadJSON(difficultyEstimations, 'estimations_difficulte.json');
        }
        const featureVotes = voteManager.getVotesForFeature();
        const isFeatureValidated = gameManager.validateFeature(featureVotes);
        console.log("Votes avant la validation de la fonctionnalité :", featureVotes);

        if (isFeatureValidated) {
            //alert("La fonctionnalité est validée !");
        } else {
            //alert("La fonctionnalité n'est pas validée selon la stratégie de validation actuelle.");
        }
    }

    // fonction pour afficher les prochains joueurs
    function nextPlayer() {
        currentPlayerIndex++;
        //voteManager.resetVotes();

        if (currentPlayerIndex >= playerName.length) {
            currentPlayerIndex = 0;

            // Vérifier la validation après avoir changé de joueur
            const featureVotes = voteManager.getVotesForFeature();
            const isFeatureValidated = gameManager.validateFeature(featureVotes);
            console.log("Votes avant la validation de la fonctionnalité :", featureVotes);

            if (isFeatureValidated) {
                alert("La fonctionnalité est validée !");
            } else {
                alert("La fonctionnalité n'est pas validée selon la stratégie de validation actuelle.");
            }

            // Réinitialiser la liste des votes et notifier les observateurs
            //voteManager.resetVotes();
            //voteManager.notifyObservers();
        }

        playerElement.textContent = `Joueur : ${playerName[currentPlayerIndex]}`;
        if (voteViaCard) {
            voteViaCard = false;
        } else {
            nextPlayerButton.style.display = "none";
        }
    }

    // fonction pour crée les estimations de difficultés au format JSON
    function createDifficultyEstimations() {
        const featureVotes = voteManager.getVotesForFeature();
        const difficultyEstimations = {
            featureName: featureName,
            votes: featureVotes
        };
        return difficultyEstimations;
    }

    // fonction pour télécharger les données
    function downloadJSON(data, filename) {
        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(jsonBlob);
        a.download = filename;

        // Ajouter le lien au corps, déclencher le clic, puis le supprimer
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

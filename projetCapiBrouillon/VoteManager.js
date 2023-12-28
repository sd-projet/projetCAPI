// voteManager.js

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

export class Rules {
    constructor() {
        this.name = "Generic Rules";
        this.settingsBuilder = "buildGenericSettings";
        this.minFaan = 0;
        this.maxFaan = 13;
        this.handSize = 14;
        this.tileCount = 144;
        this.allowChows = true;
        this.useJokers = false;
        this.useFlowers = true;
        this.useSeasons = true;
    }

    buildGenericSettings(settings) {
        // Implement generic settings
    }

    isValidWin(hand) {
        // Implement generic win condition checks
    }

    calculateScore(hand) {
        // Implement generic scoring logic
    }

    checkForLimit(hand) {
        // This is a placeholder method that should be overridden by specific rulesets
        return null;
    }
}
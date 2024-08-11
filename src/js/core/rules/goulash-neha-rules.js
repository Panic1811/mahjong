import { Rules } from './rules.js';

export class GoulashNehaRules extends Rules {
    constructor() {
        super();
        this.name = "Goulash (Neha)";
        this.settingsBuilder = "buildGoulashNehaSettings";
        
        this.minFaan = 0;
        this.maxFaan = 13;
        this.handSize = 14;
        this.tileCount = 152; // Includes joker tiles
        
        this.allowChows = false; // Chows are not allowed in Goulash Mahjong
        this.useJokers = true;
        this.useFlowers = true;
        this.useSeasons = true;
    }

    buildGoulashNehaSettings(settings) {
        // Implement settings specific to Goulash Mahjong
        settings.charleston = true;
        settings.requiredPungs = 2; // Two pungs of dragons or winds required
        settings.ownWindPung = true; // At least one pung must be player's own wind
        settings.flowerRequirement = 2; // Two of player's own flowers or one flower and one pung of winds/dragons
    }

    isValidWin(hand) {
        // Implement win condition checks specific to Goulash Mahjong
        let dragonWindPungs = 0;
        let hasOwnWindPung = false;
        let flowerCount = 0;

        // Count pungs of dragons/winds and check for own wind
        hand.pungs.forEach(pung => {
            if (pung.isHonor()) {
                dragonWindPungs++;
                if (pung.tile === hand.player.wind) hasOwnWindPung = true;
            }
        });

        // Count flowers
        flowerCount = hand.flowers.length;

        // Check win conditions
        return dragonWindPungs >= 2 && 
               hasOwnWindPung && 
               (flowerCount >= 2 || (flowerCount >= 1 && dragonWindPungs >= 3));
    }

    calculateScore(hand) {
        // Implement scoring logic for Goulash Mahjong
        let score = 0;
        // Add basic scoring logic here
        // Example:
        score += hand.pungs.length * 2;
        score += hand.kongs.length * 4;
        score += hand.flowers.length;

        // Special scoring rules
        if (hand.isHandFromHeaven) {
            score *= 2;
        }

        return score;
    }
}
import { Rules } from './rules.js';

export class CantoneseRules extends Rules {
  constructor() {
    super();
    this.name = "Cantonese";
    this.settingsBuilder = "buildCantoneseSettings";
    
    // Modify these values according to Cantonese Mahjong rules
    this.minFaan = 0;
    this.maxFaan = 13;
    this.handSize = 14;
    this.tileCount = 144;
    
    // Add or modify other properties as needed
    this.allowChows = true;
    this.useJokers = false;
    this.useFlowers = true;
    this.useSeasons = true;
  }

  // Override or add methods as needed for Cantonese Mahjong rules
}
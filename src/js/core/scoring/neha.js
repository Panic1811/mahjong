/**
 * Neha (Goulash Mahjong) rules.
 */

class Neha {
  static create(Ruleset) {
    return class extends Ruleset {
      constructor() {
        super(
          Ruleset.POINTS_DOUBLES,
          2000,  // start score
          0,     // single limit (not used in Neha)
          0,     // points for winning (determined by hand composition)
          false, // no-point hand does not exist in this ruleset
          true,  // losers pay each other
          true,  // east doubles up
          false, // selfdraw wins do not pay double
          false, // discarding player does not pay double
          true,  // reverse wind direction
          false  // deal does not pass when east wins
        );
        this.limits = new Ruleset.LimitHands();
        this.handsPerRound = 8; // 2 hands for each wind
      }

      checkForLimit(allTiles, lockedSize) {
        if (lockedSize >= 5) {
          return "Five or more sets"; // A limit hand is reached if the player has 5 or more sets
        }
        return false; // No limit hand found
      }

      getPairValue(tile, locked, concealed, names, windTile, windOfTheRoundTile) {
        if (tile.isWind() || tile.isDragon()) {
          return 2; // Wind and Dragon pairs are worth 2 points
        }
        return 0; // Other pairs are worth 0 points
      }

      getPungValue(tile, locked, concealed, names, windTile, windOfTheRoundTile) {
        if (tile.isWind() || tile.isDragon()) {
          return { value: 4, doubles: 1 }; // Wind and Dragon pungs are worth 4 points and 1 double
        }
        return { value: 0, doubles: 0 }; // Other pungs are worth 0 points and 0 doubles
      }

      getKongValue(tile, locked, concealed, names, windTile, windOfTheRoundTile) {
        if (tile.isWind() || tile.isDragon()) {
          return { value: 8, doubles: 1 }; // Wind and Dragon kongs are worth 8 points and 1 double
        }
        return { value: 0, doubles: 0 }; // Other kongs are worth 0 points and 0 doubles
      }

      checkHandPatterns(scorePattern, windTile, windOfTheRoundTile, tilesLeft, scoreObject) {
        if (scorePattern.hasTwoPungsOfDragonsOrWinds()) {
          scoreObject.doubles += 1;
          scoreObject.log.push(`1 double for two Pungs of Dragons or Winds`);
        }
      }

      checkWinnerHandPatterns(scorePattern, winset, selfdraw, selftile, robbed, windTile, windOfTheRoundTile, tilesLeft, scoreObject) {
        let state = this.getState(scorePattern, winset, selfdraw, selftile, robbed, windTile, windOfTheRoundTile, tilesLeft);
        
        // Check for Hand from Heaven
        if (state.handFromHeaven) {
          scoreObject.doubles += 1;
          scoreObject.log.push(`1 double for Hand from Heaven`);
        }
      }

      checkBonusTilePoints(bonus, windTile, names, result) {
        bonus.forEach(tile => {
          if (tile.isFlower() || tile.isSeason()) {
            result.addPoints(1); // Flowers and Seasons are worth 1 point each
          }
        });
      }

      isHandFromHeaven(scorePattern, winset, selfdraw, selftile) {
        // Hand from Heaven: winning on the first turn without any discards
        return selfdraw && winset.length === 1 && scorePattern.length === 0;
      }
    }
  }
}

export { Neha };
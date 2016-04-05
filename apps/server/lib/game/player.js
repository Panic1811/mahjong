var md5 = require('md5');

var logger = require('../logger');
var Constants = require('../constants');
var Listener = require('./protocol/listener');
var Emitter = require('./protocol/emitter');

var Player = function(game, id, socket) {
  this.game = game;
  this.id = id;
  this.socket = socket;
  this.tiles = [];
  this.bonus = [];
  this.revealed = [];
  this.log = logger('game', game.id, 'player', id);
  this.log("created");
};

Player.prototype = {

  /**
   * socket.io interfacing
   */
  send(str, payload) {
    payload.gameid = this.game.id;
    payload.handid = this.hand.id;
    payload.playerid = this.id;
    if (typeof payload.playerposition === 'undefined') {
      payload.playerposition = this.playerposition;
    }
    // Force break in execution before sending; if we don't, socket.io
    // starts to loose all kinds of data. For... reasons? idk...
    process.nextTick(()=>{ this.socket.emit(str, payload); });
  },

  /**
   * Reset this player.
   */
  reset() {
    this.socket.disconnect();
  },

  /**
   * Generate a hash based on this player's tiles, bonus tiles, and revealed tiles.
   */
  getDigest() {
    var list = this.tiles.concat(this.bonus);
    this.revealed.forEach(set => { list = list.concat(set); });
    return md5(list.sort().join(''));
  },

  /**
   * Verify a client's tile state, because we want to make sure that
   * the remove and local models match. If they don't, something,
   * somewhere, went wrong and that's either a bug, an unaccounted-for
   * synchronisation error, or a intentional remote subversion.
   */
  verify(digest) {
    var localDigest = this.getDigest();
    var passed = (digest === localDigest);
    console.log("verifying",this.playerposition,":",this.tiles,this.bonus,this.revealed);
    this.send("verification", { result: passed });
  },

  /**
   * When a hand starts, everything resets.
   */
  bindHand(hand, state) {
    this.hand = hand;
    this.playerposition = state.playerposition;
    this.send("confirm", state);
  },

  /**
   * initial hand deal (usuall 13 tiles).
   */
  setHand(tiles) {
    this.tiles = tiles;
    this.log("received tiles", tiles);
    this.send("sethand", { tiles });
  },

  /**
   * game dealt X tiles to the indicated player.
   */
  dealtTiles(playerposition, tileCount) {
    this.log(playerposition,"was dealt",tileCount,"tiles");
    this.send("dealt", { playerposition, tileCount });
  },

  /**
   * the current hand was drawn.
   */
  drawOccured() {
    this.send("finish:draw", {})
  },

  /**
   * game deals a tile to this player.
   */
  deal(tile) {
    this.tiles.push(tile);
    this.tiles.sort();
    this.send("tile", { tile });
  },

  /**
   * Game notification that another player drew a tile.
   */
  drew(playerposition) {
    this.send("drew", { playerposition });
  },

  /**
   * this player discarded
   */
  discard(tile) {
    this.tiles.splice(this.tiles.indexOf(tile),1);
  },

  /**
   * Game notification that another player discards this tile.
   */
  discarded(playerposition, tile) {
    this.send("discarded", { playerposition, tile });
  },

  /**
   * Game notification that a discarded tile was unclaimed and
   * has been moved to the (inaccessible) discard pile
   */
  unclaimed(tile) {
    this.send("unclaimed", { tile });
  },

  /**
   * Receive compensation tiles for bonus tiles.
   */
  getCompensation(bonus, compensation) {
    compensation.forEach(tile => this.tiles.push(tile));
    bonus.forEach(tile => { this.bonus.push(tile); this.tiles.splice(this.tiles.indexOf(tile),1); });
    this.tiles.sort();
    this.send("compensation", { tiles: compensation });
  },

  /**
   * Receive compensation tile for a kong.
   */
  getKongCompensation(tile) {
    this.getCompensation([],[tile]);
  },

  /**
   * Game notification that another player received a compensation tile for a bonus tiles.
   */
  gotCompensation(playerposition, tiles) {
    tiles = tiles.filter(t => t>=Constants.BONUS);
    this.send("compensated", { playerposition, tiles });
  },

  /**
   * A declined claim is mostly a matter of notification, no action is requied.
   */
  declineClaim(tile, claimType) {
    this.send("declined", { tile, claimType });
  },

  /**
   * An accepted claim will lead to splitting up the tiles into a revealed
   * set, and the remaining tiles still in hand.
   */
  acceptClaim(ruleset, tile, claimType, winType) {
    ruleset.processClaim(this, tile, claimType, winType);
    this.send("accepted", { tile, claimType, winType });
  },

  /**
   * An accepted win may require we reveal the claimed pair/set
   */
  awardWinningClaim(ruleset, tile, claimType, winType) {
    ruleset.awardWinningClaim(this, tile, claimType, winType);
    claimType = winType;
    this.send("accepted", { tile, claimType, winType });
  },

  /**
   * Another player claimed the discard.
   */
  claimOccurred(playerposition, tile, claimType) {
    this.send("claimed", { playerposition, tile, claimType });
  },


  /**
   * Another player revealed a set of tiles after claiming
   */
  revealedSet(playerposition, revealed) {
    this.send("revealed", { playerposition, revealed });
  },

  /**
   * Someone won this round.
   */
  winOccurred(playerposition, tile, winType) {
    this.send("finish:win", { playerposition, tile, winType });
  }
};

module.exports = Player;

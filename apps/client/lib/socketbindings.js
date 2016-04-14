var Player = require('../react/components/Player.jsx');

/**
 * This object formalises the socket API for a player,
 * where messages sent to it over a socket by the game
 * server get turned into UI behaviour by the Player.jsx
 * class.
 */
module.exports = {
  bind: function(socket, player) {

    /**
     * Received from the server upon joining a game.
     */
    socket.on('joined', data => {
      var gameid = data.gameid;
      var playerposition = data.playerposition;
      player.log("joined game", gameid,"with position",playerposition);
      player.setState({ gameid });
    });

    /**
     * Received from the server when a game is ready to start.
     */
    socket.on('confirm', data => {
      var gameid = parseInt(data.gameid);
      var handid = parseInt(data.handid);
      var playerid = parseInt(data.playerid);
      var playerposition = parseInt(data.playerposition);
      var score = parseInt(data.score);
      player.makeReady(gameid, handid, playerid, playerposition, score);
    });

    /**
     * Received from the server upon starting a hand.
     */
    socket.on('sethand', data => {
      var tiles = data.tiles;
      tiles.sort((a,b) => a - b);
      player.log("received", tiles.join(','));
      // respond with a request to verify this player's tiles
      player.setInitialTiles(tiles, () => { player.verify(); });
    });

    socket.on('dealt', data => {
      var playerposition = data.playerposition;
      var tileCount = data.tileCount;
      //...
    });

    /**
     * Received from the server in response to a request for
     * a compensation tile (either due to drawing a bouns tile
     * or forming a kong)
     */
    socket.on('compensation', data => {
      var tiles = data.tiles;
      player.log("received compensation", tiles.join(','));
      player.addCompensationTiles(tiles);
    });

    /**
     * Received from the server when another player receives
     * a compensation tile due to bonus tiles.
     */
    socket.on('compensated', data => {
      var playerposition = data.playerposition;
      var tiles = data.tiles;
      player.log("player",playerposition,"received compensation for",tiles);
    });

    /**
     * Received from the server to represent a drawing
     * of a tile by this player.
     */
    socket.on('tile', data => {
      var tile = data.tile;
      var playerid = data.playerid;
      player.log("received tile", tile);
      player.addTile(tile);
    });

    /**
     * Received from the server to inform the player that another
     * player drew a tile and is now deciding what to do.
     */
    socket.on('drew', data => {
      player.log("player", data.player, "received tile");
      player.setState({ discard: false, mode: Player.OUT_OF_TURN});
    });

    /**
     * Received from the server whenever another player discards a tile.
     */
    socket.on('discarded', data => {
      var tile = data.tile;
      var pos = data.playerposition;
      player.log("saw discard of tile", tile,"by player",pos);
      player.setState({ discard: tile, discardPlayer: pos });
    });

    /**
     * Received from the server when a discard claim attempt sent by
     * this player is declined by the server (either because the claim
     * itself is bad, or because another player had a better claim).
     */
    socket.on('declined', data => {
      player.log("claim for", data.tile, "("+data.claimType+")", "was declined");
    });

    /**
     * Received from the server when a discard claim attempt is honoured.
     */
    socket.on('accepted', data => {
      var tile = data.tile;
      player.processClaim(data.tile, data.claimType, data.winType);
    });

    /**
     * Received from the server when another player claims a discard.
     */
    socket.on('claimed', data => {
      player.setState({
        discard: false
      });
    });

    /**
     * Received from the server when another player reveals a claimed set.
     */
    socket.on('revealed', data => {
      var playerpos = data.playerposition;
      var revealed = data.revealed;
      player.log("player",playerpos,"played",revealed);
    });

    /**
     * End of a round, round ended in a draw.
     */
    socket.on('finish:draw', data => {
      player.log("hand was a draw...");
      player.finishDraw();
    });

    /**
     * End of a round, round ended in a win by a player.
     */
    socket.on('finish:win', data => {
      var playerposition = parseInt(data.playerposition);
      var tile = parseInt(data.tile);
      var winType = parseInt(data.winType);
      player.log("hand was a won by", playerposition);
      player.finishWin(playerposition, tile, winType);
    });

    socket.on('finish:win:illegal', data => {
      var playerposition = parseInt(data.playerposition);
      player.log("player", playerposition,"declared an illegal win.");
      player.finishDraw(playerposition);
    });

    /**
     * Update this player's score.
     */
    socket.on('update:score', data => {
      var score = parseInt(data.score);
      var balance = data.balance;
      player.updateScore(score, balance);
    });

    /**
     * Verification results
     */
    socket.on('verification', data => {
      var result = data.result;
      player.verification(result);
    });

    /**
     * Handle a kong declaration response.
     */
    socket.on('claim:concealedkong', data => {
      var tile = parseInt(data.tile);
      var compensation = data.compensation ? parseInt(data.compensation) : false;
      player.allowKongDeclaration(tile, compensation);
    });

    socket.on('declare:win:accepted', data => {
      console.log("player has self-drawn win.");
    });

    socket.on('declare:win:declined', data => {
      console.log("player claimed win, but could not win.");
    });

  }
};

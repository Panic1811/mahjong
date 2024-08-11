import { config } from "../../config.js";
import { modal } from "../page/modal/modal.js";

class Tutorial {
  constructor() {
    this.currentRuleset = null;
  }

  getTutorialContent(ruleset) {
    this.currentRuleset = ruleset;
    let content = '';
    let tableOfContents = '';

    switch(this.currentRuleset) {
      case 'chinese':
        content = this.getChineseTutorial();
        tableOfContents = this.getChineseTableOfContents();
        break;
      case 'cantonese':
        content = this.getCantoneseTutorial();
        tableOfContents = this.getCantoneseTableOfContents();
        break;
      case 'neha':
        content = this.getNehaTutorial();
        tableOfContents = this.getNehaTableOfContents();
        break;
    }

    return `
      <div class="table-of-contents">
        <h2>Table of Contents</h2>
        ${tableOfContents}
      </div>
      <div class="tutorial-content">
        ${content}
      </div>
    `;
  }

  getChineseTutorial() {
    return document.querySelector('#tutorial').innerHTML;
  }

  getCantoneseTutorial() {
    return document.querySelector('#explanation').innerHTML + document.querySelector('#gameplay').innerHTML + document.querySelector('#this-game').innerHTML;
  }

  getNehaTutorial() {
    return `
      <h2 id="neha-intro">Introduction to Neha (Goulash) Mahjong</h2>
      <p>Neha Mahjong, also known as Goulash Mahjong, is a variant that introduces unique rules and scoring mechanisms to the traditional game.</p>

      <h2 id="neha-setup">Game Setup</h2>
      <ul>
        <li>The game is played with 4 players</li>
        <li>Each player starts with 2000 points</li>
        <li>A complete game consists of 8 hands (2 for each wind)</li>
      </ul>

      <h2 id="neha-gameplay">Gameplay</h2>
      <p>The basic gameplay follows standard Mahjong rules, with the following exceptions:</p>
      <ul>
        <li>Chows are not allowed except for Concealed Mah Jong and Imperial Jade hands</li>
        <li>The 2 of Bamboo is used as a wild card tile</li>
      </ul>

      <h2 id="neha-scoring">Scoring</h2>
      <ul>
        <li>Wind and Dragon pairs are worth 2 points</li>
        <li>Wind and Dragon pungs are worth 4 points and 1 double</li>
        <li>Wind and Dragon kongs are worth 8 points and 1 double</li>
        <li>Flowers and Seasons are worth 1 point each</li>
      </ul>

      <h2 id="neha-special-hands">Special Hands</h2>
      <ul>
        <li>Five or more sets is considered a limit hand</li>
        <li>"Hand from Heaven" (winning on the first turn) awards 1 double</li>
      </ul>

      <h2 id="neha-goulash">Goulash Rules</h2>
      <p>When a Goulash hand is played:</p>
      <ul>
        <li>Each player puts 100 points in the kitty</li>
        <li>Players exchange tiles in a specific order before the hand begins</li>
        <li>The 2 of Bamboo becomes a wild card</li>
        <li>Chows are not allowed (with exceptions)</li>
      </ul>

      <h2 id="neha-strategy">Strategy Tips</h2>
      <ul>
        <li>Prioritize collecting Winds and Dragons for higher scoring potential</li>
        <li>Be cautious with discarding the 2 of Bamboo (wild card)</li>
        <li>Pay attention to the tile exchanges during Goulash hands</li>
      </ul>
    `;
  }

  getChineseTableOfContents() {
    return `
      <ul>
        <li><a href="#tutorial">Introduction</a></li>
        <li><a href="#explanation">The How of Mahjong</a></li>
        <li><a href="#gameplay">Gameplay</a></li>
        <li><a href="#this-game">About this Implementation</a></li>
      </ul>
    `;
  }

  getCantoneseTableOfContents() {
    return `
      <ul>
        <li><a href="#explanation">The How of Mahjong</a></li>
        <li><a href="#gameplay">Gameplay</a></li>
        <li><a href="#this-game">About this Implementation</a></li>
      </ul>
    `;
  }

  getNehaTableOfContents() {
    return `
      <ul>
        <li><a href="#neha-intro">Introduction</a></li>
        <li><a href="#neha-setup">Game Setup</a></li>
        <li><a href="#neha-gameplay">Gameplay</a></li>
        <li><a href="#neha-scoring">Scoring</a></li>
        <li><a href="#neha-special-hands">Special Hands</a></li>
        <li><a href="#neha-goulash">Goulash Rules</a></li>
        <li><a href="#neha-strategy">Strategy Tips</a></li>
      </ul>
    `;
  }
}

export const tutorial = new Tutorial();
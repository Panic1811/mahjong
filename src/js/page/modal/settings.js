import { config } from "../../../config.js";
import { Ruleset } from "../../core/scoring/ruleset.js";
import { WallHack  } from "../../core/game/wall/wall-hack.js";

class SettingsModal {
  constructor(modal) {
    this.modal = modal;
  }

  show() {
    let panel = this.modal.makePanel(`settings`);
    let options = [
      {
        label: "Ruleset",
        key: "RULES",
        value: config.RULES,
        options: config.RULESETS,
        handler: (entry, evt) => {
          config.RULES = evt.target.value;
        },
      },
      {
        label: `🀄 Always show everyone's tiles`,
        key: `force_open_bot_play`,
        toggle: true,
      },
      {
        label: `✨ Highlight claimable discards`,
        key: `show_claim_suggestion`,
        toggle: true,
      },
      {
        label: `💬 Show bot play suggestions`,
        key: `show_bot_suggestion`,
        toggle: true,
      },
      {
        label: `🎵 Play sounds`,
        key: `use_sound`,
        toggle: true,
      },
      {
        label: `🟢 Start play immediately`,
        key: `play_immediately`,
        toggle: true,
      },
      {
        label: `⏸️ Pause game unless focused`,
        key: `pause_on_blur`,
        toggle: true,
      },
      {
        label: `💻 Turn on debug mode`,
        key: `debug`,
        toggle: true,
      },
      {
        label: `❌ Pretend previous round was a draw`,
        key: `force_draw`,
        toggle: true,
        debug_only: true,
      },
      {
        label: `📃 Generate game log after play`,
        key: `write_game_log`,
        toggle: true,
        debug_only: true,
      },
      {
        label: `Set game PRNG seed`,
        key: `seed`,
        debug_only: true,
      },
      {
        label: `Bot quick play threshold`,
        key: `bot_chicken_threshold`,
        debug_only: true,
      },
      {
        label: `Delay (in ms) between player turns`,
        key: `play_interval`,
      },
      {
        label: `Delay (in ms) before starting next hand`,
        key: `hand_interval`,
      },
      {
        label: `Delay (in ms) for bots reacting to things`,
        key: `bot_delay_before_discard_ends`,
      },
      {
        label: `Delay (in ms) during full bot play`,
        key: `bot_play_delay`,
      },
      {
        label: `Set up a specific wall`,
        key: `wall_hack`,
        options: [``, ...Object.keys(WallHack.hacks)],
        debug_only: true,
      },
    ];

    this.modal.buildPanelContent(options);
    this.modal.addFooter(panel, "Save", () => {
      config.set(
        options.reduce((obj, opt) => {
          obj[opt.key] = opt.value;
          return obj;
        }, {})
      );
    });
  }
}

export { SettingsModal };
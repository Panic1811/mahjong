import { ChineseClassicalRules } from "./chinese-classical-rules.js";
import { CantoneseRules } from "./cantonese-rules.js";
import { GoulashNehaRules } from "./goulash-neha-rules.js";

export const RulesFactory = {
  create: function(name) {
    switch(name.toLowerCase()) {
      case "chinese classical":
        return new ChineseClassicalRules();
      case "cantonese":
        return new CantoneseRules();
      case "goulash (neha)":
        return new GoulashNehaRules();
      default:
        console.warn(`Unknown ruleset: ${name}, defaulting to Chinese Classical`);
        return new ChineseClassicalRules();
    }
  }
};
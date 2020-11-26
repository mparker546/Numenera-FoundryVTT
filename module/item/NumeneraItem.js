import { NumeneraAbilityItem } from "./NumeneraAbilityItem.js";
import { NumeneraArtifactItem } from "./NumeneraArtifactItem.js";
import { NumeneraArmorItem } from "./NumeneraArmorItem.js";
import { NumeneraCypherItem } from "./NumeneraCypherItem.js";
import { NumeneraEquipmentItem } from "./NumeneraEquipmentItem.js";
import { NumeneraOddityItem } from "./NumeneraOddityItem.js";
import { NumeneraNpcAttackItem } from "./NumeneraNPCAttack.js";
import { NumeneraSkillItem } from "./NumeneraSkillItem.js";
import { NumeneraWeaponItem } from "./NumeneraWeaponItem.js";
import { StrangeRecursionItem } from "./StrangeRecursionItem.js";
import { NumeneraPowerShiftItem } from "./NumeneraPowerShiftItem.js";

/**
 * Numenera item base class
 *
 * Acts as a mix of factory and proxy: depending on its "type" argument,
 * creates an object of the right class (also extending Item) and simply
 * overrides its own properties with that of that new objects.
 *
 * This is used since Item doesn't really allow for real inheritance, so
 * we're simply faking it. #yolo #ididntchoosethethuglife
 *
 * @export
 * @class NumeneraItem
 */
export const NumeneraItem = new Proxy(function () {}, {
  //Calling a constructor from this proxy object
  construct: function (target, args) {
    const [data] = args;
    switch (data.type) {
      case "ability":
        return new NumeneraAbilityItem(...args);
      case "armor":
        return new NumeneraArmorItem(...args);
      case "artifact":
        return new NumeneraArtifactItem(...args);
      case "cypher":
        return new NumeneraCypherItem(...args);
      case "equipment":
        return new NumeneraEquipmentItem(...args);
      case "npcAttack":
        return new NumeneraNpcAttackItem(...args);
      case "oddity":
        return new NumeneraOddityItem(...args);
      case "powerShift":
        return new NumeneraPowerShiftItem(...args);
      case "skill":
        return new NumeneraSkillItem(...args);
      case "weapon":
        return new NumeneraWeaponItem(...args);
      case "recursion":
        return new StrangeRecursionItem(...args);
      default:
        throw new Error("Unsupported Entity type for create(): " + data.type);

    }
  },
  //Property access on this weird, dirty proxy object
  get: function (target, prop, receiver) {  
    switch (prop) {
      case "create":
        //Calling the class' create() static function
        return function (data, options) {
          if (data.constructor === Array) {
            //Array of data, this happens when creating Actors imported from a compendium
            return data.map(a => NumeneraItem.create(a, options));
          }

          switch (data.type) {
            case "ability":
              return NumeneraAbilityItem.create(data, options);
            case "armor":
              return NumeneraArmorItem.create(data, options);
            case "artifact":
              return NumeneraArtifactItem.create(data, options);
            case "cypher":
              return NumeneraCypherItem.create(data, options);
            case "equipment":
              return NumeneraEquipmentItem.create(data, options);
            case "npcAttack":
              return NumeneraNpcAttackItem.create(data, options);
            case "oddity":
              return NumeneraOddityItem.create(data, options);
            case "powerShift":
              return NumeneraPowerShiftItem.create(data, options);
            case "skill":
              return NumeneraSkillItem.create(data, options);
            case "weapon":
              return NumeneraWeaponItem.create(data, options);
            case "recursion":
              return StrangeRecursionItem.create(data, options);
            default:
              throw new Error(
                "Unsupported Entity type for create(): " + data.type
              );
          }
        };

      case Symbol.hasInstance:
        //Applying the "instanceof" operator on the instance object
        return function (instance) {
          return (
            instance instanceof NumeneraAbilityItem ||
            instance instanceof NumeneraArmorItem ||
            instance instanceof NumeneraArtifactItem ||
            instance instanceof NumeneraCypherItem ||
            instance instanceof NumeneraEquipmentItem ||
            instance instanceof NumeneraOddityItem ||
            instance instanceof NumeneraNpcAttackItem ||
            instance instanceof NumeneraPowerShiftItem ||
            instance instanceof NumeneraSkillItem ||
            instance instanceof NumeneraWeaponItem ||
            instance instanceof StrangeRecursionItem
          );
        };

      default:
        //Just forward any requested properties to the base Item class
        return Item[prop];
    }
  },
});

import { NUMENERA } from "../config.js";
import { EffortDialog } from "../apps/EffortDialog.js";
import { useAlternateButtonBehavior } from "../utils.js";

export class NumeneraSkillItem extends Item {
  static get type() {
      return "skill";
  }

  static fromOwnedItem(ownedItem, actor) {
    let skillItem = new NumeneraSkillItem();
    skillItem.data._id = ownedItem._id;
    skillItem.data.name = ownedItem.name;
    skillItem.data.data.notes = ownedItem.data.notes;
    skillItem.data.data.relatedAbilityId = ownedItem.data.relatedAbilityId;
    skillItem.data.data.stat = ownedItem.data.stat;
    skillItem.data.data.inability = ownedItem.data.inability;
    skillItem.data.data.skillLevel = ownedItem.data.skillLevel;
    skillItem.options.actor = actor;

    skillItem.prepareData();

    return skillItem;
  }

  prepareData() {
	  // Override common default icon
	  if (!this.data.img) this.data.img = 'icons/svg/book.svg';

      super.prepareData();

      if (!this.data.hasOwnProperty("data")) {
        this.data.data = {};
      }
      
      const itemData = this.data.data;
      itemData.name = this.data && this.data.name ? this.data.name : game.i18n.localize("NUMENERA.item.skill.newSkill");
      itemData.notes = itemData.notes || "";
      //To avoid problems, set the first stat in the list as the default one
      itemData.stat = itemData.stat || Object.values(NUMENERA.stats)[0];
      itemData.inability = itemData.inability || false;
      itemData.skillLevel = itemData.skillLevel || 0;
  }

  async updateRelatedAbility(ability, options = {}) {
    //If it is not owned by an Actor, it has no related skill
    if (!this.actor || !ability)
      return;

    if (
      ability.data.data.cost.pool === this.data.data.stat &&
      ability.data.name === this.data.name
    )
      return;

    const updated = await ability.update({
      _id: ability._id,
      name: this.name,
      "data.cost.pool": this.data.data.stat,
    },
    options);

    return updated;
  }

  async use(event = null) {
    if (event === null)
      event = window.event;

    //An ability must be related to an Actor to be used
    if (this.actor === null) {
      return ui.notifications.error(game.i18n.localize("NUMENERA.item.skill.useNotLinkedToActor"));
    }

    if (event && useAlternateButtonBehavior()) {
      new EffortDialog(this.actor, {skill: this}).render(true);
    } else {
      await this.actor.rollSkill(this);
    }
  }
}

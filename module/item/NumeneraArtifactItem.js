export class NumeneraArtifactItem extends Item {
    static get type() {
        return "artifact";
    }

    /**
     * Transform the current artifact so it doesn't look identified.
     *
     * @memberof NumeneraArtifactItem
     */
    static asUnidentified(artifact) {
        if (artifact.constructor === Object)
            artifact = NumeneraArtifactItem.fromOwnedItem(artifact);

        artifact.data.name = game.i18n.localize("NUMENERA.pc.numenera.artifact.unidentified");
        artifact.data.level = game.i18n.localize("NUMENERA.unknown");
        artifact.data.effect = game.i18n.localize("NUMENERA.unknown");
        artifact.data.depletion = null;

        return artifact;
    }

    /**
     * Convert an artifact POJO to a NumeneraArtifactItem.
     *
     * @static
     * @param {Object} ownedItem
     * @param {NumeneraPCActor} actor
     * @returns
     * @memberof NumeneraArtifactItem
     */
    static fromOwnedItem(ownedItem, actor) {
        let artifactItem = new NumeneraArtifactItem();
        artifactItem.data._id = ownedItem._id;
        artifactItem.data.name = ownedItem.name;
        artifactItem.data.data = {};
        artifactItem.data.data.price = ownedItem.data.price;
        artifactItem.data.data.notes = ownedItem.data.notes;
        artifactItem.data.data.efffect = ownedItem.data.effect;
        artifactItem.data.data.form = ownedItem.data.form;
        artifactItem.data.data.laws = ownedItem.data.laws;
        artifactItem.data.data.range = ownedItem.data.range;
        artifactItem.data.data.level = ownedItem.data.level;
        artifactItem.data.data.levelDie = ownedItem.data.levelDie;
        artifactItem.data.data.depletion = ownedItem.data.depletion;

        artifactItem.options.actor = actor;

        artifactItem.prepareData();

        return artifactItem;
    }

    async prepareData() {
		// Override common default icon
	    if (!this.data.img) this.data.img = 'icons/svg/mage-shield.svg';

        super.prepareData();

        let itemData = this.data;
        if (itemData.hasOwnProperty("data"))
          itemData = itemData.data;

        itemData.name = this.data.name || game.i18n.localize("NUMENERA.item.artifact.newArtifact");;
        itemData.price = itemData.price || 0;
        itemData.notes = itemData.notes || "";
        itemData.form = itemData.form || "";
        itemData.laws = itemData.laws || "";
        itemData.effect = itemData.effect || "";
        itemData.range = itemData.range || "";

        itemData.depletion = itemData.depletion || {
            isDepleting: true,
            die: "d6",
            threshold: 1
        };

        itemData.levelDie = itemData.levelDie || "";
        itemData.level = itemData.level || "";
    }
}

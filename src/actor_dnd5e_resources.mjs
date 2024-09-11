export default class ActorDnd5eResources {
  static icons = {
    'dnd_fifth_gold': 'icons/commodities/currency/coins-plain-stack-gold-yellow.webp',
    'dnd_fifth_item': null
  }

  static convert_dnd5e_currencies() {
    const players = this.player_characters()  
    if(players.length == 0) return 0

    const totalGoldValue = players.reduce((total, actor) => total + calculateGoldValue(actor), 0);
    
    return totalGoldValue.toFixed(2);
  }

  static count(type, item_names) {
    switch(type) {
      case 'dnd_fifth_gold':
        return this.convert_dnd5e_currencies();
      case 'dnd_fifth_item':
        // TODO: Might be an idea to access the dnd5e item pack through a
        // dropdown?
        //
        //   game.packs.get('dnd5e.items').index.forEach(item => {
        //     console.log(item)
        //   })
        //
        return this.count_player_items(item_names);
      default:
        return
    }
  }

  static count_player_items(names) {
    const items = this.getItemsFromNames(names);
    if (items == 0) return 0;
    
    return items.reduce((total, item) => total + (item?.system?.quantity || 1), 0);
  }

  static average_player_items(type, names) {
    if(isGoldResource(type)) {
      const characterNumber = this.player_characters().length;
      const avgGold = characterNumber > 0 ? this.convert_dnd5e_currencies() / characterNumber : 0;
      return Math.round(avgGold);
    }

    const items = this.getItemsFromNames(names);
    if (items == 0) return 0;

    const totalQuantity = items.map(i => i?.system?.quantity || 0).reduce((a, b) => a + b, 0);
    const avgQuantity = totalQuantity / items.length;
    return Math.round(avgQuantity);
  }

  static min_player_items(type, names) {
    if (isGoldResource(type)) {
      const players = this.player_characters();
      return Math.min(...players.map(actor => calculateGoldValue(actor)));
    }

    const items = this.getItemsFromNames(names);
    if (items == 0) return 0;

    return Math.min(...items.map(i => i?.system?.quantity || 0));
  }

  static max_player_items(type, names) {
    if (isGoldResource(type)) {
      const players = this.player_characters();
      return Math.max(...players.map(actor => calculateGoldValue(actor)));
    }

    const items = this.getItemsFromNames(names);
    if (items == 0) return 0;

    return Math.max(...items.map(i => i?.system?.quantity || 0));
  }
  
  static median_player_items(type, names) {
    if (isGoldResource(type)) {
      const players = this.player_characters();

      const goldValues = players.map(actor => calculateGoldValue(actor)).sort((a, b) => a - b);
      const mid = Math.floor(goldValues.length / 2);
      return goldValues.length % 2 !== 0 ? goldValues[mid] : (goldValues[mid - 1] + goldValues[mid]) / 2;
  }

    const items = this.getItemsFromNames(names);
    if (items == 0) return 0;
  
    const quantities = items.map(i => i?.system?.quantity || 0).sort((a, b) => a - b);
    const middle = Math.floor(quantities.length / 2);
  
    if (quantities.length % 2 === 0) {
      // Even number of items, return the average of the two middle numbers
      return (quantities[middle - 1] + quantities[middle]) / 2;
    } else {
      return quantities[middle];
    }
  }  

  static player_characters() {
    const folderId = game.settings.get('fvtt-party-resources', 'directory_id');

    return game.actors.filter((actor) => { return actor.type == 'character' && (!folderId || actor.folder?.id === folderId);})
  }

  static player_items(names) {
    return this.player_characters().map(actor => {
      return actor.collections.items.filter(item => {
        return names.includes(item.name)
      })
    }).flat(2)
  }

  static getItemsFromNames(names) {
    names = names.split(';').map((a) => a.trim());
    const items = this.player_items(names);
  
    return items.length == 0 ? 0 : items;
  }

}

function isGoldResource(type) {
  return type === 'dnd_fifth_gold';
}

  // Coin            CP        SP      EP      GP      PP
  // Copper (cp)     1         10      50      100     1,000
  // Silver (sp)     1/10      1       5       10      100
  // Electrum (ep)   1/50      1/5     1       2       20
  // Gold (gp)       1/100     1/10    1/2     1       10
  // Platinum (pp)   1/1,000   1/100   1/20    1/10    1
function calculateGoldValue(actor) {
  const { pp = 0, gp = 0, ep = 0, sp = 0, cp = 0 } = actor.system.currency || {};
  return pp * 10 + gp + ep * 0.5 + sp * 0.1 + cp * 0.01;
}

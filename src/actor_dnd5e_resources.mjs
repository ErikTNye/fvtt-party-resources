export default class ActorDnd5eResources {
  static icons = {
    'dnd_fifth_gold': 'icons/commodities/currency/coins-plain-stack-gold-yellow.webp',
    'dnd_fifth_item': null
  }

  static convert_dnd5e_currencies() {
    const player_characters = this.player_characters()
    if(player_characters.length == 0) return 0
    return player_characters
      .map((item) => { return this.convert_to_dnd5e_gold(item.system.currency) })
      .reduce((a,b) => { return a + b })
  }

  // Coin            CP        SP      EP      GP      PP
  // Copper (cp)     1         10      50      100     1,000
  // Silver (sp)     1/10      1       5       10      100
  // Electrum (ep)   1/50      1/5     1       2       20
  // Gold (gp)       1/100     1/10    1/2     1       10
  // Platinum (pp)   1/1,000   1/100   1/20    1/10    1
  static convert_to_dnd5e_gold(currency_object) {
    let total = 0.0
    total += currency_object.cp / 100.0
    total += currency_object.sp / 10.0
    total += currency_object.ep / 2.0
    total += currency_object.gp
    total += currency_object.pp * 10.0
    return total
  }

  static count(type, item_names) {
    switch(type) {
      case 'dnd_fifth_gold':
        return this.convert_dnd5e_currencies().toFixed(2)
      case 'dnd_fifth_item':
        // TODO: Might be an idea to access the dnd5e item pack through a
        // dropdown?
        //
        //   game.packs.get('dnd5e.items').index.forEach(item => {
        //     console.log(item)
        //   })
        //
        return this.count_player_items(item_names)
      default:
        return
    }
  }

  static count_player_items(names) {
    names = names.split(';').map((a) => { return a.trim() })
    const items = this.player_items(names)

    if(items.length == 0) return 0
    return items.reduce((total, item) => total + (item?.system?.quantity || 1), 0);
  }

  static average_player_items(names) {
    names = names.split(';').map((a) => a.trim());
    const items = this.player_items(names);

    if (items.length == 0) return 0;
    const totalQuantity = items.map(i => i?.system?.quantity || 0).reduce((a, b) => a + b, 0);
    return totalQuantity / items.length;
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
}

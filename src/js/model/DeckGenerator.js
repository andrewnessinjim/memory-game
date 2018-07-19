let deckGenerator = (function(){
  const DECK_MOBILE_ICONS = 'mobile_icons';
  const DECK_SIZE = 16;

  const availableDecks = {
    [DECK_MOBILE_ICONS]: {
      count: 380
    }
  };

  function* generator(deckName, count) {
    if(count % 2 != 0) {
      throw `Cannot create deck with ${count} cards. Only even numbered decks can be created`;
    }

    let upperLimit =  availableDecks[deckName].count;
    let urlPrefix = `images/decks/${deckName}/`;

    for(let i = 0; i < count/2; i++) {
      let num = Math.floor(Math.random() * upperLimit) + 1;
      const url = `${urlPrefix}${num.toString().padStart(4, '0')}.svg`;
      let card = new cards.Card(url, cards.STATE_CLOSED, num);
      yield card;
      yield card;
    }
  }

  return {
    DECK_MOBILE_ICONS: DECK_MOBILE_ICONS,
    DECK_SIZE: DECK_SIZE,
    generator: generator
  }
})();
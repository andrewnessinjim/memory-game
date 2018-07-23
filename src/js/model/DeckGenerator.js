/*
deckGenerator object exposes a generator function that can be used to generate cards.
It also exposes constants for deck names and deck size.
*/
let deckGenerator = (function(){
  //Only one deck and one deck size supported for now. Can be parameterized later.
  const DECK_MOBILE_ICONS = 'mobile_icons';
  const DECK_SIZE = 16;

  const availableDecks = {
    [DECK_MOBILE_ICONS]: {
      count: 380
    }
  };

  function* generator(deckName, count) {
    //Cards are matched in pairs. So we need even number of cards
    if(count % 2 != 0) {
      throw `Cannot create deck with ${count} cards. Only even numbered decks can be created`;
    }

    //Total number of cards in the deck
    let upperLimit =  availableDecks[deckName].count;

    //All cards of a deck are present in deckName directory
    let urlPrefix = `images/decks/${deckName}/`;

    //Each loop will generate 2 cards with same image. So looping half the number of cards
    for(let i = 0; i < count/2; i++) {
      let num = Math.floor(Math.random() * upperLimit) + 1;
      const url = `${urlPrefix}${num.toString().padStart(4, '0')}.svg`;
      let card1 = new cards.Card(url, cards.STATE_CLOSED, num);
      let card2 = new cards.Card(url, cards.STATE_CLOSED, num);
      yield card1;
      yield card2;
    }
  }

  return {
    DECK_MOBILE_ICONS: DECK_MOBILE_ICONS,
    DECK_SIZE: DECK_SIZE,
    generator: generator
  }
})();
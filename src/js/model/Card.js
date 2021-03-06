/*
cards object exposes a Card class which holds data related to a single card.
It also exposes 3 constants, to be used as the values for the state of the card:
  - STATE_CLOSED -> The card is not visible to the user.
  - STATE_WAITING -> The card is visible to the user, but may get closed later.
  - STATE_CORRECT_MATCH -> Card is matched correctly. It will stay open.
  - STATE_INCORRECT_MATCH -> Card is matched incorrctly. May get closed later.
 */
let cards = (function() {
  const
    STATE_CLOSED= 'STATE_CLOSED',
    STATE_WAITING= 'STATE_WAITING';
    STATE_CORRECT_MATCH = 'STATE_CORRECT_MATCH';
    STATE_INCORRECT_MATCH = 'STATE_INCORRECT_MATCH';

  let _url = Symbol('URL');
  let _state = Symbol('state');
  let _id = Symbol('id');
  let _index = Symbol('index');

  return {
    Card: class Card {
      constructor(url, state, id) {
        this[_url] = url;
        this[_state] = state;
        this[_id] = id;
      }

      getURL() {
        return this[_url];
      }

      getId() {
        return this[_id];
      }

      getIndex() {
        return this[_index];
      }

      setIndex(index) {
        this[_index] = index;
      }

      setState(state) {
        this[_state] = state;
      }

      getState(){
        return this[_state];
      }
    },

    STATE_CLOSED: STATE_CLOSED,
    STATE_WAITING: STATE_WAITING,
    STATE_CORRECT_MATCH: STATE_CORRECT_MATCH,
    STATE_INCORRECT_MATCH: STATE_INCORRECT_MATCH
  }
})();
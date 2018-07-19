let cards = (function() {
  const
    STATE_OPEN= 'state_open',
    STATE_CLOSED= 'state_closed',
    STATE_WAITING= 'state_waiting';

  let _url = Symbol('URL');
  let _state = Symbol('state');
  let _id = Symbol('id');

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

      setState(state) {
        this[_state] = state;
      }

      getState(){
        return this[_state];
      }
    },
    STATE_OPEN: STATE_OPEN,
    STATE_CLOSED: STATE_CLOSED,
    STATE_WAITING: STATE_WAITING
  }
})();
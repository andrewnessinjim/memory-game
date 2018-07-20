let controller = {
  cardClicked: function(cardId) {
    if(this.idle) {
      this.idle = false;
      gameEngine.cardClicked(cardId);
    }
  },
  /* Controller will set this flag to false when calling the game engine.
   * Game Engine will set this flag to true before returning.
   */
  idle: true
}
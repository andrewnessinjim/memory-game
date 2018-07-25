let util = {
  shuffle: function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  },

  removeAllChildren: function (parent) {
    while(parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  toDecimal: function(number, decimalPoints) {
    return parseFloat(number.toFixed(decimalPoints));
  },

  secsToMinSecs: function(seconds) {
    let minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    seconds = Math.floor(seconds - (minutes * 60)).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
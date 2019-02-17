function Card(value, suit) {

  let card;

  switch (value) {

    case 1:

      card = 'A';
      break;

    case 11:

      card = 'J';
      break;

    case 12:

      card = 'Q';
      break;

    case 13:

      card = 'K';
      break;

    default:

      card = '' + value;

  }

  return { card, value, suit };

}

module.exports = Card;

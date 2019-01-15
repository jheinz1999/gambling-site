function solver(hand) {

  if (checkRoyalFlush(hand))
    return 9;

  return 0;

}

function checkRoyalFlush(hand) {

  const suits = hand.map(card => card.suit);
  const cards = hand.map(card => card.value);

  if (cards.includes(1)) {

    const suit = suits[cards.indexOf(1)];

    for (let i = 10; i <= 13; i++) {

      if (cards.indexOf[i] !== -1 && suits[cards.indexOf(i)] === suit)
        continue;

      else
        return false;

    }

    return true;

  }

  return false;

}

module.exports = solver;

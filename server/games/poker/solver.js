function solver(hand) {

  if (checkRoyalFlush(hand))
    return 9;

  return 0;

}

function checkRoyalFlush(hand) {

  const straight = ['10', 'J', 'Q', 'K', 'A'];

  const suits = hand.map(card => card.suit);
  const cards = hand.map(card => card.card);

  const firstSuit = suits[0];

  return suits.every(suit => suit === firstSuit) && cards.every(card => straight.indexOf(card) !== -1);

}

module.exports = solver;

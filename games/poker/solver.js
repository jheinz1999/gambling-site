function solver(hand) {

  if (checkRoyalFlush(hand))
    return 9;

  if (checkStraightFlush(hand))
    return 8;

  if (checkFourKind(hand))
    return 7;

  if (checkFullHouse(hand))
    return 6;

  if (checkFlush(hand))
    return 5;

  if (checkStraight(hand))
    return 4;

  if (checkThreeKind(hand))
    return 3;

  if (checkTwoPair(hand))
    return 2;

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

function checkStraightFlush(hand) {

  if (checkStraight(hand)) {

    return checkFlush(hand);

  }

  else {

    return false;

  }

}

function checkStraight(hand) {

  const cards = hand.map(card => card.value);
  cards.sort().reverse();

  let checking = true;
  let startingIndex = 1;

  while (checking) {

    let count = 1;

    for (let i = startingIndex; i < startingIndex + 4; i++) {

      if (i === cards.length)
        return false;

      if (cards[i] + 1 !== cards[i - 1]) {

        startingIndex++;
        break;

      }

      count++;

    }

    if (count === 5)
      checking = false;

  }

  console.log('highest straight: starts w/ ', cards[startingIndex - 1]);
  return true;

}

function checkFlush(hand) {

  const suits = hand.map(card => card.suit);

  const counts = {

    'S': 0,
    'D': 0,
    'C': 0,
    'H': 0

  }

  for (let i = 0; i < suits.length; i++) {

    counts[suits[i]]++;

    if (counts[suits[i]] === 5)
      return true;

  }

  return false;

}

function checkFourKind(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 4)
      return true;

  }

  return false;

}

function checkThreeKind(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 3)
      return true;

  }

  return false;

}

function checkFullHouse(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};

  let threes = null, twos = null;

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 2 && cards[i] !== threes)
      twos = cards[i];

    if (cardCounts[cards[i]] === 3) {

      threes = cards[i];

      if (twos === threes)
        twos = null;

    }

  }

  return twos && threes;

}

function checkTwoPair(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};
  let pairCount = 0;

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 2)
      pairCount++;

    if (pairCount === 2)
      return true;

  }

  return false;

}

module.exports = solver;

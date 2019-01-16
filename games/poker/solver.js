function solver(hand) {

  const funcs = [checkRoyalFlush, checkStraightFlush, checkFourKind,
    checkFullHouse, checkFlush, checkStraight, checkThreeKind,
    checkTwoPair, checkPair, findHighCard]

  for (let i = 0; i < funcs.length; i++) {

    let result = funcs[i](hand);

    if (result)
      return result;

  }

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
        return null;

    }

    return {

      rank: 9

    };

  }

  return null;

}

function checkStraightFlush(hand) {

  if (checkFlush(hand)) {

    const straight = checkStraight(hand);

    if (straight) {

      return {

        rank: 8,
        value: straight.value

      }

    }

  }

  return null;

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
        return null;

      if (cards[i] + 1 !== cards[i - 1]) {

        startingIndex++;
        break;

      }

      count++;

    }

    if (count === 5)
      checking = false;

  }

  return {

    rank: 4,
    value: cards[startingIndex - 1]

  };

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
      return {

        rank: 5,
        value: findHighCard(hand, suits[i]).value

      };

  }

  return null;

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
      return {

        rank: 7,
        value: cards[i]

      };

  }

  return null;

}

function checkThreeKind(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};
  const threeValues = [];

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 3)
      threeValues.push(cards[i]);

  }

  if (threeValues.length) {

    let highest = 0;

    for (let i = 0; i < threeValues.length; i++) {

      if (threeValues[i] > highest)
        highest = threeValues[i];

    }

    return {

      rank: 3,
      value: highest

    };

  }

  return null;

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

  if (twos && threes) {

    return {

      rank: 6,
      value: threes,
      value2: twos

    }

  }

  return null;

}

function checkTwoPair(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};
  let pairs = [];

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 2)
      pairs.push[cards[i]];

    if (pairs.length === 2)
      return {

        rank: 2,
        value: pairs[0],
        value2: pairs[1]

      };

  }

  return null;

}

function checkPair(hand) {

  const cards = hand.map(card => card.value);

  const cardCounts = {};
  let pairCount = 0;

  for (let i = 0; i < cards.length; i++) {

    if (cardCounts[cards[i]])
      cardCounts[cards[i]]++;

    else
      cardCounts[cards[i]] = 1;

    if (cardCounts[cards[i]] === 2)
      return {

        rank: 1,
        value: cards[i]

      };

  }

  return null;

}

function findHighCard(hand, suit = null) {

  let highest = 0;

  for (let i = 0; i < hand.length; i++) {

    if (hand[i].value > highest) {

      if (suit && hand[i].suit !== suit)
        continue;

      highest = hand[i].value;

    }

  }

  return {

    rank: 0,
    value: highest

  }

}

module.exports = solver;

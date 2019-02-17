const solver = require('./solver');
const Card = require('../../cards/Card');

describe('poker solver', () => {

  it('should solve royal flush', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(11, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(10, 'H'));
    hand.push(new Card(13, 'H'));
    hand.push(new Card(1, 'H'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(9);

  });

  it('should solve straight flush', () => {

    let hand = [];

    hand.push(new Card(2, 'S'));
    hand.push(new Card(8, 'H'));
    hand.push(new Card(2, 'D'));
    hand.push(new Card(9, 'H'));
    hand.push(new Card(11, 'H'));
    hand.push(new Card(10, 'H'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(8);
    expect(solver(hand).value).toBe(12);

  });

  it('should solve four of a kind', () => {

    let hand = [];

    hand.push(new Card(2, 'S'));
    hand.push(new Card(8, 'H'));
    hand.push(new Card(2, 'D'));
    hand.push(new Card(9, 'H'));
    hand.push(new Card(2, 'H'));
    hand.push(new Card(10, 'H'));
    hand.push(new Card(2, 'C'));

    expect(solver(hand).rank).toBe(7);
    expect(solver(hand).value).toBe(2);

  });

  it('should solve full house', () => {

    let hand = [];

    hand.push(new Card(2, 'S'));
    hand.push(new Card(8, 'H'));
    hand.push(new Card(2, 'D'));
    hand.push(new Card(9, 'H'));
    hand.push(new Card(2, 'H'));
    hand.push(new Card(10, 'H'));
    hand.push(new Card(10, 'C'));

    expect(solver(hand).rank).toBe(6);
    expect(solver(hand).value).toBe(2);

  });

  it('should solve flush', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(3, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(5, 'H'));
    hand.push(new Card(7, 'H'));
    hand.push(new Card(1, 'H'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(5);
    expect(solver(hand).value).toBe(12);

  });

  it('should solve straight', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(2, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(5, 'H'));
    hand.push(new Card(3, 'H'));
    hand.push(new Card(1, 'D'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(4);
    expect(solver(hand).value).toBe(5);

  });

  it('should solve three of a kind', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(1, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(1, 'H'));
    hand.push(new Card(4, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(3);
    expect(solver(hand).value).toBe(4);

  });

  it('should solve two pair', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(1, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(6, 'H'));
    hand.push(new Card(4, 'H'));
    hand.push(new Card(3, 'D'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(2);
    expect(solver(hand).value).toBe(1);

  });

  it('should solve pair', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(7, 'H'));
    hand.push(new Card(4, 'D'));
    hand.push(new Card(6, 'H'));
    hand.push(new Card(4, 'H'));
    hand.push(new Card(3, 'D'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(1);
    expect(solver(hand).value).toBe(4);

  });

  it('should give high card', () => {

    let hand = [];

    hand.push(new Card(1, 'S'));
    hand.push(new Card(7, 'H'));
    hand.push(new Card(10, 'D'));
    hand.push(new Card(6, 'H'));
    hand.push(new Card(4, 'H'));
    hand.push(new Card(3, 'D'));
    hand.push(new Card(12, 'H'));

    expect(solver(hand).rank).toBe(0);
    expect(solver(hand).value).toBe(12);

  });

});

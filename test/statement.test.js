const {statement, invoiceLine, formatInvoiceLine} = require('../src/statement');
const fs=require('fs');

test('example statement', () => {
    const invoice = JSON.parse(fs.readFileSync('test/invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/plays.json', 'utf8'));
    expect(statement(invoice, plays)).toMatchSnapshot();
});


test('TestInvoiceLine', () => {
    const invoice = JSON.parse(fs.readFileSync('test/invoice.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/plays.json', 'utf8'));
    
   const expected = [
       {
         "amount": 65000,
         "perf":  {
           "audience": 55,
           "playID": "hamlet",
         },
         "play":  {
           "name": "Hamlet",
           "type": "tragedy",
         },
       },
       {
         "amount": 58000,
         "perf":  {
           "audience": 35,
           "playID": "as-like",
         },
         "play": {
           "name": "As You Like It",
           "type": "comedy",
         },
       },
       {
         "amount": 50000,
         "perf": {
           "audience": 40,
           "playID": "othello",
         },
         "play":  {
           "name": "Othello",
           "type": "tragedy",
         },
      },
     ]

   expect(invoiceLine(invoice.performances, plays)).toEqual(expected);
});

test('Format Invoice Line', () => {
    const customer = "BigCo"
    const volumeCredits = 47;
    const totalAmount = 173000;
   const input = [
       {
         "amount": 65000,
         "perf":  {
           "audience": 55,
           "playID": "hamlet",
         },
         "play":  {
           "name": "Hamlet",
           "type": "tragedy",
         },
       },
       {
         "amount": 58000,
         "perf":  {
           "audience": 35,
           "playID": "as-like",
         },
         "play": {
           "name": "As You Like It",
           "type": "comedy",
         },
       },
       {
         "amount": 50000,
         "perf": {
           "audience": 40,
           "playID": "othello",
         },
         "play":  {
           "name": "Othello",
           "type": "tragedy",
         },
      },
     ]

     let expected = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`

   expect(formatInvoiceLine(input, customer, volumeCredits, totalAmount)).toEqual(expected);
});

test('statement with new play types', () => {
    const invoice = JSON.parse(fs.readFileSync('test/invoice_new_plays.json', 'utf8'));
    const plays = JSON.parse(fs.readFileSync('test/new_plays.json', 'utf8'));
    expect(() => {statement(invoice, plays)}).toThrow(/unknown type/);
});

const format = new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
        minimumFractionDigits: 2 }).format;

function statement (invoice, plays) {
    let totalAmount = 0;
    
    let volumeCredits = 0;
    const invoiceResult = invoiceLine(invoice.performances, plays);
    volumeCredits = invoiceResult.reduce((totalCredits, item) => {
        totalCredits += Math.max(item.perf.audience - 30, 0);
        if ("comedy" === item.play.type) totalCredits += Math.floor(item.perf.audience / 5);
        return totalCredits;
    } ,0);

    totalAmount = invoiceResult.reduce((totalAmount, item) => {
        totalAmount+= item.amount;
        return totalAmount;
    } ,0);

    return formatInvoiceLine(invoiceResult, invoice.customer, volumeCredits, totalAmount);


}

function formatInvoiceLine(invoiceLines, customer, volumeCredits, totalAmount ) {
    let result = `Statement for ${customer}\n`;

    invoiceLines.forEach((item) => {
        result += ` ${item.play.name}: ${format(item.amount/100)} (${item.perf.audience} seats)\n`;
    })

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;

    return result;

}

function invoiceLine(invoicePerformances, plays) {

    const result = []
    for (let perf of invoicePerformances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

        result.push({
            perf,
            play,
            amount: thisAmount
        })
    }

    return result;
}

module.exports = {statement, invoiceLine, formatInvoiceLine};


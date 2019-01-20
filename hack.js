// async function weaken(ns, host) {
//     while (ns.getServerSecurityLevel(host) !== ns.getServerMinSecurityLevel(host)) {
//         await ns.weaken(host)
//     }
// }

async function growUntil(ns, host, amount) {
    let counter = 0;

    while (ns.getServerMoneyAvailable(host) <= amount) {
        counter++;
        await ns.grow(host);
    }

    return counter
}

async function hackUntil(ns, host, amount) {
    let counter = 0;

    while (ns.getServerMoneyAvailable(host) >= amount) {
        counter++;
        await ns.hack(host);
    }

    return counter
}

async function growFor(ns, host, amount) {
    for (let i = 0; i < amount; i++) {
        await ns.grow(host)
    }

    return amount;
}

async function hackFor(ns, host, amount) {
    for (let i = 0; i < amount; i++) {
        await ns.hack(host)
    }

    return amount;
}

const hackThreat = 0.002;
const growThreat = 0.004;

export async function main(ns) {
    const [host] = ns.args;
    // const maximum = ns.getServerMaxMoney(host);

    while (true) {
        const money = ns.getServerMoneyAvailable(host);
        let threat = 0;
        threat += hackThreat * await hackFor(ns, host, 5)
        threat += growThreat * await growUntil(ns, host, money)

        // grow some more so we have continously growing income
        threat += growThreat * await growFor(ns, host, 5);

        while (threat > 0) {
          threat -= await ns.weaken(host);
        }
    }
}

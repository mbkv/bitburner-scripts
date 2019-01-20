async function weaken(ns, host) {
    while (ns.getServerSecurityLevel(host) !== ns.getServerMinSecurityLevel(host)) {
        await ns.weaken(host)
    }
}

async function growUntil(ns, host, amount) {
    while (ns.getServerMoneyAvailable(host) <= amount) {
        await ns.grow(host);
    }
}

async function hackUntil(ns, host, amount) {
    while (ns.getServerMoneyAvailable(host) >= amount) {
        await ns.hack(host);
    }
}

async function growFor(ns, host, amount) {
    for (let i = 0; i < amount; i++) {
        await ns.grow(host)
    }
}

async function hackFor(ns, host, amount) {
    for (let i = 0; i < amount; i++) {
        await ns.hack(host)
    }
}

export async function main(ns) {
    const [host] = ns.args;
    // const maximum = ns.getServerMaxMoney(host);

    while (true) {
        await weaken(ns, host)
        await growFor(ns, host, 10)
        await hackFor(ns, host, 5)
    }
}
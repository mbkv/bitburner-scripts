import { NS } from "@ns";
import { range } from "src/utils";

interface Purchase {
  index: number;
  cost: number;
  type: "ram" | "cpu" | "level";
}

function purchaseUpgrade(ns: NS, item: Purchase) {
  switch (item.type) {
    case "ram":
      return ns.hacknet.upgradeRam(item.index);
    case "cpu":
      return ns.hacknet.upgradeCore(item.index);
    case "level":
      return ns.hacknet.upgradeLevel(item.index);
  }
}

function getAvailablePurchasesForNode(ns: NS, index: number): Purchase[] {
  return [
    {
      index,
      type: "ram",
      cost: ns.hacknet.getRamUpgradeCost(index),
    },
    {
      index,
      type: "cpu",
      cost: ns.hacknet.getCoreUpgradeCost(index),
    },
    {
      index,
      type: "level",
      cost: ns.hacknet.getLevelUpgradeCost(index),
    },
  ];
}

function getAvailablePurchases(ns: NS): Purchase[] {
  const purchases: Purchase[][] = [];

  for (const index of range(ns.hacknet.numNodes())) {
    purchases.push(getAvailablePurchasesForNode(ns, index));
  }

  return purchases.flat();
}

export async function main(ns: NS): Promise<void> {
  const purchases = getAvailablePurchases(ns);

  while (true) {
    const newNodeIndex = ns.hacknet.purchaseNode();
    if (newNodeIndex >= 0) {
      purchases.push(...getAvailablePurchasesForNode(ns, newNodeIndex));
    }

    purchases.sort((a, b) => a.cost - b.cost);

    while (purchaseUpgrade(ns, purchases[0])) {
      const purchase = purchases[0];

      switch (purchase.type) {
        case "level":
          purchase.cost = ns.hacknet.getLevelUpgradeCost(purchase.index);
          break;
        case "ram":
          purchase.cost = ns.hacknet.getRamUpgradeCost(purchase.index);
          break;
        case "cpu":
          purchase.cost = ns.hacknet.getCoreUpgradeCost(purchase.index);
          break;
      }
      purchases.sort((a, b) => a.cost - b.cost);
    }

    await ns.sleep(1000);
  }
}

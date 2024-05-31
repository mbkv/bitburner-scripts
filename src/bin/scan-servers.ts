import { NS } from "@ns";
import { parseArgs, ArgumentOptions } from "src/args";
import { scanServers } from "src/nsUtils";
import { table } from "src/utils";

const options = {
  all: { type: "none" },
  sort: { type: "single", parse: String },
} satisfies ArgumentOptions;

export async function main(ns: NS): Promise<void> {
  const [args] = parseArgs(options, ns.args);

  let servers = [...scanServers(ns)];

  if (!args.all) {
    servers = servers.filter((server) => ns.hasRootAccess(server));
  }

  const infos = servers.map((server) => {
    const info = ns.getServer(server);
    return {
      server,
      money: info.moneyAvailable ?? 0,
      maxMoney: info.moneyMax,
      ram: info.maxRam,
      threads: info.cpuCores,
      minDifficulty: info.minDifficulty ?? 0,
      difficulty: info.hackDifficulty ?? 0,
    };
  });

  const sortKey = args.sort as keyof (typeof infos)[0] | undefined;

  if (sortKey && sortKey in infos[0]) {
    ns.tprint(sortKey, infos[0][sortKey])
    infos.sort((a, b) => {
      return a[sortKey]! < b[sortKey]! ? -1 : a[sortKey] === b[sortKey] ? 0 : 1;
    });
  }

  ns.tprint("\n" + table(infos));
}

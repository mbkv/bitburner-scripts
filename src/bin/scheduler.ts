import { NS } from "@ns";
import { ArgumentOptions, parseArgs } from "src/args";
import { SERVER_FORTIFY_AMOUNT, SERVER_WEAKEN_AMOUNT } from "src/config";
import { scanServers, schedule } from "src/nsUtils";
import { assert, table } from "src/utils";

const options = {
  multiplier: {
    type: 'single',
    parse: Number,
    default: () => 1.2,
    aliases: ['--mult'],
  }
} satisfies ArgumentOptions;

export async function main(ns: NS): Promise<void> {
  const [args, extra] = parseArgs(options, ns.args);
  const host = extra[0];
  assert(
    typeof host === "string",
    `host must be a string, got ${typeof host}, ${host}`,
  );

  const hackTime = ns.getHackTime(host);
  const growTime = ns.getGrowTime(host);
  const weakenTime = ns.getWeakenTime(host);
  const hackPercent = ns.hackAnalyze(host);
  const neededGrowth =
    (1 / (1 - hackPercent)) ** Math.ceil(growTime / hackTime);
  const growPerHack = ns.growthAnalyze(host, neededGrowth) * args.multiplier;
  const securityPerHack = SERVER_FORTIFY_AMOUNT * (1 + growPerHack);
  const weakenPerHack =
    (securityPerHack / SERVER_WEAKEN_AMOUNT) * args.multiplier * (weakenTime / hackTime);

  const scriptRam = Math.max(
    ns.getScriptRam("hack.js"),
    ns.getScriptRam("grow.js"),
    ns.getScriptRam("weaken.js"),
  );

  let availableRam = 0;
  let threads = 0;
  for (const server of scanServers(ns)) {
    if (!ns.hasRootAccess(server)) {
      continue;
    }
    const currentRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    availableRam += currentRam;
    threads += currentRam / scriptRam;
  }
  const amountOfHacks = threads / (1 + growPerHack + weakenPerHack);
  ns.tprint(
    "\n" +
      table([
        {
          amountOfHacks,
          availableRam,
          scriptRam,
          hackPercent,
          neededGrowth,
          growPerHack,
          securityPerHack,
          weakenPerHack,
        },
      ]),
  );
  const hacks = Math.floor(amountOfHacks) - 5;
  const grows = Math.ceil(growPerHack * hacks);
  const weakens = Math.ceil(weakenPerHack * hacks);

  ns.tprint("\n" + table([{ hacks, grows, weakens }]));

  schedule(ns, "hack.js", ["--loop", host], hacks);
  schedule(ns, "grow.js", ["--loop", host], grows);
  schedule(ns, "weaken.js", ["--loop", host], weakens);
}

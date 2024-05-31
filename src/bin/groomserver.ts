import { NS } from "@ns";
import { ArgumentOptions, parseArgs } from "src/args";
import { SERVER_FORTIFY_AMOUNT, SERVER_WEAKEN_AMOUNT } from "src/config";
import { assert } from "src/utils";

const options = {} satisfies ArgumentOptions;

async function spamWeak(ns: NS, server: string) {
  let minSecurity = await ns.weaken(server);
  while (true) {
    await ns.sleep(100);
    const security = await ns.weaken(server);

    if (security === minSecurity) {
      return;
    }
    minSecurity = Math.min(minSecurity, security);
  }
}

async function growCycle(ns: NS, server: string) {
  let securityGrowth = 0;

  while (true) {
    while (securityGrowth < (SERVER_WEAKEN_AMOUNT / 2)) {
      await ns.sleep(100);
      await ns.grow(server);
      securityGrowth += SERVER_FORTIFY_AMOUNT * 2;
    }
    await ns.sleep(100);
    await ns.weaken(server);
    securityGrowth -= SERVER_WEAKEN_AMOUNT;
  }
}

export async function main(ns: NS): Promise<void> {
  const [, extraArgs] = parseArgs(options, ns.args);
  const host = extraArgs[0];
  assert(
    typeof host === "string",
    `Server must be a string, got "${typeof host}": ${host}`,
  );
  assert(ns.serverExists(host), `Server ${host} does not exist`);

  await spamWeak(ns, host);
  await growCycle(ns, host);
}

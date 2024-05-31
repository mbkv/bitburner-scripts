import { NS } from "@ns";
import { ArgumentOptions, parseArgs } from "src/args";
import { assert } from "src/utils";

const options = {
  loop: {
    type: 'none',
  }
} satisfies ArgumentOptions;

export async function main(ns: NS): Promise<void> {
  const [args, extra] = parseArgs(options, ns.args)
  const host = extra[0];
  assert(typeof host === 'string', `Host must be a string, got ${typeof host}, "${host}"`);

  if (args.loop) {
    while (true ) {
      await ns.weaken(host);
    }
  } else {
    await ns.weaken(host);
  }
}


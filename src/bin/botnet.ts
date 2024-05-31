import { NS } from "@ns";
import { ArgumentOptions, parseArgs } from "src/args";
import { schedule } from "src/nsUtils";
import { assert } from "src/utils";

const options = {
  threads: {
    type: "single",
    parse: Number,
    default: () => 1,
  },
  max: {
    type: "none",
  },
} satisfies ArgumentOptions;

export async function main(ns: NS): Promise<void> {
  const [args, extra] = parseArgs(options, ns.args);
  const script = extra[0];
  const scriptArgs = extra.slice(1);
  assert(typeof script === "string", "script must be a string");
  assert(ns.fileExists(script), `"${script}" script does not exist`);

  schedule(ns, script, scriptArgs, args.max ? Infinity : args.threads);
}

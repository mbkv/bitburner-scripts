import type { ScriptArg } from "@ns";

interface Argument<T = any> {
  type: "single" | "multiple" | "optional" | "none";
  aliases?: string[];
  parse?: (arg: ScriptArg) => T;
  default?: () => T;
}

export interface ArgumentOptions {
  [key: string]: Argument;
}

type ResolvedParse<T extends Argument> = T["parse"] extends Function
  ? T["default"] extends Function
    ? ReturnType<T["parse"]> | ReturnType<T["default"]>
    : ReturnType<T["parse"]> | undefined
  : T["default"] extends Function
    ? ScriptArg | ReturnType<T["default"]>
    : ScriptArg | undefined;

type ResolvedArgument<T extends Argument> = T["type"] extends "single"
  ? ResolvedParse<T>
  : T["type"] extends "multiple"
    ? ResolvedParse<T>[]
    : T["type"] extends "optional"
      ? ResolvedParse<T> | true
      : T["type"] extends "none"
        ? boolean
        : never;

type ResolvedArguments<T extends ArgumentOptions> = {
  [key in keyof T]: ResolvedArgument<T[key]>;
};

export function parseArgs<T extends ArgumentOptions>(
  options: T,
  args: ScriptArg[],
): [ResolvedArguments<T>, ScriptArg[]] {
  const resolved = {} as any;
  const extra: ScriptArg[] = [];
  const aliasMap = new Map<string, [string, Argument<any>]>();

  for (const [key, value] of Object.entries(options)) {
    aliasMap.set(`--${key}`, [key, value]);
    if (!value.parse) {
      value.parse = (identity) => identity;
    }

    if (value.aliases) {
      for (const alias of value.aliases) {
        aliasMap.set(alias, [key, value]);
      }
    }
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (typeof arg === "string" && aliasMap.has(arg)) {
      const [optionName, option] = aliasMap.get(arg)!;

      switch (option.type) {
        case "none":
          resolved[optionName] = true;
          break;
        case "single":
          i += 1;
          resolved[optionName] = option.parse!(args[i]);
          break;
        case "multiple":
          {
            const array = resolved[optionName] ?? [];
            resolved[optionName] = array;
            while (
              !aliasMap.has(args[i + 1] as string) &&
              args[i + 1] !== "--"
            ) {
              i += 1;
              array.push(option.parse!(args[i]));
            }
          }
          break;
        case "optional":
          if (!aliasMap.has(args[i + 1] as string)) {
            i += 1;
            resolved[optionName] = option.parse!(args[i]);
          } else {
            resolved[optionName] = true;
          }
          break;
      }
    } else if (arg === '--') {
      extra.push(...args.slice(i + 1));
      break;
    } else  {
      extra.push(arg);
    }
  }

  for (const [key, value] of Object.entries(options)) {
    if (!(key in resolved) && value.default) {
      resolved[key] = value.default();
    } else if (value.type === 'none' && !resolved[key]) {
      resolved[key] = false
    }
  }
  return [resolved, extra];
}


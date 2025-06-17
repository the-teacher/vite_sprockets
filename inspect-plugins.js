// inspect-plugins.js
import { resolveConfig } from "vite";

const config = await resolveConfig({}, "build");
const plugins = config.plugins;

for (const [i, plugin] of plugins.entries()) {
  console.log(`\n[${i}] Plugin: ${plugin.name}`);
  const hookNames = Object.keys(plugin).filter(
    (key) =>
      typeof plugin[key] === "function" &&
      !["name", "apply", "enforce"].includes(key)
  );
  console.log(`  Hooks: ${hookNames.join(", ")}`);
  if (plugin.enforce) console.log(`  Enforce: ${plugin.enforce}`);
  if (plugin.apply) console.log(`  Apply: ${plugin.apply}`);
}

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import builtins from "builtin-modules";

export default {
  input: "src/index.js",
  output: {
    file: "dist/index.js",
    format: "cjs",
    exports: "named",
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    json({ compact: true }),
  ],
  external: [...builtins, "ethers", "axios", /^defender-relay-client(\/.*)?$/],
};

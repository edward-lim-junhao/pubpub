// /** @type {import('tailwindcss').Config} */
// module.exports = {
// 	content: ["./src/**/*.{ts,tsx}"],
// 	theme: {
// 	  extend: {},
// 	},
// 	plugins: [],
//   }

const path = require("path");
const sharedConfig = require("ui/tailwind.config.js");
const packagePath = (id) => path.dirname(require.resolve(`${id}/package.json`));
const packageSource = (id) => path.join(packagePath(id), "src", "**/*.{ts,tsx}");

/** @type {import('tailwindcss').Config} */
module.exports = {
	presets: [sharedConfig],
	plugins: [require("@tailwindcss/forms")],
	content: ["./src/**/*.{ts,tsx}", packageSource("ui")],
};

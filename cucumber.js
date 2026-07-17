module.exports = {
  default: {
    paths: ["src/features/**/*.feature"],
    require: [
      "src/step_Definitions/**/*.ts",
      "src/hooks/**/*.ts"
    ],
    requireModule: [
      "ts-node/register"
    ],
    format: [
      "progress",
      "./src/reporters/allureReporter.ts"
    ]
  }
};
module.exports = {
  default: "--require-module ts-node/register --require-module tsconfig-paths/register --require src/step_Definitions/**/*.ts --require src/hooks/**/*.ts --format node_modules/allure-cucumberjs --format progress: src/features/**/*.feature"
};

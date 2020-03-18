const fs = require("fs");

const prettierOptions = JSON.parse(fs.readFileSync("./.prettierrc", "utf8"));

module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "allowImportExportEverywhere": false
  },
  "extends": ["airbnb-base", "prettier"],
  "env": {
    "mocha": true,
    "mongo": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "prettier/prettier": [2, prettierOptions],
    "filenames/match-regex": [2, "^[a-z0-9\-\.]+$"],
    "filenames/match-exported": 0,
    "filenames/no-index": 0,
    "prefer-arrow-callback": "off",
    "mocha/prefer-arrow-callback": "off",
    "mocha/handle-done-callback": "error",
    "mocha/no-sibling-hooks": "off",
    "mocha/no-identical-title": "error",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off",
    "no-console": "error",
    "no-param-reassign": "off",
    "max-len": "off",
    "linebreak-style": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "chai-friendly/no-unused-expressions": "error",
    "func-names": ["error", "never"],
    "quotes": ["error", "double"],
    "semi": ["error", "never"]
  },
  "plugins": [
    "prettier",
    "mocha",
    "chai-friendly",
    "filenames"
  ]
};

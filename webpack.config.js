const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'webworker',
  devtool: 'cheap-module-source-map',
  mode: 'production',
  plugins: [
    new Dotenv({
      path: './.env',
    }),
  ],
};

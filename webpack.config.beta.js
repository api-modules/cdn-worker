const Dotenv = require('dotenv-webpack');

module.exports = {
  target: 'webworker',
  devtool: 'cheap-module-source-map',
  mode: 'development',
  plugins: [
    new Dotenv({
      path: './.env.beta',
    }),
  ],
};

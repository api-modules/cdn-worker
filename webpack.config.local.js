const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  target: 'webworker',
  devtool: 'cheap-module-source-map',
  mode: 'development',
  plugins: [
    new Dotenv({
      path: './.env.local',
    }),
  ],
};

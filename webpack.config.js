const path = require("path");
const settings = require("./config/appSettings");
const webpack = require("webpack");
const processEnv = settings[process.env.AppSettings];

module.exports = {
  entry: "./server/main.ts",
  mode: process.env.AppSettings,
  target: "node",
  module: {
    rules: [
      {
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          {
            loader: "shebang-loader",
          },
        ],
        exclude: /node_modules/,
        test: /\.ts?$/,
      },
      {
        test: /node_modules\/*/,
        loader: "shebang-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.apiURI": JSON.stringify(processEnv.apiURI),
      "process.env.appURI": JSON.stringify(processEnv.appURI),
      "process.env.environment": JSON.stringify(processEnv.environment),
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "public"),
  },
};

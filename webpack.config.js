module.exports = {
  context: __dirname,
  entry: "./js/get_ripe.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  },
  devtool: "source-maps"
};

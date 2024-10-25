const path = require('path');

module.exports = {
  entry: './src/widget.tsx',
  output: {
    filename: 'widget.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Widget',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

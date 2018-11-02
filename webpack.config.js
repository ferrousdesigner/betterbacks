const webpack = require('webpack');
const pathLib = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: pathLib.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: {
        inline: false,
        contentBase: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader' 
        ]
      }
    ]
  },
  optimization:{
    minimize: false, // <---- disables uglify.
    // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
}

const path = require('path');
const { join } = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  output: {
    path: path.resolve(__dirname, './public/js/'),
    filename: 'svis.min.js',
  },
  module: {
    rules: [
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.js$/, loader: 'babel-loader' },
        { test: /\.css$/,
          use: [
            'vue-style-loader',
            { loader: 'css-loader', options: { sourceMap: false } },
          ],
        },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': join(__dirname, 'src'),
      vue$: 'vue/dist/vue.esm-bundler.js',
    },
  },
  plugins: [
    new VueLoaderPlugin()
  ],
};

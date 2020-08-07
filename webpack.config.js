const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {                                          // node.js syntax
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,                    // exclude tonnes of js objs
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: ['url-loader'],
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: './src/index.html'}
        ]),
        new ExtractTextPlugin('bundle.css')
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    performance: {hints: false},
    mode: 'development',
};
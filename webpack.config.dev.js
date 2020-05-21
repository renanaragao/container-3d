const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
        chunkFilename: 'js/chunk.js'
    },
    devServer: {
        inline: false
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        })
    ],
    module: {
        rules: [{
                test: /\.(js)$/,
                include: Path.resolve(__dirname, '../dist'),
                enforce: 'pre',
                loader: 'eslint-loader',
                options: {
                    emitWarning: true
                }
            },
            {
                test: /\.(js)$/,
                include: Path.resolve(__dirname, '../dist'),
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.styl$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader?sourceMap=true', 'postcss-loader', 'stylus-loader']
            }
        ]
    }
});
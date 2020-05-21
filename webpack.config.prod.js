const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    stats: 'errors-only',
    //   bail: fakse,
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/chunk.js'
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new Webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: 'bundle.css'
        })
    ],
    module: {
        rules: [{
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.styl$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader'
                ]
            }
        ]
    }
});
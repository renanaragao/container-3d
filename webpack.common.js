const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: Path.resolve(__dirname, 'main.js')
    },
    output: {
        path: Path.join(__dirname, './dist'),
        filename: 'js/[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: false
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    resolve: {
        alias: {
            '~': Path.resolve(__dirname, './dist')
        }
    },
    module: {
        rules: [{
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        },
        {
            test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ]
        }
        ]
    }
};
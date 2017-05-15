const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name]',
    disable: process.env.NODE_ENV === 'development'
});

module.exports = {
    entry: {
        'js/youtube.js': './src/js/main.js',
        'css/youtube.css': './src/sass/youtube.scss'
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname)
    },
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'eslint-loader',
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }],
                // use style-loader in development
                fallback: 'style-loader'
            })
        }]
    },
    plugins: [
        extractSass,
        new webpack.LoaderOptionsPlugin({
            test: /\.js$/,
            options: {
                eslint: {
                    failOnWarning: false,
                    failOnError: false,
                    fix: true,
                    configFile: './.eslintrc',
                    emitWarning: true
                },
            },
        }),
    ]
};

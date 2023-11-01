const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/js/China_map/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'js/bundle.js',
    },
    devServer: {
        static: {
            // * 设置静态资源路径
            directory: path.join(__dirname, '/src/')
        },
        compress: true,
        port: '8082',
        // open: true,
        hot: true
    },
    resolve: {
        alias:
        {
            "@": path.resolve(__dirname, 'src'),
        }
    },
    module: {
        rules: [
            // * css
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                type: 'asset/resource',
                generator: {
                    filename: "static/css/[name].[hash:6][ext]",
                },
            },
            // * json
            {
                test: /\.json$/,
                type: 'asset/resource',
                generator: {
                    filename: "static/json/[name].[hash:6][ext]",
                },
            },
            // * 字体
            {
                test: /\.(ttf|woff2|otf)$/,
                type: "asset/resource",
                generator: {
                    filename: "static/fonts/[name].[hash:6][ext]",
                },
            },
            // * 图片
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/image/[name].[hash:6][ext]',
                },
            },
        ]
    },
    plugins: [

        // html
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({ template: './src/index.html' }),

        // css
        new MiniCssExtractPlugin({
            filename: "static/css/global.css",
        }),

        // clean dist
        new CleanWebpackPlugin()
    ]
}
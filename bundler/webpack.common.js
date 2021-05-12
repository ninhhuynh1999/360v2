const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

//list file will export
let htmlPageNames = ['load360',"viewmodels"];
let multipleHtmlPlugins = htmlPageNames.map(name => {
  return new HtmlWebpackPlugin({
    template: `./src/pages/${name}/${name}.html`, // relative path to the HTML files
    filename: `${name}.html`, // output HTML files
    chunks: [`${name}`] // respective JS files
  })
});


module.exports = {
    entry: {
        index:path.resolve(__dirname, '../src/index.js'),
        load360:path.resolve(__dirname, '../src/pages/load360/main.js'),
        viewmodels:path.resolve(__dirname, '../src/pages/viewmodels/main.js'),
    },
    output:
    {
        //filename: 'bundle.[contenthash].js',
        filename:"[name].bundle.js",
        path: path.resolve(__dirname, '../dist'),
        publicPath: '',
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new HtmlWebpackPlugin({
           
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true,
            chunks:['index']
        }),
        new MiniCSSExtractPlugin()
    ].concat(multipleHtmlPlugins),
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    // 'resolve-url-loader',
                     MiniCSSExtractPlugin.loader,
                    'css-loader',
                    
                ],
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            },
        ]
        
    }
}

const path = require('path');
const devMode = process.env.NODE_ENV !== 'production'

const htmlWebPackPlugin = require('html-webpack-plugin') // 导入 在内存中自动生成index页面的插件 ，自动打包好的js文件追加入index中
const htmlPlugin = new htmlWebPackPlugin({
    template: path.join(__dirname, '../index.html'), // 源文件
    filename: 'index.html',  // 生成内存中首页的名称
    inject: false,
    minify: {//生产期间使用，直接设置为true，开发时设置为false
        // removeAttributeQuotes:true,//删除双引号
        removeComments: true,//删除注释
        collapseWhitespace: true,//压缩代码
        removeStyleLinkTypeAttributes: false,
        removeScriptTypeAttributes: false
    }
})


const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const miniCssExtractPlugin = new MiniCssExtractPlugin({
    // 这里的配置和webpackOptions.output中的配置相似
    // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
    filename: devMode ? 'static/css/[name].css' : 'static/css/[name].[hash].css',
    chunkFilename: devMode ? 'static/css/[id].css' : 'static/css/[id].[hash].css',
})


module.exports = {

    /*入口*/
    entry: path.join(__dirname, '../src/index.jsx'),
    plugins: [
        htmlPlugin,
        miniCssExtractPlugin,
    ],
    /*输出到dist目录，输出文件名字为bundle.js*/
    output: {
        path: path.join(__dirname, '../dist'),
        filename: devMode ? 'static/js/[name].bundle.js' : 'static/js/[name].[hash].js',
    },
   
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.(sass|less|css)$/,  // 可以打包后缀为sass/less/css的文件
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                            publicPath: './',
                            // publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
                            hmr: devMode, // 仅dev环境启用HMR功能
                        },
                    },
                    'css-loader'
                ],
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.(png|jpg|svg|gif|ico)?$/,
                use: [{
                    loader: 'url-loader',
                    options: { // 这里的options选项参数可以定义多大的图片转换为base64
                        fallback: "file-loader",
                        limit: 3 * 1024, // 表示小于10kb的图片转为base64,大于10kb的是路径
                        outputPath: 'static/img/', //定义输出的图片文件夹
                        name: '[name].[contenthash:8].[ext]'
                    }
                }],
                include: path.join(__dirname, '../src')
            },
            {
                test: /\.(eot|woff2?|ttf|woff)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: "static/font/",
                            outputPath: "static/font/"
                        }
                    }
                ],
                include: path.join(__dirname, '../src')
            },

        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [".js", ".jsx", ".json"],
        alias: {
            '@pages': path.join(__dirname, '../src/pages/'),
            '@components': path.join(__dirname, '../src/components/'),
            '@store': path.join(__dirname, '../src/store/'),
            '@assets': path.join(__dirname, '../src/assets/'),
            '@routers': path.join(__dirname, '../src/routers/'),
            '@hooks': path.join(__dirname, '../src/hooks/'),
            '@services': path.join(__dirname, '../src/services/')
        }
    },

};


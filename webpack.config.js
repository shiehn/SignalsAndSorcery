const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const BundleTracker = require('webpack-bundle-tracker');

module.exports = (env = {}) => {
    return {

        mode: env.prod ? 'production' : 'development',
        devtool: env.prod ? 'source-map' : 'eval-cheap-module-source-map',
        entry: path.resolve(__dirname, './src/main.ts'),
        output: {
            path: path.resolve(__dirname, './../static/dist'),
            // path: path.resolve(__dirname, './dist'),
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                    ]
                },
            ]
        },
        resolve: {
            extensions: ['.ts', '.js', '.vue', '.json'],
            alias: {
                'vue': '@vue/runtime-dom'
            }
        },
        plugins: [
            new VueLoaderPlugin(),
            new BundleTracker({
                filename: './webpack-stats.json',
                publicPath: '/static/dist/'
            })
        ],
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "\*"
            },
            hot: true,
            static: __dirname,
            devMiddleware: {
                index: true,
                mimeTypes: { "text/html": ["phtml"] },
                publicPath: 'http://0.0.0.0:8000/static/dist/',
                serverSideRender: true,
                writeToDisk: true,
            },
        }
    };
}
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withLess = require('@zeit/next-less');
const withSass = require('@zeit/next-sass');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './src/styles/antd-custom.less'), 'utf8')
);

module.exports = withPlugins(
  [
    withCSS,
    [
      withSass,
      {
        cssModules: true,
      },
    ],
    [
      withLess,
      {
        cssModules: false,
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables, // make your antd custom effective
          importLoaders: 0,
        },
        cssLoaderOptions: {
          importLoaders: 3,
          localIdentName: '[local]___[hash:base64:5]',
        },
      },
    ],
  ],
  {
    webpack: (config, { isServer }) => {
      // Make Ant styles work with less
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });
      }

      //   Support Monaco
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
          },
        },
      });

      config.plugins.push(
        new MonacoWebpackPlugin({
          // Add languages as needed...
          languages: [
            'javascript',
            'typescript',
            'json',
            'markdown',
            'css',
            'scss',
            'html',
            'python',
            'yaml',
          ],
          filename: 'static/[name].worker.js',
        })
      );

      return config;
    },
  }
);

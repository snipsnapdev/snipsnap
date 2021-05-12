const path = require('path');

const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: '@import "./src/styles/mixins.scss", "./src/styles/variables.scss";',
  },
  images: {
    domains: [
      'avatars0.githubusercontent.com',
      'avatars1.githubusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.inline.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.url.svg$/,
      issuer: /\.\w+(?<!(s?c|sa)ss)$/i,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: 512,
            publicPath: '/_next/static/images',
            outputPath: 'static/images',
            fallback: require.resolve('file-loader'),
          },
        },
        {
          loader: require.resolve('svgo-loader'),
          options: {
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        },
      ],
    });

    return config;
  },
};

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  release: process.env.npm_package_version,
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
const config =
  process.env.SENTRY_ENABLED === 'true'
    ? withSentryConfig(nextConfig, SentryWebpackPluginOptions)
    : nextConfig;
module.exports = config;

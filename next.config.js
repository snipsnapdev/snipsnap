const path = require('path');

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: '@import "./src/styles/mixins.scss", "./src/styles/variables.scss";',
  },
  images: {
    domains: ['avatars0.githubusercontent.com', 'avatars1.githubusercontent.com'],
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

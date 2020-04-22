module.exports = (config) => {
  config.module.rules = [
    // process scss files
    {
      test: /\.(css|scss)$/,
      exclude: /\/(node_modules)\//,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: {
              getLocalIdent: require('react-dev-utils/getCSSModuleLocalIdent'),
            },
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              require('postcss-normalize')(),
            ],
          },
        },
        require.resolve('sass-loader'),
      ],
    },
    ...config.module.rules,
  ];
  return config;
};

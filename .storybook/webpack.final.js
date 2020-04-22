module.exports = (config) => {
  config.module.rules = [
    // process scss files
    {
      test: /\.scss$/,
      exclude: /\/(node_modules)\//,
      use: [
        require.resolve('style-loader'),
        require.resolve('css-loader'),
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
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './libs/ng-mocks/src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist/libs/ng-mocks/'),
    filename: 'index.js',
    library: {
      type: 'umd',
    },
  },
  externals: /^@angular\//,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, './libs/ng-mocks/tsconfig.json'),
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.cjs', '.mjs', '.ts', '.json'],
  },
};

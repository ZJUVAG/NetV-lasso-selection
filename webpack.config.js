const path = require('path');

module.exports = {
    entry: './netv-lasso-selection',
    devtool: 'inline-source-map',
    output: {
        filename: 'netv-lasso-selection.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
    },
};
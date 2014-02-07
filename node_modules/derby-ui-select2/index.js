var config = {
  filename: __filename,
  ns: 'select2',
  scripts: {
    validate: require('./select')
  }
};

module.exports = function (app, options) {
  app.createLibrary(config, options);
};
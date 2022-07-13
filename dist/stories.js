var importAll = function importAll(r) {
  return r.keys().map(r);
};

importAll(require.context("./", true, /\.story\.js$/));
routerFiles = {
  src: [
    'src/common.js',
    'src/resolve.js',
    'src/templateFactory.js',
    'src/urlMatcherFactory.js',
    'src/urlRouter.js',
    'src/state.js',
    'src/view.js',
    'src/viewScroll.js',
    'src/viewDirective.js',
    'src/extraViewDirective.js',
    'src/stateDirectives.js',
    'src/stateFilters.js'
  ],
  testUtils: [
    'test/testUtils.js',
    'sample/vendor/jquery-1.11.1.min.js'
  ],
  test: [
    'test/*Spec.js',
    'test/compat/matchers.js'
  ],
  angular: function(version) {
    return [
      'lib/angular-' + version + '/angular.js',
      'lib/angular-' + version + '/angular-mocks.js'
    ].concat(version === '1.2.14' ? ['lib/angular-' + version + '/angular-animate.js'] : []);
  }
};

if (exports) {
  exports.files = routerFiles;
}

/*jshint globalstrict: true*/ 'use strict';

var splunkCliLib = require('splunk-cli-lib'),
    configuration = splunkCliLib.configuration,
    splunkEnvironment = splunkCliLib.environment,
    splunkWatchConfig = splunkCliLib.watchConfig;

module.exports = function(grunt) {
  // Verify environment
  if (!splunkEnvironment.splunkHome()) {
    grunt.fail.fatal('Could not locate splunk home directory');
  }

  // Verify configuration
  var splunkConfig = configuration.get();
  if (!splunkConfig) {
    grunt.fail.fatal(
      'Could not load configuration for current Splunk instance. Use `splunk-cli configure`.' +
      'If `splunk-cli` is not available install it with `npm install splunk-cli`.');
  }

  // Set splunk application
  splunkConfig.splunkApp = 'intro_wf_demo';

  // Watch config. Launch jshint for all changed JS files
  var watchConfig = {
    js: {
      files: ['<%= "<" + "%= jshint.files %" + ">" %>'],
      tasks: ['jshint']
    }
  };

  // Add watch configuration for splunk app (reload splunk)
  watchConfig = splunkWatchConfig.watchForApp(watchConfig, splunkConfig.splunkApp);

  // Initialize Splunk config
  grunt.config.init({
    splunk: splunkConfig,
    jshint: {
      files: ['Gruntfile.js', 'django/intro_wf_demo/static/intro_wf_demo/**/*.js'],
      options: {
        ignores: ['django/intro_wf_demo/static/intro_wf_demo/bower_components/**/*'],
        globals: {
          console: true,
          module: true,
          require: true,
          process: true,
          Buffer: true,
          __dirname: true
        }
      }
    },
    watch: watchConfig
  });

  // Load grunt-splunk
  grunt.loadNpmTasks('grunt-splunk');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['watch']);
};

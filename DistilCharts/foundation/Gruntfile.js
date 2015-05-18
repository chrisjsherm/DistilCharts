module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    browserSync: {
        dev: {
            bsFiles: {
                src: [
                    '../css/*.css',
                    '../**/*.cshtml',
                    '../scripts/app.js'
                ]
            },
            options: {
                watchTask: true,
                proxy: 'localhost:59359'
            }
        }
    },

    copy: {
        customJS: {
            expand: true,
            filter: 'isFile',
            flatten: true,
            src: [
                'js/**.js'
            ],
            dest: '../scripts/',

            // Copy if file does not exist.
            filter: function (filepath) {
                // NPM load file path module. 
                var path = require('path');

                // Construct the destination file path.
                var dest = path.join(
                  grunt.config('copy.customJS.dest'),
                  path.basename(filepath)
                );

                // Return false if the file exists.
                return !(grunt.file.exists(dest));
            },
        },

        vendorJS: {
            expand: true,
            cwd: 'bower_components/',
            src: ['**/*.js'],
            dest: '../Scripts/',
        },
    },

    concat: {
        options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
        },
        dist: {
            // the files to concatenate
            src: ['../scripts/foundation/js/vendor/jquery.js',
            '/scripts/foundation/js/vendor/fastclick.js',
            '/scripts/highcharts/highcharts.js',
            '/scripts/highcharts/exporting.js',
            '/scripts/app.js'],
            // the location of the resulting JS file
            dest: '../scripts/vendor.js'
        }
    },

    sass: {
        options: {
            includePaths: ['bower_components/foundation/scss']
        },
        dist: {
            options: {
                outputStyle: 'nested'
            },
            files: {
                '../css/app.css': '../scss/app.scss'
            }
        }
    },

    watch: {
        grunt: { files: ['Gruntfile.js'] },
        sass: {
            files: '../scss/**/*.scss',
            tasks: ['sass', 'concat']
        }
    }
  });

  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('build', ['sass', 'copy', 'concat']);
  grunt.registerTask('default', ['browserSync:dev', 'watch']);
}

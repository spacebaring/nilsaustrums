module.exports = function (grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        shell: {
            options: {
                stdout: true
            },
            server: {
                command: 'hugo server --buildDrafts --watch'
            },
            build: {
                command: 'hugo -d dist/'
            }
        },
        imagemin: { // Task

            dynamic: { // Another target
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'static/images/', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'dist/images/' // Destination path prefix
      }]
            }
        },


        autoprefixer: {
            dist: {
                src: 'static/css/main.css',
                dest: 'static/css/main.css'
            }

        },

        sass: {
            dev: {
                paths: ['scss/'],
                src: ['scss/main.scss'],
                dest: 'static/css/main.css'
            },
            dist: {
                paths: ['scss/'],
                src: ['scss/main.scss'],
                dest: 'static/css/main.css',
            }
        },
        uglify: {
            options: {
                /*        sourceMap: true,
                        sourceMapIn: 'static/js/main.js.map'*/
                mangle: {
                    except: ['jquery.min.js']
                }
            },
            dist: {
                src: 'static/js/**.js',
                dest: 'static/js/main.min.js'
            }
        },
        watch: {
            options: {
                atBegin: true,
                livereload: true
            },
            sass: {
                files: ['scss/*.scss'],
                tasks: 'sass:dev'
            },

            /*     all: {
                     files: ['Gruntfile.js'],
                     tasks: 'dev'
                 }*/
        },
        open: {
            devserver: {
                path: 'http://localhost:1313'
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: {
                tasks: ["watch", "shell:server"]
            },
            build: {

            }
        },
        useminPrepare: {
            options: {
                dest: 'dist'
            },
            html: 'dist/index.html'
        },
        usemin: {
            html: ['dist/index.html']
        },
        copy: {
            html: {
                src: 'dist/index.html',
                dest: 'dist/index.html'
            }
        },
        clean: {
            dist: ["dist/"]
        },


        'gh-pages': {
            options: {
                base: 'dist'
            },
            dist: {
                src: '**/*'
            }
        }

    });

    grunt.registerTask('serve', ['concurrent:dev', 'env:server', 'open:devserver']);
    grunt.registerTask('build', ['sass:dist', 'autoprefixer:dist', 'clean:dist', 'shell:build', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin', 'imagemin:dynamic']);
    grunt.registerTask('deploy', ['build', 'gh-pages:dist']);
};

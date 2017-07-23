//require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks
module.exports = function(grunt) {
    grunt.initConfig({
        "clean":{
            clean: ['temp', 'spbdt_build']
        },
        // Include the screen HTML files in script tags in index.html
        "include_file": {
            default_options: {
                cwd: 'src/',
                src: ['index.html'],
                dest: 'spbdt_build/'
            }
        },
        // Transpile the javascript resources.
        "babel": {
            options: {
                sourceMap: true,
                getModuleId: function(x) {return x.replace(/^\/src\/resources\/js/, '.')},
                babelrc: true,
                ignore: ['resources/js/lib/','resources/js/extend/']
            },
            files: {
                expand: true,
                cwd: 'src/resources',
                src: ['**/*.js'],
                dest: 'temp/resources',
            },
        },
        "concat": {
            options: {
                banner: '//// Build for SmousProBetaDeluxeTycoon ////\n',
            },
            dev: {
                src: [
                    'src/resources/js/extend/*.js',
                    'temp/resources/js/SPBDT/SPBDT.js',
                    'temp/resources/js/SPBDT/backend.js',
                    'temp/resources/js/screens/*.js',
                    'temp/resources/js/knockout/bindings/*.js',
                    'temp/resources/js/knockout/bindinghandlers.js',
                    'temp/resources/js/main.js',
                ],
                dest: 'temp/resources/js/sp.js',
                options: {
                    sourceMap: true,
                },
            },
        },
        "less": {
            dist: {
                options: {
                    strictMath: true,
                },
                files: {
                    'temp/resources/css/spbdt.css': 'src/resources/css/spbdt.less',
                },
                // files: {
                //     cwd: 'src/',
                //     src: ['resources/css/spbdt.less'],
                //     dest: 'temp/resources/css/spbdt.css',
                // },
            },
        },
        // Copy the css and image resources
        "copy": {
            main: {
                expand: true,
                cwd: 'src',
                src: ['resources/fonts/*', 'resources/img/*', '**/*.py', 'resources/css/*'],
                dest: 'spbdt_build/'
            },
            temp: {
                expand: true,
                cwd: 'temp',
                src: ['**/*.js', '**/*.map', '**/*.css'],
                dest: 'spbdt_build/'
            },
        },
    });
    // Default task
    grunt.registerTask('default', ['clean', 'include_file', 'babel', 'concat', 'less', 'copy']);

    // Load up tasks
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-include-file');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
};
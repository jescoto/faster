module.exports = function(grunt) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var fullDate = month + "-" + day + "-" + year;

    grunt.initConfig({
        processhtml: {
            options: {
                templateSettings: {
                    interpolate: /{{([\s\S]+?)}}/g
                },
                data: {
                    localUrl: "localhost:5555",
                    cssVersion: "7-22-2017",
                    jsVersion: "7-22-2017",
                    unbundled: true,
                    strip: true
                }
            },
            dev: {
                files: {
                    'public/index.html': ['build/build.html']
                }
            },
            dist: {
                files: {
                    'public/index.html': ['build/build.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-processhtml');
    grunt.registerTask('default', ['processhtml:dist']);

    // dev mode
    grunt.registerTask("dev", ['processhtml:dev']);

};
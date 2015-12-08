module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        vars: {
            root: "./",
            src: "src/",
            dist: "dist/"
        },
        clean: {
            options: { force: true, noWrite: true },
            dist: {
                src: ["<%= vars.dist %>/**/*"]
            },
            cleanupDist: {
                src: ["<%= vars.dist %>/*.ts"]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= vars.src %>",
                        src: ["ngChosen.css", "spinner.gif", "ngChosen.ts"],
                        dest: "<%= vars.dist %>"
                    }
                ]
            }
        },
        watch: {
            options: {
                cwd: "<%= vars.src %>"
            },
            scripts: {
                files: "**/*.ts",
                tasks: ["ts:debug"]
            }
        },
        connect: {
            debug: {
                options: {
                    port: 8080,
                    base: '<%= vars.root %>',
                    livereload: true,
                    keepalive: false,
                    useAvailablePort: true,
                    open: true
                }
            }
        },
        ts: {
            options: {
                target: "ES5",
                removeComments: false,
                references: [
                    "<%= vars.root %>/typings/**/*.d.ts"
                ]
            },
            debug: {
                src: ["<%= vars.src %>/*.ts"]
            },
            dist: {
                options: {
                    sourceMap: false,
                    fast: "never"
                },
                files: [{ src: ["<%= vars.dist %>/*.ts"], dest: "<%= vars.dist %>/" }]
            }
        },
        ngAnnotate: {
            default: {
                expand: true,
                cwd: '<%= vars.dist %>',
                src: ['**/*.js'],
                dest: '<%= vars.dist %>'
            }
        },
        uglify: {
            options: {
                beautify: false
            },
            default: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= vars.dist %>",
                        src: ["**/*.js"],
                        dest: "<%= vars.dist %>",
                        ext: ".min.js"
                    }
                ]
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            default: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= vars.dist %>",
                        src: ["**/*.css"],
                        dest: "<%= vars.dist %>",
                        ext: ".min.css"
                    }
                ]
            }
        }
    });

    grunt.registerTask("debug", [
        "ts:debug",
        "connect:debug",
        "watch"
    ]);

    grunt.registerTask("build", [
        "clean:dist",
        "copy:dist",
        "ts:dist",
        "uglify",
        "cssmin",
        "clean:cleanupDist"
    ]);
};
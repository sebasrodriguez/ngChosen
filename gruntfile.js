module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
        vars: {
            root: "./",
            src: "src/",
            dist: "dist/"
        },
        watch: {
            options: {
                cwd: "<%= vars.src %>"
            },
            scripts: {
                files: "**/*.ts",
                tasks: ["ts"]
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
            release: {
                options: {
                    removeComments: true,
                    sourceMap: false,
                    fast: "never"
                },
                files: [{ src: ["<%= vars.src %>/*.ts"], dest: "<%= vars.dist %>/" }]
            }
        }
    });

    grunt.registerTask("debug", [
        "ts:debug",
        "connect:debug",
        "watch"
    ]);

    grunt.registerTask("build", [
        "ts:release"
    ]);
};
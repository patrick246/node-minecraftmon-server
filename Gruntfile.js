'use strict';

module.exports = function (grunt)
{
	require('jit-grunt')(grunt);

	var swaggerDefinitionFile = 'http://localhost:8080/swagger.json';
	var swaggerUIURL = 'http://localhost:8080/swagger-ui';

	grunt.initConfig({
		clean: {
			dist: ['dist/**/*.*'],
			testDist: ['testDist/**']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'app/**/*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/**/*.js']
			}
		},
		copy: {
			dist: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'app/',
						dest: 'dist/',
						src: [
							'**/*.json'
						]
					}
				]
			},
			swaggerUI: {
				files: [
					{
						expand: true,
						dot: true,
						cwd: 'node_modules/swagger-ui/dist',
						src: '**',
						dest: 'dist/swagger-ui/'
					}
				]
			}
		},
		sed: {
			swaggerURL: {
				path: 'dist/swagger-ui/index.html',
				pattern: 'url = "http://petstore.swagger.io/v2/swagger.json";',
				replacement: 'url = "' + swaggerDefinitionFile + '";'
			},
			swaggerAPIKey1: {
				path: 'dist/swagger-ui/index.html',
				pattern: '"api_key", key, "query"',
				replacement: '"X-Token", key, "header"'
			},
			swaggerAPIKey2: {
				path: 'dist/swagger-ui/index.html',
				pattern: '"api_key", apiKeyAuth',
				replacement: '"X-Token", apiKeyAuth'
			}
		},
		'swagger-docs': {
			api: {
				src: ['app/**/*.js'],
				dest: 'dist/swagger.json'
			}
		},
		nodemon: {
			server: {
				script: 'dist/index.js',
				options: {
					watch: ['dist/'],
					callback: function (nodemon)
					{
						nodemon.on('config:update', function ()
						{
							setTimeout(function ()
							{
								require('open')(swaggerUIURL);
							}, 1000);
						});
					},
					delay: 1500
				}
			}
		},
		watch: {
			scripts: {
				files: ['app/**/*.js'],
				tasks: ['default'],
				options: {
					spawn: true
				}
			}
		},
		concurrent: {
			server: {
				tasks: ['nodemon:server', 'watch:scripts'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['testDist/**/*.js']
			}
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: "app/",
						src: "**/*.js",
						dest: "dist/"
					}
				]
			},
			test: {
				files: [
					{
						expand: true,
						cwd: "test/",
						src: "**/*.js",
						dest: "testDist/"
					}
				]
			}
		}
	});

	grunt.registerTask('default',
		[
			'test',
			'build'
		]
	);

	grunt.registerTask('build',
		[
			'clean:dist',
			'jshint',
			'copy:dist',
			'babel:dist',
			'copy:swaggerUI',
			'sed:swaggerURL',
			'sed:swaggerAPIKey1',
			'sed:swaggerAPIKey2',
			'swagger-docs'
		]
	);

	grunt.registerTask('monitor',
		[
			'build',
			'concurrent:server'
		]
	);

	grunt.registerTask('test',
		[
			'jshint',
			'clean:testDist',
			'babel:dist',
			'babel:test',
			'mochaTest'
		]
	);
};
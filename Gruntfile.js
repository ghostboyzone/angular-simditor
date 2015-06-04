'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
	app: 'tests',
	dist: 'dist'
  };

  grunt.loadNpmTasks('grunt-connect-proxy');

  grunt.loadNpmTasks('grunt-injector');

  // Define the configuration for all the tasks
  grunt.initConfig({

	// Project settings
	yeoman: appConfig,

	injector: {
	    options: {
	    	ignorePath: 'tests',
	    	addRootSlash: false
	    },
	    local_dependencies: {
	        files: {
	            '<%= yeoman.app %>/index.html': ['tests/**/*.js', 'tests/**/*.css'],
	        }
	    }
	},

	// Watches files for changes and runs tasks based on the changed files
	watch: {
	  bower: {
		files: ['bower.json'],
		tasks: ['wiredep']
	  },
	  js: {
		files: ['<%= yeoman.app %>/{,*/}*{,*/}*.js'],
		tasks: ['injector','newer:jshint:all'],
		options: {
		  livereload: '<%= connect.options.livereload %>'
		}
	  },
	  compass: {
		files: ['<%= yeoman.app %>/{,**/}**.{scss,sass}'],
		// files: ['<%= yeoman.app %>/styles/main.scss'],
		tasks: ['compass:server', 'autoprefixer']
	  },
	  gruntfile: {
		files: ['Gruntfile.js']
	  },
	  livereload: {
		options: {
		  livereload: '<%= connect.options.livereload %>'
		},
		files: [
		  '<%= yeoman.app %>/{,*/}*{,*/}*.html',
		  '.tmp/styles/{,*/}*.css',
		  '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
		]
	  },
	},

	// The actual grunt server settings
	connect: {
	  options: {
		port: 5000,
		// Change this to '0.0.0.0' to access the server from outside.
		hostname: 'localhost',
		livereload: 35728
	  },
	  livereload: {
		options: {
		  open: true,
		  middleware: function (connect) {
			return [
			  require('grunt-connect-proxy/lib/utils').proxyRequest,
			  connect.static('.tmp'),
			  connect().use(
				'/bower_components',
				connect.static('./bower_components')
			  ),
			  connect.static(appConfig.app)
			];
		  }
		}
	  },
	  test: {
		options: {
		  port: 9001,
		  middleware: function (connect) {
			return [
			  connect.static('.tmp'),
			  connect.static('test'),
			  connect().use(
				'/bower_components',
				connect.static('./bower_components')
			  ),
			  connect.static(appConfig.app)
			];
		  }
		}
	  },
	  dist: {
		options: {
		  open: true,
		  base: '<%= yeoman.dist %>'
		}
	  }
	},
	// Empties folders to start fresh
	clean: {
	  dist: {
		files: [{
		  dot: true,
		  src: [
			'.tmp',
			'<%= yeoman.dist %>/{,*/}*',
			'!<%= yeoman.dist %>/.git*'
		  ]
		}]
	  },
	  server: '.tmp',
	  styles: '.tmp/styles/scss'
	},

	// Add vendor prefixed styles
	autoprefixer: {
	  options: {
		browsers: ['last 1 version']
	  },
	  dist: {
		files: [{
		  expand: true,
		  cwd: '.tmp/styles/',
		  src: '{,*/}*.css',
		  dest: '.tmp/styles/'
		}]
	  }
	},

	// Automatically inject Bower components into the app
	wiredep: {
	  options: {
		cwd: '<%= yeoman.app %>'
	  },
	  app: {
		src: ['<%= yeoman.app %>/index.html'],
		ignorePath:  /\.\.\//
	  },
	  sass: {
		// src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
		src: ['<%= yeoman.app %>/styles/main.scss'],
		ignorePath: /(\.\.\/){1,2}bower_components\//
	  }
	},

	// Compiles Sass to CSS and generates necessary files if requested
	compass: {
	  options: {
		sassDir: '<%= yeoman.app %>/styles',
		cssDir: '.tmp/styles',
		generatedImagesDir: '.tmp/images/generated',
		imagesDir: '<%= yeoman.app %>/images',
		javascriptsDir: '<%= yeoman.app %>/scripts',
		fontsDir: '<%= yeoman.app %>/styles/fonts',
		importPath: './bower_components',
		httpImagesPath: '/images',
		httpGeneratedImagesPath: '/images/generated',
		httpFontsPath: '/styles/fonts',
		relativeAssets: false,
		assetCacheBuster: false,
		raw: 'Sass::Script::Number.precision = 10\n'
	  },
	  dist: {
		options: {
		  generatedImagesDir: '<%= yeoman.dist %>/images/generated'
		}
	  },
	  server: {
		options: {
		  debugInfo: true
		}
	  }
	},

	// Renames files for browser caching purposes
	filerev: {
	  dist: {
		src: [
		  '<%= yeoman.dist %>/scripts/{,*/}*.js',
		  '<%= yeoman.dist %>/styles/{,*/}*.css',
		  '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
		  '<%= yeoman.dist %>/styles/fonts/*'
		]
	  }
	},

	// Reads HTML for usemin blocks to enable smart builds that automatically
	// concat, minify and revision files. Creates configurations in memory so
	// additional tasks can operate on them
	useminPrepare: {
	  html: '<%= yeoman.app %>/index.html',
	  options: {
		dest: '<%= yeoman.dist %>',
		flow: {
		  html: {
			steps: {
			  js: ['concat', 'uglifyjs'],
			  css: ['cssmin']
			},
			post: {}
		  }
		}
	  }
	},

	// Performs rewrites based on filerev and the useminPrepare configuration
	usemin: {
	  html: ['<%= yeoman.dist %>/{,**/}*.html'],
	  css: ['<%= yeoman.dist %>/{,*/}*.css'],
	  options: {
		assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images']
	  }
	},

	// The following *-min tasks will produce minified files in the dist folder
	// By default, your `index.html`'s <!-- Usemin block --> will take care of
	// minification. These next options are pre-configured if you do not wish
	// to use the Usemin blocks.
	// cssmin: {
	//   dist: {
	//     files: {
	//       '<%= yeoman.dist %>/styles/main.css': [
	//         '.tmp/styles/{,*/}*.css'
	//       ]
	//     }
	//   }
	// },
	// uglify: {
	//   dist: {
	//     files: {
	//       '<%= yeoman.dist %>/scripts/scripts.js': [
	//         '<%= yeoman.dist %>/scripts/scripts.js'
	//       ]
	//     }
	//   }
	// },
	uglify: {
	  options: {
		mangle: false
	  }
	},
	// concat: {
	//   dist: {}
	// },

	imagemin: {
	  dist: {
		files: [{
		  expand: true,
		  cwd: '<%= yeoman.app %>/images',
		  src: '{,*/}*.{png,jpg,jpeg,gif}',
		  dest: '<%= yeoman.dist %>/images'
		}]
	  }
	},
	// imagemin: {
	//   dist: {
	//     files: [{
	//       expand: true,
	//       cwd: '<%= yeoman.app %>/images',
	//       src: '{,*/}*.{png,jpg,jpeg,gif}',
	//       dest: '<%= yeoman.dist %>/images'
	//     },
	//     {
	//       expand: true,
	//       cwd: 'bower_components/select2/',
	//       src: '{,*/}*.{png,jpg,jpeg,gif}',
	//       dest: '<%= yeoman.dist %>/images/select2'
	//     }]
	//   }
	// },
	
	svgmin: {
	  dist: {
		files: [{
		  expand: true,
		  cwd: '<%= yeoman.app %>/images',
		  src: '{,*/}*.svg',
		  dest: '<%= yeoman.dist %>/images'
		}]
	  }
	},

	htmlmin: {
	  dist: {
		options: {
		  collapseWhitespace: true,
		  conservativeCollapse: true,
		  collapseBooleanAttributes: true,
		  removeCommentsFromCDATA: true,
		  removeOptionalTags: true
		},
		files: [{
		  expand: true,
		  cwd: '<%= yeoman.dist %>',
		  src: ['*.html', 'views/{,*/}*{,*/}*.html'],
		  dest: '<%= yeoman.dist %>'
		}]
	  }
	},

	// ngmin tries to make the code safe for minification automatically by
	// using the Angular long form for dependency injection. It doesn't work on
	// things like resolve or inject so those have to be done manually.
	ngmin: {
	  dist: {
		files: [{
		  expand: true,
		  cwd: '.tmp/concat/scripts',
		  src: '*.js',
		  dest: '.tmp/concat/scripts'
		}]
	  }
	},

	// Replace Google CDN references
	cdnify: {
	  dist: {
		html: ['<%= yeoman.dist %>/*.html']
	  }
	},

	// Copies remaining files to places other tasks can use
	copy: {
	  dist: {
		files: [{
		  expand: true,
		  dot: true,
		  cwd: '<%= yeoman.app %>',
		  dest: '<%= yeoman.dist %>',
		  src: [
			'*.{ico,png,txt}',
			'.htaccess',
			'*.html',
			'views/{,*/}*{,*/}*.html',
			'images/{,*/}*.{webp}',
			'fonts/*'
		  ]
		}, {
		  expand: true,
		  cwd: '.tmp/images',
		  dest: '<%= yeoman.dist %>/images',
		  src: ['generated/*']
		}]
	  },
	  styles: {
		expand: true,
		cwd: '<%= yeoman.app %>/styles',
		dest: '.tmp/styles/',
		src: '{,*/}*.css'
	  }
	},

	// Run some tasks in parallel to speed up the build process
	concurrent: {
	  server: [
		'compass:server'
	  ],
	  test: [
		'compass'
	  ],
	  dist: [
		'compass:dist',
		'imagemin',
		'svgmin'
	  ]
	}
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
	if (target === 'dist') {
	  return grunt.task.run(['build', 'connect:dist:keepalive']);
	}

	grunt.task.run([
	  'clean:server',
	  'wiredep',
	  'concurrent:server',
	  'autoprefixer',
	  'clean:styles',
	  'injector',
	  'configureProxies:server',
	  'connect:livereload',
	  'watch'
	]);
  });

  grunt.registerTask('build', [
	'clean:dist',
	'wiredep',
	'useminPrepare',
	'concurrent:dist',
	'autoprefixer',
	'concat',
	'ngmin',
	'copy:dist',
	'cdnify',
	'cssmin',
	'uglify',
	'filerev',
	'usemin' //,
	// 'htmlmin'
  ]);

  grunt.registerTask('default', [
	'newer:jshint',
	'test',
	'build'
  ]);
};

pipeline {
	// Configure the Jenkins worker to build your application inside a docker container
	// This has the advantage of isolating your application from the rest of the worker
	// and also comes with node and npm pre-installed.
	agent {
		docker {
			// Tells Jenkins that this pipleline is run on the workers
			label 'worker'

			// This is the name of the image from the Docker registry. We use an image
			// with the long-term-support version of node/npm installed.
			image "node:lts-alpine"

			// Additional args to pass to the docker container. Important here is to
			// set --net=host, which exposes the host network to the container. This
			// is required for npm to be able to install from artifactory.
			args "--net=host"
		}
	}

	// Environment variables set for your build process.
	environment {
		// HOME is set to make npm install to the current directory rather than the
		// configured home directory. This is needed so that running npm install
		// will install packages into the container.
		HOME = '.'

		// Setting CI to true is used by several NPM processes to tell that it is
		// running in a continuous integration environment. Its typically set 
		// automatically by Jenkins, but we need to set it manually so that it gets
		// set inside the docker container.
		CI = 1
	}

	// Stages are a logical separation of tasks in your build process.
	stages {
		stage("Install") {
			steps {
				// Any NPM command that talks to the artifactory (i.e. anything 
				// involving a node module that starts with the @athena prefix)
				// needs to be wrapped in a withNPM block like the following.
				// This makes sure that the script has the right credentials.
				withNPM(npmrcConfig: 'RPR_NPMRC_V2') {
					// First run npm install to install your module's dependencies.
					// This differes from normal install in that it uses your 
					// package-lock.json file to make sure it installs the same
					// versions you use in development.
					sh(label: 'Install Node Modules', script: 'npm install')
				}
			}
		}

		stage("Validate") {
			steps {
				// Run linting to verify that your code matches your configured
				// es-lint rules.
				sh(label: "Lint Code", script: "npm run lint")

				// Run your unit tests
				sh(label: "Run Tests", script: "npm run test:ci")
			}
            post {
                always {
                    publishHTML (target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: false,
                        keepAll: true,
                        reportName: 'Code Coverage',
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html'
                    ])
                }
            }
		}

		stage("Build") {
			steps {
				// Build your application
				sh('label': "Build Project", script: "CI=false npm run build:prod")
                
				// Archive your built assets to Jenkins. This lets you download your
				// built assets from the build page, even if you're not publishing them.
				// Fingerprinting tells jenkins to index your built assets by their
				// MD5 checksum. This is useful for determining build integrity and
				// establishing which build an asset came from.
				archiveArtifacts(artifacts: 'build/**', fingerprint: true)
			}
		}

		stage("Publish") {        
			// We only publish applications to the CDN when they are built from the
			// master branch. This ensures that all production-destined code has the
			// appropriate signoffs. DO NOT PUBLISH FROM OTHER BRANCHES.
			when {
				branch 'release/*'
			}

			steps {
				// Uploads the contents of your build directory to the Nimbus CDN
			    sh(label: "Upload to Nimbus", script: "npm run upload")
			}
		}
	}

	// After all steps have run, clean up the workspace. This prevents files from
	// old builds fronm polluting subsequent builds. It is run in an always block
	// to make sure that this is run even if your build fails.
	post {
		always {
			cleanWs()
		}
	}
}
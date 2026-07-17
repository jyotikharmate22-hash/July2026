pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install') {
      steps {
        bat 'npm ci'
      }
    }
    stage('Install Playwright') {
      steps {
        bat 'npx playwright install --with-deps'
      }
    }
    stage('Test') {
      steps {
        bat 'npx cucumber-js'
      }
    }
    stage('Allure Report') {
      steps {
        bat 'npx allure generate .\\allure-results --clean -o .\\allure-report'
      }
    }
    stage('Publish Allure Report') {
      steps {
        allure includeProperties: false, results: [[path: 'allure-results']]
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'allure-report/**, allure-results/**', fingerprint: true
    }
  }
}

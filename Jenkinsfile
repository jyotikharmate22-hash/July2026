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
        bat 'node node_modules\\@cucumber\\cucumber\\bin\\cucumber-js'
      }
    }
    stage('Allure Report') {
      steps {
        bat 'allure generate allure-results --clean -o allure-report'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'allure-report/**, allure-results/**', fingerprint: true
    }
  }
}

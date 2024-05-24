 pipeline {
    agent any
    stages {
        stage('Pulling the latest code') {
            steps {
                sh """
                cd /home/ubuntu/mern/dropship-academy/ui
                git stash
                git pull
                """
            }
        }

        stage('install dependency') {
            steps {
                sh """
                cd /home/ubuntu/mern/dropship-academy/ui && npm install --legacy-peer-deps
                """
            }
        }

        stage('build and deploy') {
            steps {
                sh """
                cd /home/ubuntu/mern/dropship-academy/ui && npm run build
                """
            }
        }

    }
}

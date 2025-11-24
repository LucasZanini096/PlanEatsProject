pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Usa o checkout configurado no job
                checkout scm
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('backend/demo') {
                    sh './mvnw -B clean test'
                }
            }
            post {
                failure {
                    echo 'Build/Testes do backend falharam.'
                }
            }
        }

        stage('Build Frontend (Node)') {
            steps {
                dir('frontend/planeats-frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
            post {
                failure {
                    echo 'Build do frontend falhou.'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'backend/demo/target/*.jar, frontend/planeats-frontend/dist/**', allowEmptyArchive: true
            }
        }

        stage('Publish Test Reports') {
            steps {
                // Publica relatórios JUnit gerados pelo Maven
                junit testResults: 'backend/demo/target/surefire-reports/*.xml, backend/demo/target/failsafe-reports/*.xml'
            }
            post {
                always {
                    echo 'Relatórios processados.'
                }
            }
        }

        stage('Optional: Docker Compose (local)') {
            when {
                expression { fileExists('docker-compose.yml') }
            }
            steps {
                echo 'Arquivo docker-compose.yml encontrado; etapa comentada para segurança.'
                // Para ativar deploy com Docker, descomente a linha abaixo (requer agente com Docker):
                // sh 'docker compose -f docker-compose.yml up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Pipeline concluída com sucesso.'
        }
        failure {
            echo 'Pipeline falhou.'
        }
    }
}

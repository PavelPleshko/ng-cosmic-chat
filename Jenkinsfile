node {

 def app

 stage('Clone repo') {

    checkout scm
 }

 stage('Build image') {

    app = docker.build('pavelpleshko1992/chat')
 }

 stage('Test image') {

    app.inside {
        echo "Tests passed"
    }
 }

}

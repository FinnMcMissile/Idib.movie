  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAVJXA3JnuYmwuL8DF0SJNu90JMYWUNdQs",
    authDomain: "idib-movie.firebaseapp.com",
    databaseURL: "https://idib-movie.firebaseio.com",
    projectId: "idib-movie",
    storageBucket: "idib-movie.appspot.com",
    messagingSenderId: "49723698269",
    appId: "1:49723698269:web:d27cd5973d8483f5dc71b4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
var database = firebase.database();
const dubbersRef = database.ref().child('doppiatori');

const dubbersListUI = document.getElementById("dubbersList");
dubbersRef.on("child_added", snap => {
    let dubber = snap.val();
    let $li = document.createElement("li");
    $li.innerHTML = dubber.nome;
    dubbersListUI.append($li);
    console.log(dubber.nome);
    
});
var dubbersList = {
  nextPage : function() {}
};

( dubbersList => {

  var lastShown = null;
  const dubbersListUI = document.getElementById("dubbersList");
  dubbersListUI.innerHTML = "";

  function showPage(dubbersRef) {
      dubbersRef.on("value", snap => {
      snap.forEach(dubSnap => {
        var dubber = dubSnap.val();
        if (dubber.name == lastShown)
          return;
        $("#dubbersList").append(
          utils.render($('#dubber-template').html(), {
            name: dubber.name, 
            photo: dubber.photo ? utils.remoteURL(dubber.photo.name) : "images/no-dubber-photo.jpg",
            alt: dubber.photo ? dubber.photo.description : "nessuna immagine"
        }));
        lastShown = dubber.name;
      });
    });
  }

  dubbersList.nextPage = function() {
    const dubbersRef = database.ref().child('dubbers').orderByChild('name').startAt(lastShown).limitToFirst(11);
    showPage(dubbersRef);
  }

  var database = firebase.database();
  const dubbersRef = database.ref().child('dubbers').orderByChild('name').limitToFirst(10);
  showPage(dubbersRef);

})(dubbersList);
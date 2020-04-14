var dubbersList = {
  nextPage : function() {},
  search : function() {}
};

( dubbersList => {

  var lastShown = null;
  const dubbersListUI = document.getElementById("dubbersList");
  dubbersListUI.innerHTML = "";

  function showPage(dubbersRef, filter) {
    dubbersRef.on("child_added", snap => {
      var dubber = snap.val();
      if (filter && !dubber.name.toUpperCase().includes(filter.toUpperCase()))
        return;
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
}

  dubbersList.nextPage = function() {
    const dubbersRef = database.ref().child('dubbers').orderByChild('name').startAt(lastShown).limitToFirst(11);
    showPage(dubbersRef);
  }

  dubbersList.search = function() {
    var list = $("#dubbersList");
    $("#dubbersList")[0].innerHTML = "";
    var filter = $("#filter").val();
    const dubbersRef = database.ref().child('dubbers');
    showPage(dubbersRef, filter);
  }

  var database = firebase.database();
  const dubbersRef = database.ref().child('dubbers').orderByChild('name').limitToFirst(10);
  showPage(dubbersRef);

})(dubbersList);
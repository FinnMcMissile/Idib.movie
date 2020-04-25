var dubbers = {
  search : function(filter) {},
  clearFilter: function() {},
  PAGESIZE: 500,
  openDubber: function(dubberKey) {}
};

( dubbers => {

  dubbers.search = function(filter) {
    if (filter == "") return;

    dubbersList = fullDubbersList.filter( dubber => {
        return dubber.indexName.toUpperCase().includes(filter.toUpperCase()); 
    }); 
    dubbersGallery.refresh(dubbersList);
    $("#search").hide();
    $("#clearFilter").show();
  } 

  $("#clearFilter").hide();
  dubbers.clearFilter = function() {
    dubbersList = fullDubbersList;
      $("#search").show();
      $("#clearFilter").hide();
      $("#filter").val("");
      dubbersGallery.refresh(dubbersList);
  }

  dubbers.openDubber = function(dubberKey) {
    console.log("open dubber "+ dubberKey);
    window.location = "dubber-page.html?dubberKey=" + dubberKey;
  }

  function loadNextPage(lastLoaded) {
    const dubbersRef = database.ref().child('dubbers').orderByChild('indexName').startAt(lastLoaded).limitToFirst(dubbers.PAGESIZE);
    dubbersRef.once("value", snap => {
        snap.forEach( dubberSnap => {
            var dubber = dubberSnap.val();
            dubber.key = dubberSnap.key;
            if (dubber.indexName == lastLoaded)
                return;
            dubber.works = null;
            fullDubbersList.push(dubber);                    
            lastLoaded = dubber.indexName;
        });
        if (snap.numChildren() == dubbers.PAGESIZE)
            loadNextPage(lastLoaded);
        else {
          dubbersGallery.showLoading(false);
          sessionStorage.fullDubbersList = JSON.stringify(fullDubbersList);
          console.log("Stored a cached list of dubbers: " + fullDubbersList.length);
        }
    });
  }

  var fullDubbersList = [];
  var dubbersList = fullDubbersList;
  var dubbersGallery = new Gallery({
      idGalleryHost: "#dubbersGallery",
      renderItem: (dubber) => {
          return utils.render($('#dubber-template').html(), {
            name: dubber.name, 
            photo: dubber.photo ? utils.remoteURL(dubber.photo.name) : "images/no-dubber-photo.jpg",
            alt: dubber.photo ? dubber.photo.description : "nessuna immagine",
            key: dubber.key
        });            
      }
  });

  if (sessionStorage.fullDubbersList) {
    fullDubbersList = JSON.parse(sessionStorage.fullDubbersList);
    dubbersList = fullDubbersList;
    console.log("Using a cached list of dubbers: " + fullDubbersList.length);
    dubbersGallery.refresh(dubbersList);
  }
  else {
    var database = firebase.database();
    const dubbersRef = database.ref().child('dubbers').orderByChild('indexName').limitToFirst(dubbersGallery.PAGESIZE);
    dubbersGallery.showLoading(true);
    dubbersRef.once("value", snap => {
        var lastLoaded = null;
        snap.forEach( dubberSnap => {
            var dubber = dubberSnap.val();
            dubber.key = dubberSnap.key;
            dubber.works = null;
            fullDubbersList.push(dubber);
            lastLoaded = dubber.indexName;
        });
        dubbersGallery.refresh(dubbersList);
        loadNextPage(lastLoaded);
    })
  }


})(dubbers);
var dubbers = {
  search : function(filter) {},
  clearFilter: function() {}
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

  function loadNextPage(lastLoaded) {
    const dubbersRef = database.ref().child('dubbers').orderByChild('indexName').startAt(lastLoaded).limitToFirst(dubbersGallery.PAGESIZE + 1);
    dubbersRef.once("value", snap => {
        snap.forEach( dubberSnap => {
            var dubber = dubberSnap.val();
            if (dubber.indexName == lastLoaded)
                return;
            dubber.works = null;
            dubbersList.push(dubber);                    
            lastLoaded = dubber.indexName;
        });
        if (snap.numChildren() == dubbersGallery.PAGESIZE + 1)
            loadNextPage(lastLoaded);
        else {
          dubbersGallery.showLoading(false);
          console.log("dubbers: " + dubbersList.length)
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
            alt: dubber.photo ? dubber.photo.description : "nessuna immagine"
        });            
      }
  });

  var database = firebase.database();
  const dubbersRef = database.ref().child('dubbers').orderByChild('indexName').limitToFirst(dubbersGallery.PAGESIZE);
  dubbersGallery.showLoading(true);
  dubbersRef.once("value", snap => {
      var lastLoaded = null;
      snap.forEach( dubberSnap => {
          var dubber = dubberSnap.val();
          dubber.works = null;
          dubbersList.push(dubber);
          lastLoaded = dubber.indexName;
      });
      dubbersGallery.refresh(dubbersList);
      loadNextPage(lastLoaded);
  })

})(dubbers);
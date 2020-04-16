var moviesList = {
  };
  
( moviesList => {
    $("#moviesList")[0].innerHTML = "";

    function showPage(moviesRef) {
        var currMovie = 0;
        currRowId = null;
        moviesRef.on("child_added", snap => {
            var movie = snap.val();
            if (currMovie % 4 == 0) {
                var panelRow = $($('#movie-row-template').html());
                currRowId = "panel-row-" + (currMovie / 4);
                panelRow.attr("id", currRowId);
                $("#moviesList").append(panelRow);
            }
            $("#" + currRowId).append(
                utils.render($('#movie-template').html(), {
                    title: movie.italianTitle ? movie.italianTitle : movie.originalTitle, 
                    poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
                    alt: movie.poster ? movie.poster.description : "nessuna immagine"
                }));
            currMovie++;
        });
    }

    var database = firebase.database();
    const movieRef = database.ref().child('movies').orderByChild('italianTitle').limitToFirst(12);
    showPage(movieRef);
  
    // setTimeout(() => {
    //     var tpl = $('#movie-template');

    //     var currRowId = null;
    //     for (i = 0; i < 12; i++) {
    //         if (i % 4 == 0) {
    //             var panelRow = $($('#movie-row-template').html());
    //             currRowId = "panel-row-" + (i / 4);
    //             panelRow.attr("id", currRowId);
    //             $("#moviesList").append(panelRow);
    //         }
    //         $("#" + currRowId).append($('#movie-template').html());
    //     }
    // },500)

})(moviesList);
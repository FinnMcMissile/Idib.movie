var moviePage = {
    openDubber: function(dubberSource) {}
};

( moviePage => {

    moviePage.openDubber = function(dubberSource) {
        if (dubberSource == "")
            return;
        console.log("open dubber "+ dubberSource);
        window.location = "dubber-page.html?dubberSource=" + dubberSource;
    }

    showMovie = function(snap) {
        movie = snap.val();
        utils.showFormData({
            title: movie.italianTitle,
            director: movie.director,
            year: movie.year,
            poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
            posterDescription: movie.poster ? movie.poster.description : "Locandina del film",
            country: movie.country,
            originalTitle: movie.originalTitle,
            italianTitle: movie.italianTitle,
            production: movie.country + " " + movie.year,
            source: utils.remoteURL(movie.source)
        });

        movie.cast.forEach(member => {
            $("#movieCast").append(utils.render($('#movie-cast-member-template').html(), {
                dubber: (member.dubber && member.dubber.name) ? member.dubber.name : "",
                photo: (member.dubber && member.dubber.photo) ? utils.remoteURL(member.dubber.photo) : "images/no-dubber-photo.jpg",
                character: member.character,
                actor: member.actor ? member.actor : "",
                link: (member.dubber && member.dubber.source) ? "link" : "missing-link",
                dubberSource: (member.dubber && member.dubber.source) ? member.dubber.source : "",
            }));
        });
    }

    var movieKey  = utils.extractParamFromQueryString(location.search.substring(1), "movieKey");    
    console.log("opened movie "+ movieKey);

    var movieSource  = utils.extractParamFromQueryString(location.search.substring(1), "movieSource");    
    console.log("opened movie "+ movieSource);

    var database = firebase.database();

    if (movieKey != null) {
        database.ref().child(`movies/${movieKey}`).once("value", snap => {
            showMovie(snap);
        });
    } else {
        database.ref("movies").orderByChild("source").equalTo(movieSource).once("value", snap => {
            snap.forEach(movieSnap => {
                showMovie(movieSnap);
            });
        });
    }


})(moviePage);
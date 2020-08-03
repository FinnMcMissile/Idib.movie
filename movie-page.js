const tmdbCreditsTemplate = `
    <a class="tmdb-credits" target="blank">Riassunto del film tratto da TMDB</a>
`

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

    showMovie = function(movie) {
        utils.showFormData({
            title: movie.italianTitle,
            director: movie.director,
            year: movie.year ? movie.year : "",
            poster: movie.poster ? utils.remoteURL(movie.poster.name) : "images/no-movie-poster.jpg",
            posterDescription: movie.poster ? movie.poster.description : "Locandina del film",
            country: movie.country,
            originalTitle: movie.originalTitle,
            italianTitle: movie.italianTitle,
            production: movie.country,
            source: utils.remoteURL(movie.source)
        });

        if (movie.notes) {
            var notes = parseMarkdown(movie.notes[0]);
            for (n = 1; n < movie.notes.length; n++) {
                notes += parseMarkdown(movie.notes[n]);
            }
            $("#notes")[0].innerHTML = notes;
            $("#notes").click(function(){ utils.toggleEllipsis(this) });
        }

        tmdb.getOverview(movie.tmdbID, (overview) => {
            if (overview == "") return;

            $("#overview")[0].innerHTML = overview;
            var tmdbCredits = $(tmdbCreditsTemplate);
            tmdbCredits.attr("href", `https://www.themoviedb.org/movie/${movie.tmdbID}?language=it-IT`);
            $("#overview").click(function(){ utils.toggleEllipsis(this) });
            $(tmdbCredits).insertAfter("#overview");
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

        movie.additionalInfos.forEach(info => {
            $("#additionalInfos").append(utils.render($('#movie-additional-info-template').html(), {
                description: info.description,
                content: parseMarkdown(info.content)
            }));
        });

    }

    var movieSource  = utils.extractParamFromQueryString(location.search.substring(1), "movieSource");    
    console.log("opened movie "+ movieSource);

    var database = firebase.database();

    database.ref("originalData/movies").orderByChild("source").equalTo(movieSource).once("value", snap => {
        snap.forEach( movieSnap => {
            var movie = movieSnap.val();
            database.ref("additionalData/movies").orderByChild("source").equalTo(movieSource).once("value", addMovieDataSnap => {
                if (addMovieDataSnap) {
                    addMovieDataSnap.forEach(addDataSnap => {
                        addData = addDataSnap.val();
                        $.extend(true, movie, addData);
                    });
                }
                showMovie(movie);
            });
        });
    });

})(moviePage);
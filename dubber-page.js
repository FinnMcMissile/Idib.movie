var dubberPage = {
};

( dubberPage => {

    dubberPage.openMovie = function(movieSource) {
        if (movieSource == "")
            return;
        console.log("open dubber "+ movieSource);
        window.location = "movie-page.html?movieSource=" + movieSource;
    }

    showDubber = function(snap) {
        dubber = snap.val();

        utils.showFormData({
            name: dubber.name,
            photo: dubber.photo ? utils.remoteURL(dubber.photo.name) : "images/no-dubber-photo.jpg",
            photoDescription: dubber.photo ? (dubber.photo.description ? dubber.photo.description : `Foto di ${dubber.name}`) : "",
            source: utils.remoteURL(dubber.source),
            audioSample: dubber.audio ? utils.remoteURL(dubber.audio.name) : "",
            audioDescription: dubber.audio ? parseMarkdown(dubber.audio.description) : "Nessun audio disponibile" 
        });

        if (!dubber.audio) {
            $("#audioPlayer").hide();
            $("#noAudio").show();
        } else {
            $("#noAudio").hide();
        }

        dubber.works.forEach(work => {
            $("#dubberWorks").append(utils.render($('#dubber-work-template').html(), {
                movie: (work.movie && work.movie.title) ? work.movie.title : "",
                photo: (work.movie && work.movie.poster) ? utils.remoteURL(work.movie.poster) : "images/no-movie-poster.jpg",
                character: work.character,
                actor: work.actor ? work.actor : "",
                link: (work.movie && work.movie.source) ? "link" : "missing-link",
                movieSource: (work.movie && work.movie.source) ? work.movie.source : "",
            }));
        });
    }

    var dubberSource  = utils.extractParamFromQueryString(location.search.substring(1), "dubberSource");    
    console.log("opened dubber "+ dubberSource);

    var database = firebase.database();

    database.ref("originalData/dubbers").orderByChild("source").equalTo(dubberSource).once("value", snap => {
        snap.forEach( dubberSnap => {
            showDubber(dubberSnap);
        });
    });

})(dubberPage);
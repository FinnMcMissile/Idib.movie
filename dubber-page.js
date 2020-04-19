var dubberPage = {
};

( dubberPage => {

    var dubberSource  = utils.extractParamFromQueryString(location.search.substring(1), "dubberSource");    
    console.log("opened dubber "+ dubberSource);

    var database = firebase.database();

    dubberRef = database.ref("dubbers").orderByChild("source").equalTo(dubberSource);

    dubberRef.once("value", snap => {
        snap.forEach( dubberSnap => {
            dubber = dubberSnap.val();
            utils.showFormData({
                name: dubber.name,
                photo: dubber.photo ? utils.remoteURL(dubber.photo.name) : "images/no-dubber-photo.jpg",
                photoDescription: dubber.photo ? (dubber.photo.description ? dubber.photo.description : `Foto di ${dubber.name}`) : "",
                source: utils.remoteURL(dubber.source)
            });
        
        });
    });
})(dubberPage);
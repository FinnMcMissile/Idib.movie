const galleryRowTemplate = `
    <div class="gallery-row"></div>
`

const galleryTemplate = `
<div class="gallery-content" id="galleryContent"></div>
<div class="gallery-more-button" id="galleryMoreButton">
    Mostra altro 
    <div class="gallery-loading" id="gallery-loading">
        <img src="images/loading.gif" alt="">
    </div>
</div>
`

class Gallery {

    /*
    props {
        idGalleryHost: "#idGalleryHost",
        renderItem: function() {}
    }
    */
    constructor (props) {
        this.props = props;
        this.PAGESIZE = 16;
        this.ROWSIZE = 4;
        this.currItem = 0;
        var currRowId = null;
        $(this.props.idGalleryHost).append(galleryTemplate);
        $("#gallery-loading").hide();
        $("#galleryMoreButton").click(() => { this.showPage(); });
    };

    showPage() {
        var startItem = this.currItem; 
        for (var m = startItem; m < startItem + this.PAGESIZE; m++) {
            if (m >= this.itemsList.length) {
                this.noMore();
                break;
            }
            this.showItem(this.itemsList[m]);
        }
    }

    showItem(item) {
        if (this.currItem % this.ROWSIZE == 0) {
            var galleryRow = $(galleryRowTemplate);
            this.currRowId = "gallery-row-" + (this.currItem / this.ROWSIZE);
            galleryRow.attr("id", this.currRowId);
            $("#galleryContent").append(galleryRow);
        }
        $("#" + this.currRowId).append(this.props.renderItem(item));
        this.currItem++;
        if (this.currItem >= this.PAGESIZE)
            $("#galleryMoreButton").show();
    }

    noMore() {
        $("#galleryMoreButton").hide();
    }

    showLoading(show) {
        if (show) 
            $("#gallery-loading").show(); 
        else 
            $("#gallery-loading").hide();
    }

    refresh(itemsList) {
        this.currRowId = null;
        this.currItem = 0;
        this.itemsList = itemsList; 
        $("#galleryContent")[0].innerHTML = "";
        $("#galleryMoreButton").hide();
        this.showPage();
    }
}
  

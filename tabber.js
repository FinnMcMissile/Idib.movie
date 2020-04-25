var tabber = {

};
( tabber => {

    $('ul.tabber li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabber li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
    });

})(tabber)

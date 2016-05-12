var callback = function(){
	$('.item-skills').each(function(){
		newWidth = $(this).parent().width() * $(this).data('percent');
		$(this).width(0);
		$(this).animate({
			width: newWidth,
		}, 1000);
	});
	$('.icon-red').each(function(){
		height = $(this).height();
		$(this).animate({
			height: 14,
		}, 2000);
	});
};
$(document).ready(callback);

/**	@SHOW|HIDE PANEL
*************************************************** **/
jQuery("a.modifyAction").bind("click", function(e) {
	e.preventDefault();
	var href = jQuery(this).attr("href");

	// add & show overlay layer
	jQuery("body").append('<div id="whiteOverlay" onClick="closeProduct()"></div>');

	// scroll to object specified
	jQuery.scrollTo("#education", 1500);

	// add modification panel
	jQuery("#education").append('<div id="modifyPanel"><button id="closeButton"  onClick="closeProduct()"></button><div id="modifyPanel-content"></div></div>');

	// get & fill panel detail
	jQuery("#modifyPanel-content").empty().load(href, function(){
		if (document.location.protocol === 'file:') {
			console.log('file called');
		} else {
			console.log('not file');
		}
		// show detail panel
		jQuery("#modifyPanel").fadeIn(300);
	});
});

function clickEvent(parent, child){
	//Get object by id
	var obj = document.getElementById(child);
	var href = jQuery(obj).attr("href");

	// add & show overlay layer
	jQuery("body").append('<div id="whiteOverlay" onClick="closeProduct()"></div>');

	// scroll to object specified
	jQuery.scrollTo(parent, 1500);

	// remove element
	jQuery("#modifyPanel").remove();

	// add modification panel
	jQuery('#'+parent).append('<div id="modifyPanel"><button id="closeButton"  onClick="closeProduct()"></button><div id="modifyPanel-content"></div></div>');

	// get & fill panel detail
	jQuery("#modifyPanel-content").empty().load(href, function(){
		if (document.location.protocol === 'file:') {
			console.log('file called');
		} else {
			console.log('not file');
		}
		// show detail panel
		jQuery("#modifyPanel").fadeIn(300);
	});
}

function reactClickEvent(parent, child){
	//Get object by id
	var obj = document.getElementById(child);
	//var href = jQuery(obj).attr("href");

	// add & show overlay layer
	jQuery("body").append('<div id="whiteOverlay" onClick="closeProduct()"></div>');

	// scroll to object specified
	jQuery.scrollTo(parent, 1500);

	// remove element
	jQuery("#modifyPanel").remove();

	// add modification panel
	jQuery('#'+parent).append('<div id="modifyPanel"><button id="closeButton"  onClick="closeProduct()"></button><div id="modifyPanel-content"></div></div>');

	// get & fill panel detail
	jQuery("#modifyPanel").fadeIn(300);
}

function closeProduct(args) {
	jQuery("#modifyPanel").fadeOut(300);
	jQuery("#whiteOverlay").remove();
}

function getURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function allowModif(){
	var token = getURLParameter('token');
	return (token != undefined && token == 'allomodif9999') ? true : false;
}

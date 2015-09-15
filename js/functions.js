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
	jQuery("#modifyPanel").fadeIn(300);
}

function closeProduct(args) {
	jQuery("#modifyPanel").fadeOut(300);
	jQuery("#whiteOverlay").remove();
}

/*Modify home button event*/
//About me
//jQuery("#modif_aboutme").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("aboutme", "modif_aboutme");
//});
//
////Education
//jQuery("#modif_edu_add").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("education", "modif_edu_add");
//});
//
//jQuery("#modif_edu_remove").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_edu_remove");
//});
//
//jQuery("#modif_edu_change").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_edu_change");
//});
//
////Experience
//jQuery("#modif_exp_add").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("experiences", "modif_exp_add");
//});
//
//jQuery("#modif_exp_remove").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_exp_remove");
//});
//
//jQuery("#modif_exp_change").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_exp_change");
//});
//
////Contact
//jQuery("#modif_cont_add").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("contact", "modif_cont_add");
//});
//
//jQuery("#modif_cont_remove").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_cont_remove");
//});
//
//jQuery("#modif_cont_change").bind("click", function(e){
//	e.preventDefault();
//	console.log("modif_cont_change");
//});
//
////Skills
//jQuery("#modif_skills").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("skills", "modif_skills");
//});
//
////Languages
//jQuery("#modif_lang").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("languages", "modif_lang");
//});
//
////Hobbies
//jQuery("#modif_hob").bind("click", function(e){
//	e.preventDefault();
//	clickEvent("hobbies", "modif_hob");
//});
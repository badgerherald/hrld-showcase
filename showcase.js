(function(jQuery){
	jQuery.fn.hrld_showcase = function( options ){

		var settings = jQuery.extend({
			imgs: "img",
			container: this
		}, options);
		var caller = jQuery(this);
		var container = jQuery(settings.container, this);
		var imgs = jQuery(settings.imgs, this);
		var links = [];
		var imgs_length = 0;
		var clicked_id;

		showcase_build_gallery( container);
		imgs_length = showcase_init_label( imgs);

		imgs.click(function(event) {

			// clear up used variable
			showcase_flush();

			//disable scroll on html and body.
			jQuery('html body').css('overflow', 'hidden');

			// figure out which qualifying image was clicked
			clicked_id = showcase_find_clicked_id( jQuery(this));
			// build gallery
			showcase_add_imgs( clicked_id);

			// show gallery and first one in series
			jQuery('div.showcase-gallery li.showcase-gallery-img-'+clicked_id, container).show();
			jQuery('div.showcase-gallery', container).fadeIn(800);
			jQuery('span.gallery-pageNo', container).html(clicked_id + ' of ' + imgs_length);

			// make sure all the photos are loaded in
			jQuery('div.showcase-gallery li', container).load();

			// nav
			var nav_counter = clicked_id;
			jQuery('.showcase-previous', container).click(function() {
				if( nav_counter == 1){
					jQuery('.gallery-close-wrapper', container).click();
				}
				else{
					nav_counter--;
					jQuery('imgcontainer li.showcase-gallery-img-'+(nav_counter+1), container).fadeOut(300, function(){
						jQuery('li.showcase-gallery-img-' + nav_counter, container).fadeIn(300);
						jQuery('span.gallery-pageNo', container).html((nav_counter) + ' of ' + imgs_length);
					});
					
				}
			});

			jQuery('.showcase-next', container).click(function(event) {
				if( nav_counter == imgs_length)
					jQuery('.gallery-close-wrapper', container).click();
				else{
					nav_counter++;
					jQuery('imgcontainer li.showcase-gallery-img-'+(nav_counter-1), container).fadeOut(300, function(){
						jQuery('li.showcase-gallery-img-' + nav_counter, container).fadeIn(300);
						jQuery('span.gallery-pageNo', container).html((nav_counter) + ' of ' + imgs_length);
					});
					
				}
			});

		// close
			jQuery('imgwrapper, .gallery-close-wrapper', container).click(function(event) {
				jQuery('.showcase-gallery', container).fadeOut(600);
				jQuery('.showcase-gallery imgwrapper, .showcase-gallery nav', container).remove();
				jQuery('html body').css('overflow', 'scroll');
				return;
			});
			jQuery('.showcase-gallery imgwrapper imgcontainer li div', container).click(function(e){
				e.stopPropagation();
			})
			return;
		});//img.click

function showcase_init_label( imgs_l){

	// check for posts with no images.
	if( imgs_l.length <=0 ){
		links = '';
		return 0;
	}
	//if there is one image, then give it an index 1 via class
	if( imgs_l.length == 1){
		links = showcase_original_url(imgs_l.attr('src'));
		imgs_l.addClass('showcase-img');
		imgs_l.addClass('showcase-1');
	}else{
		imgs_l.each( function( index){
			links.push(showcase_original_url(jQuery(this).attr('src')));
			jQuery(this).addClass('showcase-img');
			jQuery(this).addClass('showcase-' + (index+1));
		});

	}

	return imgs.length;
}
function showcase_flush(){
	clicked_id = '';
	return;
}
function showcase_original_url( img_url){
	var ext = img_url.match(/(jpg|tiff|gif){1}/);
	return img_url.replace(/(\-{1}\d+x\d+(\-*\d*\.*\w*){1})/, '.'+ext[0]);
}
function showcase_find_clicked_id(img){

	var c = img.attr('class').split(/\s+/);
	for(var s in c){
		if( c[s].indexOf('showcase-img') < 0 && c[s].indexOf('showcase-') == 0)
			return (c[s].split('showcase-'))[1];
	}
}
function showcase_build_gallery( container){

	var galleryHTML = nav_wrapper = '';
	galleryHTML += "<div class='showcase-gallery'>";
	
	// close button
	galleryHTML += "<div class='gallery-close-wrapper'>";
	galleryHTML += "<button class=gallery-close><a></a></button>";
	galleryHTML += "</div>";


	galleryHTML += "</div>";

	container.append(galleryHTML);
	return;
}
function showcase_add_imgs( clicked_id){
	
	var img_wrapper = '';
	img_wrapper += "<imgwrapper>";
	img_wrapper += "<imgContainer style='max-height: "+ (jQuery(window).height())*0.8 + "; max-width: "+ (jQuery(window).width())*0.8 +";' >";
	img_wrapper += img_wrapper_urls(clicked_id);
	img_wrapper += "</imgContainer>";
	img_wrapper += "</imgwrapper>";
	img_wrapper += "<nav>"
	img_wrapper += "<span class='gallery-pageNo'>";
	img_wrapper += "</span>";
	img_wrapper += "<div class='showcase-previous'><i></i></div>";
	img_wrapper += "<div class='showcase-next'><i></i></div>";
	jQuery('.showcase-gallery').append(img_wrapper);
	return;

}
function img_wrapper_urls( clicked_id){
	if( imgs_length == 1)
		return "<ul><li class='showcase-gallery-img-1' style='max-height: "+ (jQuery(window).height())*0.8 + "; max-width: "+ (jQuery(window).width())*0.8 +";' ><img class='imgdisplay' src='" + links + "' /></li></ul>";
	else{
		var imgUrls = '<ul>', counter = 0;
		for (var i = 0; i < links.length; i++) {
			counter++;
			imgUrls += "<li class='showcase-gallery-img-" + (i+1)
			imgUrls += "' style='max-height: "+ (jQuery(window).height())*0.8 + "; max-width: "+ (jQuery(window).width())*0.8 +";' >";
			imgUrls += "<img class='imgdisplay' src='" + links[i] + "' /></li>";
		};
		imgUrls += '</ul>';
		return imgUrls;
	}

}

}
})(jQuery);

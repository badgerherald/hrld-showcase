var document = jQuery(document);
var links = [];
var imgs_length = 0;

jQuery(document).ready(function(){

	var post = jQuery('article.article-post');
	var imgs = jQuery("article.article-post img.wp-post-image, article.article-post img[class*='wp-image-']");

	//variables after click
	var clicked_id;

	// build gallery backbone
	hrld_showcase_build_gallery( jQuery('div#content'));

	// we need to label and get the urls of the images that
	// will be put into showcase.
	imgs_length = hrld_showcase_init_label(imgs);

	imgs.click(function(event) {

		// clear up used variable
		hrld_showcase_flush();

		// figure out which qualifying image was clicked
		clicked_id = hrld_showcase_find_clicked_id(jQuery(this));

		// build gallery
		hrld_showcase_add_imgs(clicked_id);

		// show gallery and first one in series
		jQuery('li.showcase-gallery-img-1').show();
		jQuery('div.showcase-gallery').fadeIn(800);

		// nav
		var nav_counter = 1;
		jQuery('.showcase-previous').click(function() {
			console.log('prev: '+ nav_counter);
			if( nav_counter == 1){
				jQuery('.gallery-close-wrapper').click();
			}
			else{
				nav_counter--;
				jQuery('imgcontainer li').fadeOut(300);
				jQuery('li.showcase-gallery-img-' + nav_counter).fadeIn(300);
			}
			console.log(' ' + nav_counter);
		});
		jQuery('.showcase-next').click(function(event) {
			console.log('next: '+nav_counter);
			if( nav_counter == imgs_length)
				jQuery('.gallery-close-wrapper').click();
			else{
				nav_counter++;
				jQuery('imgcontainer li').fadeOut(300);
				jQuery('li.showcase-gallery-img-' + nav_counter).fadeIn(300);
			}
			console.log(' ' + nav_counter);
		});

		// close
		jQuery('imgwrapper, .gallery-close-wrapper').click(function(event) {
			jQuery('.showcase-gallery').fadeOut(600);
			jQuery('.showcase-gallery imgwrapper, .showcase-gallery nav').remove();
			return;
		});
		jQuery('.showcase-gallery imgwrapper imgcontainer img').click(function(e){
			e.stopPropagation();
		})
		return;
	});
	
});

function hrld_showcase_init_label( imgs){

	// check for posts with no images.
	if( imgs.length <=0 ){
		links = '';
		return 0;
	}
	//if there is one image, then give it an index 1 via class
	if( imgs.length == 1){
		//links = hrld_showcase_original_url(imgs.attr('href'));
		links = hrld_showcase_original_url(imgs.attr('src'));
		imgs.addClass('showcase-img');
		imgs.addClass('showcase-1');
	}else{
		imgs.each( function( index){
			links.push(hrld_showcase_original_url(jQuery(this).attr('src')));
			jQuery(this).addClass('showcase-img');
			jQuery(this).addClass('showcase-' + (index+1));
		});

	}

	return imgs.length;
}
function hrld_showcase_flush(){
	clicked_id = '';
	return;
}
function hrld_showcase_original_url( img_url){
	var ext = img_url.match(/(jpg|tiff|gif){1}/);
	return img_url.replace(/(\-{1}\d+x\d+(\-*\d*\.*\w*){1})/, '.'+ext[0]);
}
function hrld_showcase_find_clicked_id(img){

	var c = img.attr('class').split(/\s+/);
	for(var s in c){
		if( c[s].indexOf('showcase-img') < 0 && c[s].indexOf('showcase-') == 0)
			return (c[s].split('showcase-'))[1];
	}
}
function hrld_showcase_build_gallery( container, clicked_id){

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
function hrld_showcase_add_imgs( clicked_id){
	var img_wrapper = '';
	img_wrapper += "<imgwrapper>";
	img_wrapper += "<imgContainer>";
	img_wrapper += img_wrapper_urls(clicked_id);
	img_wrapper += "</imgContainer>";
	img_wrapper += "</imgwrapper>";
	img_wrapper += "<nav>"
	img_wrapper += "<div class='showcase-previous'><i></i></div>";
	img_wrapper += "<div class='showcase-next'><i></i></div>";
	jQuery('.showcase-gallery').append(img_wrapper);
	return;

}
function img_wrapper_urls( clicked_id){
	if( imgs_length == 1)
		return '<ul><li class=\'showcase-gallery-img-' + '1' + '\'><img src='+ links+' /></li></ul>';
	else{
		var imgUrls = '<ul>', counter = 0;
		for (var i = clicked_id; i < links.length+1; i++) {
			counter++;
			imgUrls += '<li class=\'showcase-gallery-img-' + counter + '\'><img src='+ links[i-1]+' /></li>';
		};
		for (var j = 1 ; j < clicked_id; j++) {
			counter++;
			imgUrls += '<li class=\'showcase-gallery-img-' + counter + '\'><img src='+ links[j-1]+' /></li>';
		};
		imgUrls += '</ul>';
		return imgUrls;
	}

}




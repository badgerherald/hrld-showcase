var document = jQuery(document);
var links = [];
var imgs_length = 0;

jQuery(document).ready(function(){

	var post = jQuery('article.article-post');
	var imgs = jQuery("article.article-post img.wp-post-image, article.article-post img[class*='wp-image-']");

	//variables after click
	var clicked_id;

	// we need to label the images that
	// will be put into showcase.
	imgs_length = hrld_showcase_init_label(imgs);

	imgs.click(function(event) {

		// clear up used variable
		hrld_showcase_flush();

		// figure out which qualifying image was clicked
		clicked_id = hrld_showcase_find_clicked_id(jQuery(this));

		// build gallery

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
	links = '';
	imgs_length = '';
	clicked_id = '';

}
function hrld_showcase_original_url( img_url){
	return img_url.replace(/(\-{1}\d+x\d+)/, '');
}
function hrld_showcase_find_clicked_id(img){

	var c = img.attr('class').split(/\s+/);
	for(var s in c){
		if( c[s].indexOf('showcase-img') < 0 && c[s].indexOf('showcase-') == 0)
			return (c[s].split('showcase-'))[1];
	}
}
function hrld_showcase_build_gallery(){
	
}




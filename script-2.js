/**
*
*	taking care of the namespace issue with jquery and let the showcase plugin less harcoded.
*
*
*
*
*/


(function( jQuery ){
	var methods = {
		init : function(options) {
			
			settings = jQuery.extend({
				container: this,
				imgs: "img"
			}, options);


		},
		show : function( ) {    }, 
		hide : function( ) {  }, 
		update : function( content ) {  }
	};

	jQuery.fn.showcase = function(methodOrOptions) {
		
		// reads in options
		var settings;

		if ( methods[methodOrOptions] ) {
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			return methods.init.apply( this, arguments );	// Default to "init"
		} else {
			jQuery.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.showcase' );
		}


		var container = jQuery(settings.container, this);
		showcase_build_gallery();
		// are imgs pulled from the jquery selections or 
		// pulled in elsewhere
		var imgs = '';
		var links = [];
		if( typeof settings.imgs === 'string'){
			imgs = jQuery(settings.imgs, this);
			// TODO call function that parses through links.
			showcase_original_url

		}else if( typeof settings.imgs === 'object'){	// it is expected that the imgs argument is either a selector or a array of links
			links = imgs;
		}
		
		var imgs_length = showcase_init_label( links);
		var clicked_id;


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
		};
		function showcase_original_url( img_url){
			var ext = img_url.match(/(jpg|tiff|gif|jpeg|png){1}/);
			return img_url.replace(/(\-{1}\d+x\d+(\-*\d*\.*\w*){1})/, '.'+ext[0]);
		}
};


})( jQuery );
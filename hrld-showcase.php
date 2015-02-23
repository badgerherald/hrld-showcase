<?php

/*
Plugin Name: 	Hrld Showcase
Description: 	This is a wordpress plugin to support a lightbox-style display of all media attachment on a single page and author page.
Author: 		Badger Herald Web Department.
Author URI: 	http://badgerherald.com
License: 		Copyright (c) 2014 The Badger Herald
*/



function hrld_showcase_enqueue(){
	wp_register_style( 'hrld-showcase-style', '/wp-content/plugins/hrld-showcase/style.css' );	
	wp_register_script( 'hrld-showcase-script-class', '/wp-content/plugins/hrld-showcase/showcase.js', array( 'jquery' ));
	wp_register_script( 'hrld-showcase-init', '/wp-content/plugins/hrld-showcase/showcase-init.js', array( 'jquery', 'hrld-showcase-script-class' ));
}
add_action( 'wp_enqueue_scripts', 'hrld_showcase_enqueue' );

function hrld_showcase_enqueue_single(){
	if( is_single() ){
		wp_enqueue_style('hrld-showcase-style');
		wp_enqueue_script( 'hrld-showcase-script-class');
		wp_enqueue_script( 'hrld-showcase-init');

		/* // not sure how this would work if done this way...
		global $post;
		$image_urls = array();
		$images = get_children( array( 'post_parent' => $post->ID, 'post_type' => 'attachment', 'post_mime_type' => 'image'));
		if( !empty($images)){
			foreach( $images as $id => $image){
				echo 'id: '.$id;
				$image_urls['id'.$id] = wp_get_attachment_image_src($id, 'large');
			}
		}
		wp_localize_script( 'hrld-showcase-script', 'photo_links', $image_urls);

		*/ 

		

	}
} 
add_action( 'wp_enqueue_scripts', 'hrld_showcase_enqueue_single' );

/*
function hrld_showcase_enqueue_author(){

	if( is_author()){
		$images = get_children( array( 'post_parent' => $post->ID, 'post_type' => 'attachment', 'post_mime_type' => 'image'));
	}



	wp_localize_script( 'hrld-showcase-script', 'photo-links', '');
} add_action( 'wp_enqueue_scripts', 'hrld_showcase_enqueue_single' );

*/

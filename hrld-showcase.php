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
  	//wp_register_script( 'hrld-showcase-script-class', '/wp-content/plugins/hrld-showcase/showcase.js', array( 'jquery' ));
	//wp_register_script( 'hrld-showcase-script-class', '/wp-content/plugins/hrld-showcase/script-2.js', array( 'jquery' ));
	wp_register_script( 'hrld-showcase-script-class', '/wp-content/plugins/hrld-showcase/script-3.js', array( 'jquery' ));
	wp_localize_script('hrld-showcase-script-class', 'hrld_showcase', array(
		'ajaxurl' => admin_url('admin-ajax.php'),
	));
}
add_action( 'wp_enqueue_scripts', 'hrld_showcase_enqueue' );

function hrld_showcase_add_class_to_thumbnail($thumb, $post_id, $post_thumbnail_id) {
	if( is_single() ) 
		$thumb = str_replace('attachment-', 'wp-image-'.$post_thumbnail_id.' attachment-', $thumb);
	return $thumb;
}
add_filter('post_thumbnail_html','hrld_showcase_add_class_to_thumbnail', 20, 3);

function hrld_showcase_image_data_ajax() {
	$images = $_POST['images'];
	$args = array(
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => -1,
        'post__in' => $images,
        'orderby' => 'post__in'
    );

    $attachments = get_posts($args);
    $response = array();
    if ($attachments) {
    	foreach ($attachments as $attachment) {
    		$meta_data = wp_get_attachment_metadata($attachment->ID);
    		$response[] = array(
    			'alt' => get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ),
				'caption' => $attachment->post_excerpt,
				'description' => $attachment->post_content,
				'href' => get_permalink( $attachment->ID ),
				'src' => $attachment->guid,
				'title' => $attachment->post_title,
    			'ID' => $attachment->ID,
    			'width' => $meta_data['width'],
    			'height' => $meta_data['height']
    		);
    	}
    }

    $response = apply_filters('hrld_showcase_image_data', $response);

    $response = json_encode($response);

    header("Content-Type: application/json");
    echo $response;
    wp_die();
}
add_action('wp_ajax_hrld_showcase_image_data_ajax', 'hrld_showcase_image_data_ajax');
add_action('wp_ajax_nopriv_hrld_showcase_image_data_ajax', 'hrld_showcase_image_data_ajax');


/**
 * Filters post gallery generated 
 * 
 * @since 0.2
 * 
 * @param string $output
 * @param array $attr attributes defined in the shortcode
 * 
 * @return string filtered html output for the gallery. 
 */
function showcase_post_gallery($output = '', $attr) {
	$post = get_post();

    if ( isset( $attr['orderby'] ) ) {
        $attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
        if ( ! $attr['orderby'] ) {
            unset( $attr['orderby'] );
        }
    }
    $html5 = current_theme_supports( 'html5', 'gallery' );
    $atts = shortcode_atts( array(
        'order'      => 'ASC',
        'orderby'    => 'menu_order ID',
        'id'         => $post ? $post->ID : 0,
        'itemtag'    => $html5 ? 'figure'     : 'dl',
        'icontag'    => $html5 ? 'div'        : 'dt',
        'captiontag' => $html5 ? 'figcaption' : 'dd',
        'columns'    => 3,
        'size'       => 'thumbnail',
        'include'    => '',
        'exclude'    => '',
        'link'       => '',
        'ids'        => ''
    ), $attr, 'gallery' );
 
    $id = intval( $atts['id'] );
    if ( 'RAND' == $atts['order'] ) {
        $atts['orderby'] = 'none';
    }
    /*
    if ( ! empty( $atts['include'] ) ) {
        $_attachments = get_posts( array( 'include' => $atts['include'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
 
        $attachments = array();
        foreach ( $_attachments as $key => $val ) {
            $attachments[$val->ID] = $_attachments[$key];
        }
    } elseif ( ! empty( $atts['exclude'] ) ) {
        $attachments = get_children( array( 'post_parent' => $id, 'exclude' => $atts['exclude'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
    } else {
        $attachments = get_children( array( 'post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
    }
    */
   $_attachments = explode(",", $atts['ids']);
 
    if ( empty( $_attachments ) ) {
        return '';
    }
    /*
    $itemtag = tag_escape( $atts['itemtag'] );
    $captiontag = tag_escape( $atts['captiontag'] );
    $icontag = tag_escape( $atts['icontag'] );
    $valid_tags = wp_kses_allowed_html( 'post' );
    if ( ! isset( $valid_tags[ $itemtag ] ) ) {
        $itemtag = 'dl';
    }
    if ( ! isset( $valid_tags[ $captiontag ] ) ) {
        $captiontag = 'dd';
    }
    if ( ! isset( $valid_tags[ $icontag ] ) ) {
        $icontag = 'dt';
    }
 
    $columns = intval( $atts['columns'] );
    $itemwidth = $columns > 0 ? floor(100/$columns) : 100;
    $float = is_rtl() ? 'right' : 'left';
 
    $selector = "gallery-{$instance}";
 
    $gallery_style = '';
    */
 
    /**
     * Filter whether to print default gallery styles.
     *
     * @since 3.1.0
     *
     * @param bool $print Whether to print default gallery styles.
     *                    Defaults to false if the theme supports HTML5 galleries.
     *                    Otherwise, defaults to true.
     */
    /*
    if ( apply_filters( 'use_default_gallery_style', ! $html5 ) ) {
        $gallery_style = "
        <style type='text/css'>
            #{$selector} {
                margin: auto;
            }
            #{$selector} .gallery-item {
                float: {$float};
                margin-top: 10px;
                text-align: center;
                width: {$itemwidth}%;
            }
            #{$selector} img {
                border: 2px solid #cfcfcf;
            }
            #{$selector} .gallery-caption {
                margin-left: 0;
            }
            /* see gallery_shortcode() in wp-includes/media.php 
        </style>\n\t\t";
    }
    */
    /*
    $size_class = sanitize_html_class( $atts['size'] );
    // $gallery_div = "<div id='$selector' class='gallery galleryid-{$id} gallery-columns-{$columns} gallery-size-{$size_class}'>";
    $gallery_div = "<div id='slider'><div id='swipe' class='swipe'><div class='swipe-wrap'>";
    */
    /**
     * Filter the default gallery shortcode CSS styles.
     *
     * @since 2.5.0
     *
     * @param string $gallery_style Default gallery shortcode CSS styles.
     * @param string $gallery_div   Opening HTML div container for the gallery shortcode output.
     */
    //$output = apply_filters( 'gallery_style', $gallery_style . $gallery_div );
    $gallery_cover = intval($_attachments[0]);
    $output = '<div class="gallery-block">';
    $output .= wp_get_attachment_image($gallery_cover, 'image-post-size', false, array(
        'class'=>'showcase-thumb',
        'data-showcase-index' => '0'
    ));
    $output .= '<a href="#" class="open-gallery showcase-thumb" data-showcase-index="0">View Gallery ('.count($_attachments).' Photos)</a>';
    $output .= '</div>';
    $output .= '<script>';
    $output .= 'jQuery.fn.showcase.defaults.container = ".gallery-block";';
    $output .= 'jQuery.fn.showcase.defaults.images = new Array('.$_attachments[0];
    for ($i = 1; $i < count($_attachments); $i++)
    {
        $output .= ', '.$_attachments[$i];
    }
    $output .= ');';
    $output .= '</script>';
    /*
    $i = 0;
    foreach ( $attachments as $id => $attachment ) {
        if ( ! empty( $atts['link'] ) && 'file' === $atts['link'] ) {
            $image_output = wp_get_attachment_link( $id, $atts['size'], false, false );
        } elseif ( ! empty( $atts['link'] ) && 'none' === $atts['link'] ) {
            $image_output = wp_get_attachment_image( $id, $atts['size'], false );
        } else {
            $image_output = wp_get_attachment_link( $id, $atts['size'], true, false );
        }
        $image_output = wp_get_attachment_image( $id, 'image-post-size', false );
        $image_meta  = wp_get_attachment_metadata( $id );
 
        $orientation = '';
        if ( isset( $image_meta['height'], $image_meta['width'] ) ) {
            $orientation = ( $image_meta['height'] > $image_meta['width'] ) ? 'portrait' : 'landscape';
        }
        $output .= "<div class='slide'>";
        $output .= "<div class='slide-image'>";
        $output .= $image_output;
        //$output .= "
        //    <{$icontag} class='gallery-icon {$orientation}'>
        //        $image_output
        //    </{$icontag}>";
		$output .= "</div>";
        
        $output .= "<div class='slider-content'>";
        if (trim($attachment->post_excerpt) ) {
            $output .= "
                <p>
                " . wptexturize($attachment->post_excerpt) . "
                </p>";
        }
        $credit = get_hrld_media_credit($id);

		if ($credit != "") {
				if(get_user_by('login', $credit)){
				$hrld_user = get_user_by('login', $credit);
				$output .= "<span class='hrld-media-credit'><span class='hrld-media-credit-name'><a href='".get_bloginfo('url')."/author/$credit'>$hrld_user->display_name</a></span><span class='hrld-media-credit-org'>/The Badger Herald</span></span>"; 
			} else{
				$hrld_credit_name_org = explode("/", $credit);
				if($hrld_credit_name_org[1]){
					$output .= "<span class='hrld-media-credit'><span class='hrld-media-credit-name'>$hrld_credit_name_org[0]</span><span class='hrld-media-credit-org'>/$hrld_credit_name_org[1]</span></span>";
				}
				else{
					$output .= "<span class='hrld-media-credit'><span class='hrld-media-credit-org'>$hrld_credit_name_org[0]</span></span>";
				}
			}
		}
        $output .= "</div>"; //class="slider-content"
        $output .= "</div>"; //class="slide"
    }
 
    $output .= "</div>"; //class="swipe-wrap"
    $output .= '<div class="swipe-slide-nav-page prev"></div><div class="swipe-slide-nav-page next"></div>';
    $output .= "</div>"; //class="swipe"
    $output .= '<div class="slider-nav-container">';
    $output .= "<ul class='slider-nav clearfix'>";
    foreach ($attachments as $id => $attachment) {
        $image_output = wp_get_attachment_image( $id, 'post-thumbnail', false );
        $output .= "<li>".$image_output."</li>";
    }
    $output .= "</ul>";
    $output .= '<div class="slider-nav-page prev"></div><div class="slider-nav-page next"></div>';
    $output .= '</div>';
    $output .= "</div>"; //id="slider"
    */
    return $output;

}
add_filter('post_gallery', 'showcase_post_gallery', 10, 2);

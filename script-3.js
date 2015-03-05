(function($) {

    $.fn.showcase = function(options) {
        var slideHtml = function(img) {
                var html = '';
                var hasCaption = '';
                if (img.caption === "") {
                    hasCaption = ' no-caption';
                }
                html += '<div class="showcase-slide' + hasCaption + '">';
                html += '<div class="showcase-img" style="width:' + img.width + 'px; height:' + img.height + 'px;">';
                html += '<img src="' + img.src + '" alt="' + img.alt + '" title="' + img.title + '" />';
                html += '<div class="showcase-previous showcase-overlay-previous"></div>';
                html += '<div class="showcase-next showcase-overlay-next"></div>';
                html += '</div>';
                if (hasCaption === '') {
                    html += '<div class="showcase-content">';
                    html += '<div class="showcase-caption">' + img.caption + '</div>';
                    html += '</div>';                    
                }
                html += '</div>';
                return html;
            }
        var settings = $.extend({
            slideHtml: slideHtml
        }, $.fn.showcase.defaults, options);
        if (typeof(settings.slideHtml) !== 'function') {
            settings.slideHtml = slideHtml;
        }
        var curr_index = -1;
        var grabImageData = function(callback) {
            if (!settings.images)
            {
                parseIds();
            }
            // Expects settings.images to be an array of image IDs.
            var postData = {
                action: 'hrld_showcase_image_data_ajax',
                images: settings.images
            }
            $.post(hrld_showcase.ajaxurl, postData)
                .done(function(response) {
                    settings.images = [];
                    for (var i in response) {
                        if (response.hasOwnProperty(i)) {
                            settings.images.push(response[i]);
                        }
                    }
                    console.log(settings.images);
                    callback();
                })
                .fail(function(response) {
                    console.log("Post failed: " + response);
                });
        }

        var init = function() {
            console.log("in init");
            attachDataAttr();
            buildShowcase();
            buildSlides();

            $(settings.container).on('click', '.showcase-thumb', function(event) {
                event.preventDefault();
                curr_index = $(this).attr('data-showcase-index');
                openShowcase(curr_index);
            });
            $('.showcase-previous').on('click', function(event) {
                event.preventDefault();
                if(settings.images.length == 1)
                    closeShowcase();
                else{
                    curr_index--;
                    if (curr_index < 0) 
                        curr_index = settings.images.length - 1;
                    gotoSlide(curr_index);
                }
                event.stopPropagation();
            });
            $('.showcase-next').on('click', function(event) {
                event.preventDefault();
                if(settings.images.length == 1)
                    closeShowcase();
                else{
                    curr_index++;
                    if (curr_index == settings.images.length)
                        curr_index = 0;
                    gotoSlide(curr_index);
                }
                event.stopPropagation();
            });

            //  over image nav
            $(document).on('click', '.showcase-overlay-previous', function(event) {
                event.preventDefault();
                $('.showcase-previous').trigger('click');
            });
            $(document).on('click', '.showcase-overlay-next', function(event) {
                event.preventDefault();
                $('.showcase-next').trigger('click');
            });
            $('.showcase-close').on('click', function(event) {
                event.preventDefault();
                closeShowcase();
                event.stopPropagation();
            });
            $('.showcase-overlay').on('click', function(event) {
                closeShowcase();
            });
            $(window).on('resize', function(event) {
                adjustDim();
            });
            $(document).on('keyup', function(event) {
                if ($('.showcase-slide').length === 0) {
                    return;
                }
                // ESC key
                if (event.which === 27) {
                    event.preventDefault();
                    closeShowcase();
                    event.stopPropagation();
                }
                // LEFT ARROW key
                else if (event.which === 37) {
                    event.preventDefault();
                    $('.showcase-previous').trigger('click');
                    event.stopPropagation();
                }
                // RIGHT ARROW key
                else if (event.which === 39) {
                    event.preventDefault();
                    $('.showcase-next').trigger('click');
                    event.stopPropagation();
                }
            });
        }

        var adjustDim = function() {
            if ($('.showcase-slide').length !== 0) {
                var img = settings.images[curr_index];
                var slideHeight = $(window).height() - 100;
                var ratio =  img.height / img.width;
                var imageHeight = $('.showcase-img').width() * ratio;
                if (imageHeight < slideHeight) {
                    slideHeight = imageHeight;
                }
                $('.showcase-slide').height(slideHeight);
            }
        }

        var openShowcase = function(index) {
            $('.showcase-wrapper').addClass("active");
            $('html body').css({'overflow': 'hidden'});
            gotoSlide(index);
        }

        var closeShowcase = function() {
            $('.showcase-wrapper').removeClass("active");
            $('.showcase-slide').remove();
            $('html body').css({'overflow': 'auto'});
        }

        var gotoSlide = function(index) {
            $('.showcase-slide').remove();
            addSlide(index);
            adjustDim();
        }

        var attachDataAttr = function() {
            $(settings.container).find(settings.selector).each(function(index, val) {
                $(this).attr('data-showcase-index', index).addClass('showcase-thumb');
            });            
        }

        var addSlide = function(index) {
            $('.showcase-wrapper').append(settings.images[index].html);
        }

        var buildShowcase = function() {
            var html = '';
            html += '<div class="showcase-wrapper">';         
            html += '<div class="showcase-close"></div>';
            html += '<div class="showcase-nav">';
            html += '<div class="showcase-previous"></div>';
            html += '<div class="showcase-next"></div>';  
            html += '</div>';
            html += '<div class="showcase-overlay"></div>'; 
            html += '</div>';

            $('body').append(html);
        }

        var buildSlides = function () {
            if (settings.images) {
                for (var i = 0; i < settings.images.length; i++) {
                    var img = settings.images[i];
                    var html = settings.slideHtml(img);
                    settings.images[i].html = html;
                }
            }
        }

        var parseIds = function() {
            settings.images = [];
            $(settings.container).find(settings.selector).each(function() {
                var classes = $(this).attr('class').split(' ');
                for (var i =0; i < classes.length; i++) {
                    var matches = /^wp\-image\-(.+)/.exec(classes[i]);
                    if (matches != null) {
                        settings.images.push(matches[1]);
                    }
                }
            });
        }

        return this.each(function() {
                grabImageData(init);
        });
    }

    $.fn.showcase.defaults = {
        container: '.showcase-block',
        selector: 'img[class*="wp-image-"]',
        images: null
    }

})(jQuery);
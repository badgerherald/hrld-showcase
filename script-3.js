(function($) {

    $.fn.showcase = function(options) {

        var settings = $.extend({}, $.fn.showcase.defaults, options);
        var curr_index = 0;
        var grabImageData = function(callback) {
            parseIds();
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

            $(settings.container + ' ' + settings.selector).on('click', function(event) {
                event.preventDefault();
                curr_index = $(this).attr('data-showcase-index');
                openShowcase(curr_index);
            });
            $('.showcase-previous').on('click', function(event) {
                event.preventDefault();
                curr_index--;
                if (curr_index < 0) {
                    curr_index = settings.images.length - 1;
                }
                gotoSlide(curr_index);
            });
            $('.showcase-next').on('click', function(event) {
                event.preventDefault();
                curr_index++;
                if (curr_index == settings.images.length) {
                    curr_index = 0;
                }
                gotoSlide(curr_index);
            });
            $('.showcase-close').on('click', function(event) {
                event.preventDefault();
                closeShowcase();
            })
        }

        var openShowcase = function(index) {
            if ($('.showcase-slide').length === 0) {
                addSlides();
            }
            $('.showcase-wrapper').addClass("active");
            $('html body').css({'overflow': 'hidden'});
            gotoSlide(index);
        }

        var closeShowcase = function() {
            $('.showcase-wrapper').removeClass("active");
            $('html body').css({'overflow': 'auto'});
        }

        var gotoSlide = function(index) {
            $('.showcase-slide').each(function() {
                $(this).removeClass("active");
            });
            $('.showcase-slide[data-showcase-index="' + index + '"').addClass("active");
        }

        var attachDataAttr = function() {
            $(settings.container).find(settings.selector).each(function(index, val) {
                $(this).attr('data-showcase-index', index).addClass('showcase-thumb');
            });            
        }

        var addSlides = function() {
            for (var i = 0; i < settings.images.length; i++) {
                $('.showcase-slide-wrapper').append(settings.images[i].html);
            }
        }

        var buildShowcase = function() {
            var html = '';
            html += '<div class="showcase-wrapper">';
            html += '<div class="showcase-close"></div>';
            html += '<div class="showcase-slide-wrapper">';
            html += '<div class="showcase-nav">';
            html += '<div class="showcase-previous"></div>';
            html += '<div class="showcase-next"></div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            $(settings.container).append(html);
        }

        var buildSlides = function () {
            if (settings.images) {
                for (var i = 0; i < settings.images.length; i++) {
                    var img = settings.images[i];
                    var html = '';
                    html += '<div class="showcase-slide" data-showcase-index="'+i+'">';
                    html += '<div class="showcase-img">';
                    html += '<img src="' + img.src + '" alt="' + img.alt + '" title="' + img.title + '" />';
                    html += '</div>';
                    html += '<div class="showcase-content">';
                    if (img.title !== "") {
                        html += '<h1>' + img.title + '</h1>';
                    }
                    if (img.caption !== "") {
                        html += '<div class="showcase-caption">' + img.caption + '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
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
            if (!settings.images) {
                grabImageData(init);
            } else {
                init();
            }
        });
    }

    $.fn.showcase.defaults = {
        container: '.showcase-block',
        selector: 'img[class*="wp-image-"]',
        images: null
    }

})(jQuery);
;(function($, doc, win) {
	"use strict";

	// Our main function to setup our wysiwyg editors
	function wysiwyg(el, opts) {
	    this.$el = $(el);
	    this.init(opts);

	    // Setup container
		var html = this.$el.html();
		this.$el.empty().append(
			this.opts.html.container.append(
				this.opts.html.buttonsContainer.append(
					this.opts.html.buttons
				)
			)
		).append(
			this.opts.html.wrapper.append(html)
		);
	}

	// Default button events
	function createLink() {
		var link = prompt('Please specify the link.');
		if(link) {
			document.execCommand('createLink', false, link);
		}
	}
	function insertImage() {
		var src = prompt('Please specify the link of the image.');
		if(src) {
			document.execCommand('insertImage', false, src);
		}
	}
	function createHeading(type) {
		try {
			alert(type.toUpperCase());
			document.execCommand('heading', false, type.toUpperCase());
		} catch(e) {
			alert('no heading support');
			// The browser doesn't support "heading" command, we use an alternative
			document.execCommand('formatBlock', false, '<' + type + '>');
		}						
	}
	function wrap(tagName) {
	    var selection;
	    var elements = [];
	    var ranges = [];
	    var rangeCount = 0;
	    var frag;
	    var lastChild;
	    if(window.getSelection) {
	        selection = window.getSelection();
	        if(selection.rangeCount) {
	            var i = selection.rangeCount;
	            while(i--) {
	                ranges[i] = selection.getRangeAt(i).cloneRange();
	                elements[i] = document.createElement(tagName);
	                elements[i].appendChild(ranges[i].extractContents());
	                ranges[i].insertNode(elements[i]);
	                ranges[i].selectNode(elements[i]);
	            }
	            
	            // Restore ranges
	            selection.removeAllRanges();
	            i = ranges.length;
	            while(i--) {
	                selection.addRange(ranges[i]);
	            }
	        }
	    }
	}

	// Initialize
	wysiwyg.prototype.init = function(opts) {
		// Defaults
		var defaults = {
			html: {
				wrapper: $('<div>').addClass('wysiwyg_content'),
				container: $('<div>').addClass('buttons_container').append(
					$('<button>').addClass('wysiwyg_editButton').text('Edit').click(function() {
						if($(this).text() == 'Edit') {
							$(this).siblings('.wysiwyg_buttons').fadeIn();
							$(this).text('Save');
							console.log($(this).siblings());
							$(this).parent().siblings('.wysiwyg_content').prop('contenteditable', 'true').focus();
						} else {
							$(this).siblings('.wysiwyg_buttons').fadeOut();
							$(this).text('Edit');
							$(this).parent().siblings('.wysiwyg_content').removeProp('contenteditable');
							// Call AJAX function here
						}
					})
				).append(
					$('<button>').addClass('wysiwyg_viewHTML').text('View HTML')
				),
				buttonsContainer: $('<div>').addClass('wysiwyg_buttons').hide(),
				buttons: [
					// Bold
					$('<button>').append(
						$('<i>').addClass('icon-bold').data('tag', 'bold')
					).prop({title: 'Bold', alt: 'Bold'}).click(function() { 
						document.execCommand('bold', false, null); 
					}),
					// Italic
					$('<button>').append(
						$('<i>').addClass('icon-italic').data('tag', 'italic')
					).prop({title: 'Italic', alt: 'Italic'}).click(function() { 
						document.execCommand('italic', false, null); 
					}),
					// Underline
					$('<button>').append(
						$('<i>').addClass('icon-underline').data('tag', 'underline')
					).prop({title: 'Underline', alt: 'Underline'}).click(function() {
						document.execCommand('underline', false, null);
					}),
					// Strikethrough
					$('<button>').append(
						$('<i>').addClass('icon-strikethrough').data('tag', 'strikeThrough')
					).prop({title: 'Strikethrough', alt: 'Strikethrough'}).click(function() { 
						document.execCommand('strikeThrough', false, null);
					}),
					// Unordered list
					$('<button>').append(
						$('<i>').addClass('icon-list-ul').data('tag', 'insertUnorderedList')
					).prop({title: 'Unordered List', alt: 'Unordered List'}).click(function() {
						document.execCommand('insertHTML', false, '<ul><li></li></ul>');
					}),
					// Ordered list
					$('<button>').append(
						$('<i>').addClass('icon-list-ol').data('tag', 'insertOrderedList')
					).prop({title: 'Ordered List', alt: 'Ordered List'}).click(function() { 
						document.execCommand('insertHTML', false, '<ol><li></li></ol>'); 
					}),
					// Create link
					$('<button>').append(
						$('<i>').addClass('icon-link').data('tag', 'createLink')
					).prop({title: 'Create Link', alt: 'Create Link'}).click(function() { createLink(); }),
					// Insert picture
					$('<button>').append(
						$('<i>').addClass('icon-picture').data('tag', 'insertImage')
					).prop({title: 'Insert Picture', alt: 'Insert Picture'}).click(function() { insertImage(); }),
					// Main heading
					$('<button>').append(
						$('<i>').addClass('icon-h-sign').data('tag', 'heading').data('value', 'h1').text(' 1')
					).prop({title: 'Main Heading', alt: 'Main Heading'}).click(function() { createHeading('h1'); }),
					// Subtitle heading
					$('<button>').append(
						$('<i>').addClass('icon-h-sign').data('tag', 'heading').data('value', 'h2').text(' 2')
					).prop({title: 'Subtitle Heading', alt: 'Subtitle Heading'}).click(function() { createHeading('h2'); }),
					// Remove formatting
					$('<button>').append(
						$('<i>').addClass('icon-eraser').data('tag', 'removeFormat')
					).prop({title: 'Remove Formatting', alt: 'Remove Formatting'}).click(function() {
						document.execCommand('removeFormat', false, null);
					})
				]
			},
			save: function() {
				$.ajax(this.href, {
					
				}).done(function() {

				});
			}
		}

		// Extend defaults with opts passed
		$.extend(defaults, opts);
		this.opts = defaults;
	};

	// Add method
	$.fn.wysiwyg = function(opts) {
		return this.each(function() {
			new wysiwyg(this, opts);
		});
	};

})(jQuery, document, window);
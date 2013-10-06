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
					$('<button>').addClass('wysiwyg_edit').append(
						$('<i>').addClass('icon-edit-sign')
					).click(function() {
						if($(this).hasClass('editing')) {
							// Editing
							$(this).siblings('.wysiwyg_buttons').fadeIn();
							$(this).children('.icon-edit-sign').removeClass('icon-edit-sign').addClass('icon-edit');
							$(this).parent().siblings('.wysiwyg_content').prop('contenteditable', 'true').focus().keypress("b", function(e){
								if(e.ctrlKey) console.log('yes');
							});
						} else {
							// Saving
							$(this).siblings('.wysiwyg_buttons').fadeOut();
							$(this).children('.icon-edit-sign').removeClass('icon-edit').addClass('icon-edit-sign');
							$(this).parent().siblings('.wysiwyg_content').removeAttr('contenteditable');
							// Call AJAX function here
						}
						$(this).toggleClass('editing');
					})
				).append(
					$('<button>').addClass('wysiwyg_viewHTML').append(
						$('<i>').addClass('icon-html5')
					)
				),
				buttonsContainer: $('<div>').addClass('wysiwyg_buttons').hide(),
				buttons: [
					// Bold
					$('<button>').append(
						$('<i>').addClass('icon-bold')
					).prop({title: 'Bold', alt: 'Bold'}).click(function() { 
						document.execCommand('bold', false, null); 
					}),
					// Italic
					$('<button>').append(
						$('<i>').addClass('icon-italic')
					).prop({title: 'Italic', alt: 'Italic'}).click(function() { 
						document.execCommand('italic', false, null); 
					}),
					// Underline
					$('<button>').append(
						$('<i>').addClass('icon-underline')
					).prop({title: 'Underline', alt: 'Underline'}).click(function() {
						document.execCommand('underline', false, null);
					}),
					// Strikethrough
					$('<button>').append(
						$('<i>').addClass('icon-strikethrough')
					).prop({title: 'Strikethrough', alt: 'Strikethrough'}).click(function() { 
						document.execCommand('strikeThrough', false, null);
					}),
					// Main heading
					$('<button>').append(
						$('<i>').addClass('icon-h-sign').text(' 1')
					).prop({title: 'Main Heading', alt: 'Main Heading'}).click(function() { createHeading('h1'); }),
					// Subtitle heading
					$('<button>').append(
						$('<i>').addClass('icon-h-sign').text(' 2')
					).prop({title: 'Subtitle Heading', alt: 'Subtitle Heading'}).click(function() { createHeading('h2'); }),
					// Unordered list
					$('<button>').append(
						$('<i>').addClass('icon-list-ul')
					).prop({title: 'Unordered List', alt: 'Unordered List'}).click(function() {
						document.execCommand('insertHTML', false, '<ul><li></li></ul>');
					}),
					// Ordered list
					$('<button>').append(
						$('<i>').addClass('icon-list-ol')
					).prop({title: 'Ordered List', alt: 'Ordered List'}).click(function() { 
						document.execCommand('insertHTML', false, '<ol><li></li></ol>'); 
					}),
					// // Increase font size
					// $('<button>').append(
					// 	$('<i>').addClass('icon-long-arrow-up')
					// ).prop({title: 'Increase Font Size', alt: 'Increase Font Size'}).click(function() {
					// 	document.execCommand('increaseFontSize', true, null);
					// }),
					// // Decrease font size
					// $('<button>').append(
					// 	$('<i>').addClass('icon-long-arrow-down')
					// ).prop({title: 'Decrease Font Size', alt: 'Decrease Font Size'}).click(function() {
					// 	document.execCommand('decreaseFontSize', false, null);
					// }),
					// Insert horizontal rule
					$('<button>').append(
						$('<i>').addClass('icon-minus')
					).prop({title: 'Insert Horizontal Rule', alt: 'Insert Horizontal Rule'}).click(function() { 
						document.execCommand('insertHorizontalRule', false, null); 
					}),
					// Indent right
					$('<button>').append(
						$('<i>').addClass('icon-indent-right')
					).prop({title: 'Indent Right', alt: 'Indent Right'}).click(function() { 
						document.execCommand('indent', false, null); 
					}),
					// Indent left
					$('<button>').append(
						$('<i>').addClass('icon-indent-left')
					).prop({title: 'Indent Left', alt: 'Indent Left'}).click(function() { 
						document.execCommand('outdent', false, null); 
					}),
					// Justify left
					$('<button>').append(
						$('<i>').addClass('icon-align-left')
					).prop({title: 'Justify Left', alt: 'Justify Left'}).click(function() { 
						document.execCommand('justifyLeft', false, null); 
					}),
					// Justify center
					$('<button>').append(
						$('<i>').addClass('icon-align-center')
					).prop({title: 'Justify Center', alt: 'Justify Center'}).click(function() { 
						document.execCommand('justifyCenter', false, null); 
					}),
					// Justify right
					$('<button>').append(
						$('<i>').addClass('icon-align-right')
					).prop({title: 'Justify Right', alt: 'Justify Right'}).click(function() { 
						document.execCommand('justifyRight', false, null); 
					}),
					// Create link
					$('<button>').append(
						$('<i>').addClass('icon-link')
					).prop({title: 'Create Link', alt: 'Create Link'}).click(function() { createLink(); }),
					// Insert picture
					$('<button>').append(
						$('<i>').addClass('icon-picture')
					).prop({title: 'Insert Picture', alt: 'Insert Picture'}).click(function() { insertImage(); }),
					// Remove formatting
					$('<button>').append(
						$('<i>').addClass('icon-eraser')
					).prop({title: 'Remove Formatting', alt: 'Remove Formatting'}).click(function() {
						document.execCommand('removeFormat', false, null);
					}),
					// Insert br tag on enter key
					$('<button>').append(
						$('<i>').addClass('icon-level-down')
					).prop({title: 'Toggle <br> on Enter Key', alt: 'Toggle <br> on Enter Key'}).click(function() {
						if($(this).children('i').hasClass('icon-level-down')) {
							// Toggle on
							$(this).children('i').removeClass('icon-level-down').addClass('icon-level-up');
						} else {
							// Toggle off
							$(this).children('i').removeClass('icon-level-up').addClass('icon-level-down');
						}
						document.execCommand('insertBrOnReturn', false, true);
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
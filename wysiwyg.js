;(function($, doc, win) {
	"use strict";

	function wysiwyg(el, opts) {
	    this.$el = $(el);
	    this.init(opts);

	    // Setup container
		var html = this.$el.html();
		this.$el.empty().append(
			this.opts.html.wrapper.append(html)
		).append(
			this.opts.html.container.append(
				this.opts.html.buttonsContainer.append(
					this.opts.html.buttons
				)
			)
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
			document.execCommand('heading', false, type);
		} catch(e) {
			// The browser doesn't support "heading" command, we use an alternative
			document.execCommand('formatBlock', false, '<' + type + '>');
		}						
	}
	function createUL() {
		document.execCommand('insertHTML', false, '<ul><li></li></ul>');
	}
	function createOL() {
		document.execCommand('insertHTML', false, '<ol><li></li></ol>');
	}
	function bold() {
		document.execCommand('bold', false, null);
	}
	function italic() {
		document.execCommand('italic', false, null);
	}
	function underline() {
		document.execCommand('underline', false, null);
	}
	function strike(){
		document.execCommand('strikeThrough', false, null);
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
					$('<button>').data('tag', 'bold').append($('<b>').text('Bold')).click(function() { bold(); }),
					$('<button>').data('tag', 'italic').append($('<em>').text('Italic')).click(function() { italic(); }),
					$('<button>').data('tag', 'underline').append($('<ins>').text('Underline')).click(function() { underline(); }),
					$('<button>').data('tag', 'strikeThrough').append($('<del>').text('Strike')).click(function() { strike(); }),
					$('<button>').data('tag', 'insertUnorderedList').html('&bull; Unordered List').click(function() { createUL(); }),
					$('<button>').data('tag', 'insertOrderedList').html('1. Ordered List').click(function() { createOL(); }),
					$('<button>').data('tag', 'createLink').append($('<ins>').css('color', 'blue').text('Link')).click(function() { createLink(); }),
					$('<button>').data('tag', 'insertImage').text('Image').click(function() { insertImage(); }),
					$('<button>').data('tag', 'heading').data('value', 'h1').text('Main Title').click(function() { createHeading('h1'); }),
					$('<button>').data('tag', 'heading').data('value', 'h2').text('Subtitle').click(function() { createHeading('h2'); }),
					$('<button>').data('tag', 'removeFormat').text('Remove format')
				]
			},
			save: function() {
				$.post(this.href, {
					
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
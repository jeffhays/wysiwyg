;(function($, doc, win) {
	"use strict";
	var ctrlDown = false;

	// Our main function to setup our wysiwyg editors
	function wysiwyg(el, opts) {
	    this.$el = $(el);
	    this.$btns = this.init(opts);

	    // Setup container
		var html = this.$el.html();
		this.$el.empty().append(
			this.opts.html.container.append(
				this.opts.html.buttonsContainer.append(
					this.$btns
				)
			)
		).append(
			this.opts.html.wrapper.append(html)
		);

		// Bind key events to check for CTRL/CMD key
		$(document).keydown(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) ctrlDown = true;
		}).keyup(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) ctrlDown = false;
		});
	}

	// Default button events
	function createButtons(opts) {
		var btns = opts.html.buttons;
		if(opts.html.buttons.length) {
			var btns = [];
			$.each(opts.html.buttons, function(index, value) {
				btns.push(value.html);
				// btns.push(this.opts.html.buttons.eq(index)['html']);
			});
		}
		return btns;
	}
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

	// Events
	function save() {
		$.ajax(this.href, {
			method: 'post',
			data: {
				index: 'test'
			}
		}).done(function() {

		});
	}

	// Initialize
	wysiwyg.prototype.init = function(opts) {

		var styles = {
				buttons: {},
				icons: {}
			};

		// Defaults
		var defaults = {
			events: {

			},
			html: {
				wrapper: $('<div>').addClass('wysiwyg_content'),
				container: $('<div>').addClass('buttons_container').append(
					$('<button>').addClass('wysiwyg_edit').append(
						$('<i>').css(styles.icons).addClass('icon-edit-sign')
					).click(function() {
						if(!$(this).hasClass('editing')) {
							// Editing
							$(this).siblings('.wysiwyg_buttons').fadeIn();
							$(this).children('.icon-edit-sign').removeClass('icon-edit-sign').addClass('icon-save');
							$(this).parent().siblings('.wysiwyg_content').prop('contenteditable', 'true').focus().keypress(function(e) {
								if(ctrlDown && (e.keyCode == 98)) console.log('bold');
							});
						} else {
							// Saving
							$(this).siblings('.wysiwyg_buttons').fadeOut();
							$(this).children('.icon-save').removeClass('icon-save').addClass('icon-edit-sign');
							$(this).parent().siblings('.wysiwyg_content').removeAttr('contenteditable');
							// Call AJAX function here
						}
						$(this).toggleClass('editing');
					})
				).append(
					$('<button>').addClass('wysiwyg_viewHTML').append(
						$('<i>').css(styles.icons).addClass('icon-html5')
					)
				),
				buttonsContainer: $('<div>').addClass('wysiwyg_buttons').hide(),
				buttons: [{
					// Bold
					name: 'bold',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-bold')
					).prop({title: 'Bold', alt: 'Bold'}).click(function() { 
						document.execCommand('bold', false, null); 
					})
				}, {
					// Italic
					name: 'italic',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-italic')
					).prop({title: 'Italic', alt: 'Italic'}).click(function() { 
						document.execCommand('italic', false, null); 
					})
				}, {
					// Underline
					name: 'underline',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-underline')
					).prop({title: 'Underline', alt: 'Underline'}).click(function() {
						document.execCommand('underline', false, null);
					})
				}, {
					// Strikethrough
					name: 'strikethough',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-strikethrough')
					).prop({title: 'Strikethrough', alt: 'Strikethrough'}).click(function() { 
						document.execCommand('strikeThrough', false, null);
					})
				}, {
					// Main heading
					name: 'h1',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-h-sign').text(' 1')
					).prop({title: 'Main Heading', alt: 'Main Heading'}).click(function() { wrap('h1'); })
				}, {
					// Subtitle heading
					name: 'h2',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-h-sign').text(' 2')
					).prop({title: 'Subtitle Heading', alt: 'Subtitle Heading'}).click(function() { wrap('h2'); })
				}, {
					// Unordered list
					name: 'ul',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-list-ul')
					).prop({title: 'Unordered List', alt: 'Unordered List'}).click(function() {
						document.execCommand('insertUnorderedList', false, null);
					})
				}, {
					name: 'ol',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-list-ol')
					).prop({title: 'Ordered List', alt: 'Ordered List'}).click(function() {
						document.execCommand('insertOrderedList', false, null);
					})
				}, {
					// Increase font size
					name: 'increaseFont',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-long-arrow-up')
					).prop({title: 'Increase Font Size', alt: 'Increase Font Size'}).click(function() {
						document.execCommand('increaseFontSize', true, null);
					})
				}, {
					// Decrease font size
					name: 'decreaseFont',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-long-arrow-down')
					).prop({title: 'Decrease Font Size', alt: 'Decrease Font Size'}).click(function() {
						document.execCommand('decreaseFontSize', false, null);
					})
				}, {
					// Insert horizontal rule
					name: 'hr',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-minus')
					).prop({title: 'Insert Horizontal Rule', alt: 'Insert Horizontal Rule'}).click(function() { 
						document.execCommand('insertHorizontalRule', false, null); 
					})
				}, {
					// Indent right
					name: 'indentRight',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-indent-right')
					).prop({title: 'Indent Right', alt: 'Indent Right'}).click(function() { 
						document.execCommand('indent', false, null); 
					})
				}, {
					// Indent left
					name: 'indentLeft',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-indent-left')
					).prop({title: 'Indent Left', alt: 'Indent Left'}).click(function() { 
						document.execCommand('outdent', false, null); 
					})
				}, {
					// Justify left
					name: 'justifyLeft',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-align-left')
					).prop({title: 'Justify Left', alt: 'Justify Left'}).click(function() { 
						document.execCommand('justifyLeft', false, null); 
					})
				}, {
					// Justify center
					name: 'justifyCenter',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-align-center')
					).prop({title: 'Justify Center', alt: 'Justify Center'}).click(function() { 
						document.execCommand('justifyCenter', false, null); 
					})
				}, {
					// Justify right
					name: 'justifyRight',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-align-right')
					).prop({title: 'Justify Right', alt: 'Justify Right'}).click(function() { 
						document.execCommand('justifyRight', false, null); 
					})				
				}, {
					// Create link
					name: 'createLink',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-link')
					).prop({title: 'Create Link', alt: 'Create Link'}).click(function() { createLink(); }),
				}, {
					// Subscript
					name: 'subscript',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-subscript')
					).prop({title: 'Subscript', alt: 'Subscript'}).click(function() {
						document.execCommand('subScript', false, null);
					})
				}, {
					// Superscript
					name: 'superscript',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-superscript')
					).prop({title: 'Superscript', alt: 'Superscript'}).click(function() {
						document.execCommand('superScript', false, null);
					})
				}, {
					// Insert picture
					name: 'picture',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-picture')
					).prop({title: 'Insert Picture', alt: 'Insert Picture'}).click(function() { insertImage(); }),
				}, {
					// Remove formatting
					name: 'removeFormat',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-eraser')
					).prop({title: 'Remove Formatting', alt: 'Remove Formatting'}).click(function() {
						document.execCommand('removeFormat', false, null);
					})
				}, {
					// Insert br tag on enter key
					name: 'br',
					html: $('<button>').append(
						$('<i>').css(styles.icons).addClass('icon-level-down')
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
				}]
			}
		}
		// Extend defaults with opts passed
		$.extend(defaults, opts);
		this.opts = defaults;

		// Create and return buttons
		return createButtons(this.opts);
	};

	// Add method
	$.fn.wysiwyg = function(opts) {
		return this.each(function() {
			new wysiwyg(this, opts);
		});
	};

})(jQuery, document, window);
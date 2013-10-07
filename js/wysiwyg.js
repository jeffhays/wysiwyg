;(function($, doc, win) {
	"use strict";
	var ctrlDown = false;

	// Main setup function for wysiwyg editors (makes editors)
	function wysiwyg(el, opts) {
	    this.$el = $(el);
	    this.$btns = this.init(opts);

	    // Setup container
		var html = this.$el.html();
		// Empty current container
		this.$el.empty().append(
			// Add container
			this.opts.html.container.append(
				// Add buttons container
				this.opts.html.buttonsContainer.append(
					// Add buttons
					this.$btns
				)
			)
		).append(
			// Add wysiwyg content wrapper with original HTML inside
			this.opts.html.wrapper.append(html)
		);

		// Bind key events to check for CTRL/CMD key
		$(document).keydown(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) ctrlDown = true;
		}).keyup(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) ctrlDown = false;
		});
	}

// Button functions and events

	// Alter default buttons based on user input
	function createButtons(opts) {
		// Grab buttons from options (and initialize btns to default buttons)
		var btns = opts.html.buttons;
		// If we have buttons
		if(btns.length) {
			// Reset buttons and push based on options passed
			var btns = [];
			$.each(opts.html.buttons, function(index, value) {
				console.log(opts.buttons);
				// If this button is in the buttons array and not in the excludeButtons array, add it
				if($.inArray(value.name, opts.buttons) >= 0 && $.inArray(value.name, opts.excludeButtons) < 0) btns.push(value.html);
			});
		}
		// Return our new buttons
		return btns;
	}

	// Insert link into selected area
	function createLink() {
		var link = prompt('Please specify the link.');
		if(link) {
			document.execCommand('createLink', false, link);
		}
	}

	// Insert image into selected area
	function insertImage() {
		var src = prompt('Please specify the link of the image.');
		if(src) {
			document.execCommand('insertImage', false, src);
		}
	}

	// Wraps current selection in a tag of your choosing
	function wrap(tagName) {
		// Initialize
	    var selection;
	    var elements = [];
	    var ranges = [];
	    var rangeCount = 0;
	    var frag;
	    var lastChild;
	    // If we have a selection inside a content editable area
	    if(window.getSelection) {
	    	// Set selection
	        selection = window.getSelection();
	        // If it's a range (1 or more characters)
	        if(selection.rangeCount) {
	        	// Set iterator at top of selection
	            var i = selection.rangeCount;
	            // Loop down one character at a time until at beginning of selection
	            while(i--) {
	            	// Set variables
	                ranges[i] = selection.getRangeAt(i).cloneRange();
	                // Create wrap
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

// Methods

	// Save content
	wysiwyg.prototype.save = function() {
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
		// Default styles
		var styles = {
			buttons: {
				cursor: 'pointer',
				margin: '0 .2em 0 0',
				minWidth: '20px'
			},
			icons: {
				fontSize: '1em'
			}
		};
		// Extend styles with any css passed
		if(opts && typeof(opts.css) != 'undefined') $.extend(styles, opts.css);

		// 

		// Default settings
		var defaults = {
			// Events
			events: {

			},
			buttons: ['bold', 'italic', 'underline', 'strikethough', 'h1', 'h2', 'ul', 'ol', 'increaseFont', 'decreaseFont', 'hr', 'indentRight', 'indentLeft', 'justifyLeft', 'justifyCenter', 'justifyRight', 'link', 'subscript', 'superscript', 'image', 'removeFormat', 'br'],
			excludeButtons: [],
			// HTML
			html: {
				// Content editable content wrapper
				wrapper: $('<div>').addClass('wysiwyg_content'),
				// Container to hold buttons
				container: $('<div>').addClass('buttons_container').append(
					// Edit button
					$('<button>').addClass('wysiwyg_edit').append(
						$('<i>').addClass('icon-edit-sign').css(styles.icons)
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
					// View HTML button
					$('<button>').addClass('wysiwyg_viewHTML').append(
						$('<i>').addClass('icon-html5').css(styles.icons)
					)
				),
				// Buttons wrap (inside container above)
				buttonsContainer: $('<div>').addClass('wysiwyg_buttons').hide(),
				// Buttons
				buttons: [{
					// Bold
					name: 'bold',
					html: $('<button>').append(
						$('<i>').addClass('icon-bold').css(styles.icons)
					).prop({title: 'Bold', alt: 'Bold'}).click(function() { 
						document.execCommand('bold', false, null); 
					}).css(styles.buttons)
				}, {
					// Italic
					name: 'italic',
					html: $('<button>').append(
						$('<i>').addClass('icon-italic').css(styles.icons)
					).prop({title: 'Italic', alt: 'Italic'}).click(function() { 
						document.execCommand('italic', false, null); 
					}).css(styles.buttons)
				}, {
					// Underline
					name: 'underline',
					html: $('<button>').append(
						$('<i>').addClass('icon-underline').css(styles.icons)
					).prop({title: 'Underline', alt: 'Underline'}).click(function() {
						document.execCommand('underline', false, null);
					}).css(styles.buttons)
				}, {
					// Strikethrough
					name: 'strikethough',
					html: $('<button>').append(
						$('<i>').addClass('icon-strikethrough').css(styles.icons)
					).prop({title: 'Strikethrough', alt: 'Strikethrough'}).click(function() {
						document.execCommand('strikeThrough', false, null);
					}).css(styles.buttons)
				}, {
					// Main heading
					name: 'h1',
					html: $('<button>').append(
						$('<i>').addClass('icon-h-sign').css(styles.icons)
					).prop({title: 'Main Heading', alt: 'Main Heading'}).click(function() { wrap('h1'); }).css(styles.buttons)
				}, {
					// Subtitle heading
					name: 'h2',
					html: $('<button>').append(
						$('<i>').addClass('icon-h-sign').css(styles.icons)
					).prop({title: 'Subtitle Heading', alt: 'Subtitle Heading'}).click(function() { wrap('h2'); }).css(styles.buttons)
				}, {
					// Unordered list
					name: 'ul',
					html: $('<button>').append(
						$('<i>').addClass('icon-list-ul').css(styles.icons)
					).prop({title: 'Unordered List', alt: 'Unordered List'}).click(function() {
						document.execCommand('insertUnorderedList', false, null);
					}).css(styles.buttons)
				}, {
					// Ordered list
					name: 'ol',
					html: $('<button>').append(
						$('<i>').addClass('icon-list-ol').css(styles.icons)
					).prop({title: 'Ordered List', alt: 'Ordered List'}).click(function() {
						document.execCommand('insertOrderedList', false, null);
					}).css(styles.buttons)
				}, {
					// Increase font size
					name: 'increaseFont',
					html: $('<button>').append(
						$('<i>').addClass('icon-long-arrow-up').css(styles.icons)
					).prop({title: 'Increase Font Size', alt: 'Increase Font Size'}).click(function() {
						document.execCommand('increaseFontSize', true, null);
					}).css(styles.buttons)
				}, {
					// Decrease font size
					name: 'decreaseFont',
					html: $('<button>').append(
						$('<i>').addClass('icon-long-arrow-down').css(styles.icons)
					).prop({title: 'Decrease Font Size', alt: 'Decrease Font Size'}).click(function() {
						document.execCommand('decreaseFontSize', false, null);
					}).css(styles.buttons)
				}, {
					// Insert horizontal rule
					name: 'hr',
					html: $('<button>').append(
						$('<i>').addClass('icon-minus').css(styles.icons)
					).prop({title: 'Insert Horizontal Rule', alt: 'Insert Horizontal Rule'}).click(function() { 
						document.execCommand('insertHorizontalRule', false, null); 
					}).css(styles.buttons)
				}, {
					// Indent right
					name: 'indentRight',
					html: $('<button>').append(
						$('<i>').addClass('icon-indent-right').css(styles.icons)
					).prop({title: 'Indent Right', alt: 'Indent Right'}).click(function() { 
						document.execCommand('indent', false, null); 
					}).css(styles.buttons)
				}, {
					// Indent left
					name: 'indentLeft',
					html: $('<button>').append(
						$('<i>').addClass('icon-indent-left').css(styles.icons)
					).prop({title: 'Indent Left', alt: 'Indent Left'}).click(function() { 
						document.execCommand('outdent', false, null); 
					}).css(styles.buttons)
				}, {
					// Justify left
					name: 'justifyLeft',
					html: $('<button>').append(
						$('<i>').addClass('icon-align-left').css(styles.icons)
					).prop({title: 'Justify Left', alt: 'Justify Left'}).click(function() { 
						document.execCommand('justifyLeft', false, null); 
					}).css(styles.buttons)
				}, {
					// Justify center
					name: 'justifyCenter',
					html: $('<button>').append(
						$('<i>').addClass('icon-align-center').css(styles.icons)
					).prop({title: 'Justify Center', alt: 'Justify Center'}).click(function() { 
						document.execCommand('justifyCenter', false, null); 
					}).css(styles.buttons)
				}, {
					// Justify right
					name: 'justifyRight',
					html: $('<button>').append(
						$('<i>').addClass('icon-align-right').css(styles.icons)
					).prop({title: 'Justify Right', alt: 'Justify Right'}).click(function() {
						document.execCommand('justifyRight', false, null);
					}).css(styles.buttons)
				}, {
					// Create link
					name: 'createLink',
					html: $('<button>').append(
						$('<i>').addClass('icon-link').css(styles.icons)
					).prop({title: 'Create Link', alt: 'Create Link'}).click(function() { createLink(); }).css(styles.buttons)
				}, {
					// Subscript
					name: 'subscript',
					html: $('<button>').append(
						$('<i>').addClass('icon-subscript').css(styles.icons)
					).prop({title: 'Subscript', alt: 'Subscript'}).click(function() {
						document.execCommand('subScript', false, null);
					}).css(styles.buttons)
				}, {
					// Superscript
					name: 'superscript',
					html: $('<button>').append(
						$('<i>').addClass('icon-superscript').css(styles.icons)
					).prop({title: 'Superscript', alt: 'Superscript'}).click(function() {
						document.execCommand('superScript', false, null);
					}).css(styles.buttons)
				}, {
					// Insert picture
					name: 'picture',
					html: $('<button>').append(
						$('<i>').addClass('icon-picture').css(styles.icons)
					).prop({title: 'Insert Picture', alt: 'Insert Picture'}).click(function() { insertImage(); }).css(styles.buttons)
				}, {
					// Remove formatting
					name: 'removeFormat',
					html: $('<button>').append(
						$('<i>').addClass('icon-eraser').css(styles.icons)
					).prop({title: 'Remove Formatting', alt: 'Remove Formatting'}).click(function() {
						document.execCommand('removeFormat', false, null);
					}).css(styles.buttons)
				}, {
					// Insert br tag on enter key
					name: 'br',
					html: $('<button>').append(
						$('<i>').addClass('icon-level-down').css(styles.icons)
					).prop({title: 'Toggle <br> on Enter Key', alt: 'Toggle <br> on Enter Key'}).click(function() {
						if($(this).children('i').hasClass('icon-level-down')) {
							// Toggle on
							$(this).children('i').removeClass('icon-level-down').addClass('icon-level-up');
						} else {
							// Toggle off
							$(this).children('i').removeClass('icon-level-up').addClass('icon-level-down');
						}
						document.execCommand('insertBrOnReturn', false, true);
					}).css(styles.buttons)
				}]
			}
		}
		// Extend defaults with opts passed
		$.extend(defaults, opts);
		this.opts = defaults;

		// Create and return buttons
		return createButtons(this.opts);
	};

	// Main class wrapper for .wysiwyg()
	$.fn.wysiwyg = function(opts) {
		// Loop through items selected
		return this.each(function() {
			// Create new wysiwyg object with this element
			new wysiwyg(this, opts);
		});
	};

})(jQuery, document, window);
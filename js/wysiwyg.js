;(function($, doc, win) {
	"use strict";
	var	$callbacks = $.Callbacks(),
		$buttons,
		ctrl = false;

	// Main setup function for wysiwyg editors (makes editors)
	function wysiwyg(element, options) {
		// Setup variables
		this.$element = $(element);
		this.$options = this.init(options);

		// Fire the before callback
		this.$options.beforeCreated();

		// Setup container
		var html = this.$element.html();
		// Empty current container
		this.$element.empty().append(
			// Add container
			this.$options.html.container.append(
				// Add buttons container
				this.$options.html.buttonsContainer.append(
					// Add buttons
					this.$buttons
				)
			)
		).append(
			// Add wysiwyg content wrapper with original HTML inside
			this.$options.html.wrapper.append(html)
		);

		// Fire the after callback
		this.$options.afterCreated();

		// Bind key events to check for CTRL/CMD key
		$(document).keydown(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) this.ctrl = true;
		}).keyup(function(e) {
			if(e.keyCode == 17 || e.keyCode == 91) this.ctrl = false;
		});

		return this;
	}

// Button functions and events

	// Default buttons (filter buttons from defaults based on options passed)
	function filterButtons(options) {
		// Grab buttons from options (and initialize btns to default buttons)
		var btns = options.html.buttons;
		// If we have buttons
		if(btns.length) {
			// Reset buttons and push based on options passed
			var btns = [];
			$.each(options.html.buttons, function(index, value) {
				// If this button is in the buttons array and not in the excludeButtons array, add it
				if($.inArray(value.name, options.buttons) >= 0 && $.inArray(value.name, options.excludeButtons) < 0) btns.push(value.html);
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
		var	selection,
			frag,
			lastChild,
			elements = [],
			ranges = [],
			rangeCount = [];
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

	// Initialize
	wysiwyg.prototype.init = function(options) {
		// Default events
		var events = {
			// Edit content
			edit: function() {
				console.log('edit event fired');
			},
			// Save content
			save: function() {
				console.log('save event fired');
				$.ajax(this.href, {
					method: 'post',
					data: {
						action: 'update',
						content: ''
					}
				});
			},
			// Before wysiwyg(s) are created
			beforeCreated: function() {
				console.log('before event fired');
			},
			// After wysiwyg(s) are created
			afterCreated: function() {
				console.log('after event fired');
			}
		},
		// Default styles
		styles = {
			// Button styles
			buttons: {
				cursor: 'pointer',
				margin: '0 .2em 0 0',
				minWidth: '20px'
			},
			// Icon styles
			icons: {
				fontSize: '1em'
			}
		};
		// Extend events and css with options passed
		if(options && typeof(options.events) != 'undefined') $.extend(events, options.events);
		if(options && typeof(options.css) != 'undefined') $.extend(styles, options.css);

		// Default settings
		var defaults = {
			// Buttons to show
			buttons: ['bold', 'italic', 'underline', 'strikethough', 'h1', 'h2', 'ul', 'ol', 'increaseFont', 'decreaseFont', 'hr', 'indentRight', 'indentLeft', 'justifyLeft', 'justifyCenter', 'justifyRight', 'link', 'subscript', 'superscript', 'image', 'removeFormat', 'br'],
			// Buttons to hide
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
							$(this).siblings('.wysiwyg_buttons').slideToggle();
							$(this).children('.icon-edit-sign').removeClass('icon-edit-sign').addClass('icon-save');
							$(this).parent().siblings('.wysiwyg_content').prop('contenteditable', 'true').focus().keypress(function(e) {
								if(this.ctrl && (e.keyCode == 98)) console.log('bold');
							});
							// Fire edit callback
							events.edit();
						} else {
							// Saving
							$(this).siblings('.wysiwyg_buttons').slideToggle();
							$(this).children('.icon-save').removeClass('icon-save').addClass('icon-edit-sign');
							$(this).parent().siblings('.wysiwyg_content').removeAttr('contenteditable');
							// Fire save callback
							events.save();
						}
						$(this).toggleClass('editing');
					}).css(styles.buttons)
				).append(
					// View HTML button
					$('<button>').addClass('wysiwyg_viewHTML').append(
						$('<i>').addClass('icon-html5').css(styles.icons)
					).css(styles.buttons)
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
		// Extend defaults with options passed
		$.extend(defaults, options, events);
		this.$options = defaults;

		// Filter and return buttons
		this.$buttons = filterButtons(this.$options);

		// Return our defaults
		return defaults;
	};

	// Main class wrapper for .wysiwyg()
	$.fn.wysiwyg = function(options) {
		// Loop through items selected
		return this.each(function() {
			// Create new wysiwyg object with this element
			new wysiwyg(this, options);
		});
	};

})(jQuery, document, window);
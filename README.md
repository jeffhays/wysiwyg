# ez wysiwyg
============

This is a custom jQuery WYSIWYG editor plugin made with content editable HTML5 elements and dynamically created buttons (with Font Awesome icons). When the project is finished it will be an editor made by/for developers, with the ability to override any events, styles, or markup you want without having to modify the plugin. If you'd like to contribute, please send a request!

Recent Updates
==============

- Added before, edit, save, and after call back events that are extendable!

To-Do
=====

- Add AJAX save events and functions with fully extendable options
- Add functionality for "View HTML" button
- Add unwrap function (to unwrap content wrapped in wrap() output)
- Add toggle function (to toggle a wrapped element around selected content)
- Add options for extending button styles
- Add font dropdown/autocomplete/list for selecting font families
- Tie events to wrapper to allow developer to trigger the events
- Debug issues with increaseFont/decreaseFont
- Add in custom event hooks to buttons and/or wysiwyg in general

========================
Changing Default Buttons
========================

You can pass an array of ``buttons`` to include:

	$('.editor').wysiwyg({
		buttons: ['bold', 'italic', 'strikeThrough']
	});

Here's a full list of the default buttons that currently come with the editor (this may be out of date so double check wysiwyg.js):

``bold``
``italic``
``underline``
``strikethough``
``h1``
``h2``
``ul``
``ol``
``increaseFont``
``decreaseFont``
``hr``
``indentRight``
``indentLeft``
``justifyLeft``
``justifyCenter``
``justifyRight``
``link``
``subscript``
``superscript``
``image``
``removeFormat``
``br``

=================
Excluding Buttons
=================

You can pass an array of ``excludedButtons`` to exclude buttons:

	$('.editor').wysiwyg({
		excludeButtons: ['br', 'fontDecrease']
	});

==========
Custom CSS
==========

You can pass custom CSS to the ``buttons`` and/or ``icons`` with thte following:

	$('.editor').wysiwyg({
		css: {
			buttons: {
				color: 'red'
			},
			icons: {
				fontSize: '1em'
			}
		}
	});

=============
Custom Events
=============

You can modify the following functions:

``before``,
``edit``,
``save``,
``after``

With the following syntax:

	$('.editor').wysiwyg({
		events: {
			edit: {
				console.log('Yep, you have opened the editor')
			},
			save: {
				$.post('script.php', {
					id: '13'
				}).done(function(){
					alert('Done with your AJAX sir!');
				});
			}
		}
	});

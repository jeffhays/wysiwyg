<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet" href="css/font-awesome.min.css">
</head>
<body>
	<div class="editor">
	    <h1>This article is editable!</h1>
	    <p>Just click on the <b>EDIT</b> button <ins>below</ins> its content. Then you'll be able to
	        edit, add or remove whatever you want.</p>
	    <p>This <em>WYSIWYG</em> (<b>W</b>hat <b>Y</b>ou <b>S</b>ee <b>I</b>s <b>W</b>hat <b>Y</b>ou <b>G</b>et) is made
	        with few lines of <b>JavaScript</b>!</p>
	</div>
	<hr>
	<div class="editor">
	    <h1>This article is editable!</h1>
	    <p>Just click on the <b>EDIT</b> button <ins>below</ins> its content. Then you'll be able to
	        edit, add or remove whatever you want.</p>
	    <p>This <em>WYSIWYG</em> (<b>W</b>hat <b>Y</b>ou <b>S</b>ee <b>I</b>s <b>W</b>hat <b>Y</b>ou <b>G</b>et) is made
	        with few lines of <b>JavaScript</b>!</p>
	</div>
	<hr>
	<div class="editor">
	    <h1>This article is editable!</h1>
	    <p>Just click on the <b>EDIT</b> button <ins>below</ins> its content. Then you'll be able to
	        edit, add or remove whatever you want.</p>
	    <p>This <em>WYSIWYG</em> (<b>W</b>hat <b>Y</b>ou <b>S</b>ee <b>I</b>s <b>W</b>hat <b>Y</b>ou <b>G</b>et) is made
	        with few lines of <b>JavaScript</b>!</p>
	</div>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="js/wysiwyg.js"></script>
	<script>
	jQuery(document).ready(function($){
		var test = $('.editor').wysiwyg({
			css: {
				buttons: {
					padding: '.6em'
				},
				icons: {
					color: 'red'
				}
			}
		});
	});
	</script>
</body>
</html>
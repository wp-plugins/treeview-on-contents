<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>


<meta charset="<?php echo get_option('blog_charset'); ?>" />

<title><?php _e('TreeView On Contents', 'treeview-on-contents'); ?></title>

<link rel="stylesheet" type="text/css" href="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/themes/advanced/skins/wp_theme/dialog.css" />
<link rel="stylesheet" type="text/css" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/css/jquery.treeview.css" />

<style>
<!--

.modal{opacity: 0; display:none;}
.close{cursor: pointer;}
.modalBody{position: fixed; z-index:1000; color: #eee; text-align: center; height:92%; width:92% ; left:5%; top:5%; }
.modalBK{position: fixed; z-index:999; height:100%; width:100%;background:#000; opacity: 0.8;}

#previewtreeview .ui-droppable-hover {
	background: #00ff8f;
}

#draggtarget > div > span {
	border-bottom: solid 2px #ff0000;
}


div.radio-group {
	margin-bottom: 32px;
}
div.radio-group div {
	position: relative;
}
div.radio-group input {
	opacity: 0;
	filter: alpha(opacity=0);
	position: absolute;
	left: 0px;
	outline:none;
}
div.radio-group label {
	cursor: pointer;
	padding: 5px 10px;
	float: left;
	border: solid 1px #aaa;
	margin-left: -1px;
	background: #eee;
	background-image: -moz-linear-gradient(top, #F6F6F6, #ccc);
	background-image: -webkit-gradient(linear, left top, left bottom, from(#F6F6F6), to(#ccc));
	box-shadow: 2px 2px 6px #aaa;
	-webkit-box-shadow: 2px 2px 6px #aaa;
	-moz-box-shadow: 2px 2px 6px #aaa;
	text-shadow: 1px 1px 0px #fff;
}
div.radio-group label:first-child {
	/* border-radius: 7px 0px 0px 7px / 7px 0px 0px 7px; */
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;
	-webkit-border-top-left-radius: 7px;
	-webkit-border-bottom-left-radius: 7px;
	-moz-border-radius-topleft: 7px;
	-moz-border-radius-bottomleft: 7px;
}
div.radio-group label:last-child {
	/* border-radius: 0px 7px 7px 0px / 0px 7px 7px 0px; */
	border-top-right-radius: 7px;
	border-bottom-right-radius: 7px;
	-webkit-border-top-right-radius: 7px;
	-webkit-border-bottom-right-radius: 7px;
	-moz-border-radius-topright: 7px;
	-moz-border-radius-bottomright: 7px;
}
div.radio-group label.checked  {
	color: #fff;
	background: #B3B3B3;
	background-image: -moz-linear-gradient(top, #C3C3C3, #DBDBDB);
	background-image: -webkit-gradient(linear, left top, left bottom, from(#C3C3C3), to(#DBDBDB));
	text-shadow: 0px 0px 0px #fff;
}


-->
</style>

</head>

<body>

<div id="dropwindow" class="modal wd1">
	<div class="modalBody close" ondragover="onFileOver(event);" ondrop="onFileDrop(event);" 
				style="position:fixed;">
		<div>
			<p><br></p>
			<p><br></p>
			<p><b><?php _e('Import files to treeview', 'treeview-on-contents'); ?></b></p>
			<p><b><?php _e('Click to close', 'treeview-on-contents'); ?></b></p>
			<p><br></p>
			<span id="message-of-drop">
				<b><?php _e('Please drop file or directory.', 'treeview-on-contents'); ?></b>
			</span>
		</div>
		
	</div>
	<div class="modalBK"></div>
</div>

<div class="contextMenu" id="tvoncMenu" style="visibility: hidden;">
	<ul>
		<li id="import"><img src="import.gif" /><?php _e('Import OS files', 'treeview-on-contents'); ?></li>
		<li id="folder"><img src="folder-closed.gif" /><?php _e('Add Folder', 'treeview-on-contents'); ?></li>
		<li id="file"><img src="file.gif" /><?php _e('Add File', 'treeview-on-contents'); ?></li>
		<li id="iconchange"><img src="folder-closed.gif" /><img src="change.png" /><img src="file.gif" /><br><?php _e('Change Icon', 'treeview-on-contents'); ?></li>
		<li id="delete"><img src="cross.png" /><?php _e('Delete', 'treeview-on-contents'); ?></li>
	</ul>
</div>

<div class="mceActionPanel">
	<div style="float: left">
		<a href="http://wordpress.org/extend/plugins/treeview-on-contents/" target="new" 
			title="<?php _e('Please check compatibility and rating for this plugin will continue to improve.', 'treeview-on-contents') ?>">
			<b><?php _e('Rate it now!', 'treeview-on-contents') ?></b>
			</a>
	</div>
	<form action="#">
		<div style="float: right">
			<input type="button" id="cancel" name="cancel" value="<?php _e('Cancel', 'treeview-on-contents'); ?>" onclick="tinyMCEPopup.close();" />
		</div>
		<div style="float: right">
			<input type="submit" id="insert" name="insert" value="<?php _e('Insert', 'treeview-on-contents'); ?>" onclick="tvonc_InsertTreeView();" />
		</div>
	</form>
	<br style="clear:both" />
</div>


<b><?php _e('Tree Style', 'treeview-on-contents') ?></b><br>
<div class="radio-group clearfix">
	<label>
		<?php _e('Normal', 'treeview-on-contents'); ?>
		<input type="radio" name="treeviewtype" value="treeview" onclick="javascript:tvonc_setViewType(0);">
	</label>
	<label>
		<?php _e('Red', 'treeview-on-contents'); ?>
		<input type="radio" name="treeviewtype" value="treeview-red" onclick="javascript:tvonc_setViewType(1);">
	</label>
	<label>
		<?php _e('Black', 'treeview-on-contents'); ?>
		<input type="radio" name="treeviewtype" value="treeview-black" onclick="javascript:tvonc_setViewType(2);">
	</label>
	<label>
		<?php _e('FamFamFam', 'treeview-on-contents'); ?>
		<input type="radio" name="treeviewtype" value="treeview-famfamfam" onclick="javascript:tvonc_setViewType(3);">
	</label>
	<label>
		<?php _e('File', 'treeview-on-contents'); ?>
		<input type="radio" name="treeviewtype" value="filetree" onclick="javascript:tvonc_setViewType(4);">
	</label>
</div>

<from>
<div id="previewtreeview"></div>
</from>


<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/jquery.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/ui/jquery.ui.core.min.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/ui/jquery.ui.widget.min.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/ui/jquery.ui.mouse.min.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/ui/jquery.ui.draggable.min.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/jquery/ui/jquery.ui.droppable.min.js"></script>

<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-includes/js/tinymce/tiny_mce_popup.js"></script>


<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/js/jquery.treeview.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/js/jquery.treeview.edit.js"></script>

<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/jquery.contextmenu.r2.js"></script>
<script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/tvonc_mce.js"></script>

</body>
</html>

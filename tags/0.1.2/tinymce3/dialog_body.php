<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>


<meta charset="<?php echo get_option('blog_charset'); ?>" />

<!-- <?php load_plugin_textdomain('treeview-on-contents', false, get_option('siteurl').'/wp-content/plugins/treeview-on-contents/languages/' ); ?> -->


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

-->
</style>

</head>

<body>

<div id="dropwindow" class="modal wd1">
	<div class="modalBody close" ondragover="onFileOver(event)" ondrop="onFileDrop(event)" 
				style="position:ixed;">
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

<p><?php _e('Would you please determine the value of this plugin.', 'treeview-on-contents') ?></p>

<div class="mceActionPanel">
	<div style="float: left">
		<form action="https://www.paypal.com/cgi-bin/webscr" target="_new" method="post">
		<input type="hidden" name="cmd" value="_s-xclick">
		<input type="hidden" name="hosted_button_id" value="Y6HYEXJBHUCE4">
		<input type="image" src="https://www.paypal.com/images/x-click-but7.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online.">
		<img alt="" border="0" src="https://www.paypalobjects.com/ja_JP/i/scr/pixel.gif" width="1" height="1">
		</form>
	</div>
		<form action="#">
			<div style="float: right"><input type="button" id="cancel" name="cancel" value="<?php _e('Cancel', 'treeview-on-contents'); ?>" onclick="tinyMCEPopup.close();" /></div>
			<div style="float: right"><input type="submit" id="insert" name="insert" value="<?php _e('Insert', 'treeview-on-contents'); ?>" onclick="tvonc_InsertTreeView();" /></div>
		<br style="clear:both" />
	</form>
</div>

<from action="#">
<input type="radio" name="treeviewtype" value="treeview" onclick="javascript:tvonc_setViewType(0);"><?php _e('normal', 'treeview-on-contents'); ?>
<input type="radio" name="treeviewtype" value="treeview-red" onclick="javascript:tvonc_setViewType(1);"><?php _e('red', 'treeview-on-contents'); ?>
<input type="radio" name="treeviewtype" value="treeview-black" onclick="javascript:tvonc_setViewType(2);"><?php _e('black', 'treeview-on-contents'); ?>
<input type="radio" name="treeviewtype" value="treeview-famfamfam" onclick="javascript:tvonc_setViewType(3);"><?php _e('famfamfam', 'treeview-on-contents'); ?>
<input type="radio" name="treeviewtype" value="filetree" onclick="javascript:tvonc_setViewType(4);"><?php _e('file', 'treeview-on-contents'); ?>
</from>

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

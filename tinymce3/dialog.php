<?php
wp_enqueue_script('jquery-ui-core');
wp_enqueue_script('jquery-ui-widget');
wp_enqueue_script('jquery-ui-mouse');
wp_enqueue_script('jquery-ui-draggable');
wp_enqueue_script('jquery-ui-droppable');
wp_enqueue_script('jquery');

global $wp_scripts;
?>

<!DOCTYPE html>
<html>
    <head>
    
        <title><?php _e('TreeView On Contents', 'treeview-on-contents'); ?></title>
        <meta http-equiv="Content-Type" content="<?php bloginfo('html_type'); ?>; charset=<?php echo get_option('blog_charset'); ?>" />

        <script type="text/javascript" src="<?php echo site_url(); ?>/wp-includes/js/tinymce/tiny_mce_popup.js"></script>
        <script type="text/javascript" src="<?php echo site_url(); ?>/wp-includes/js/tinymce/utils/form_utils.js"></script>
        <base target="_self" />
        <?php wp_print_scripts(); ?>
        
        <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/js/jquery.treeview.js"></script>
        <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/js/jquery.treeview.edit.js"></script>
        <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/jquery.contextmenu.r2.js"></script>
        <script type="text/javascript" src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/tvonc_mce.js"></script>
        
        <link rel="stylesheet" type="text/css" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/css/jquery.treeview.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/css/tvonc-mce.css" />
        
    </head>

    <body id="tvoncdialog">
    
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

<div class="contextMenu" id="tvoncMenu" style="visibility: hidden;display: none;">
	<ul>
		<li id="import"><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/import.gif" /><?php _e('Import OS files', 'treeview-on-contents'); ?></li>
		<li id="folder"><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/folder-closed.gif" /><?php _e('Add Folder', 'treeview-on-contents'); ?></li>
		<li id="file"><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/file.gif" /><?php _e('Add File', 'treeview-on-contents'); ?></li>
		<li id="iconchange"><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/folder-closed.gif" /><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/change.png" /><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/file.gif" /><br><?php _e('Change Icon', 'treeview-on-contents'); ?></li>
		<li id="delete"><img src="<?php echo get_option('siteurl') ?>/wp-content/plugins/treeview-on-contents/tinymce3/cross.png" /><?php _e('Delete', 'treeview-on-contents'); ?></li>
	</ul>
</div>

<div class="tvonc-radio-group">
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
<div class="mceActionPanel">
	<form action="#">
		<div style="float: right">
			<input type="button" id="cancel" name="cancel" value="<?php _e('Cancel', 'treeview-on-contents'); ?>" onclick="tinyMCEPopup.close();" />
		</div>
		<div style="float: right">
			<input type="submit" id="insert" name="insert" value="<?php _e('Insert', 'treeview-on-contents'); ?>" onclick="tvonc_InsertTreeView();" />
		</div>
	</form>
</div>
<br style="clear:both" />

<from>
<div id="previewtreeview"></div>
</from>

    </body>
</html>

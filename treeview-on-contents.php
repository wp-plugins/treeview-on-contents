<?php
/*
 * Plugin Name: TreeView On Contents
 * Plugin URI: http://wordpress.org/extend/plugins/treeview-on-contents/
 * Description: TreeView On Contents.
 * Version: 0.1.3
 * Author: sekishi
 * Author URI: http://lab.planetleaf.com/
 * Text Domain: treeview-on-contents
 * License: GPLv2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/


// localization
load_plugin_textdomain( 'treeview-on-contents', false, dirname(plugin_basename( __FILE__ )). '/languages/' );

function wp_tvonc_plugin_url( $path = '' ) {
	$url = untrailingslashit( WP_TREEVIEWONCONTENTS_PLUGIN_URL );

	if ( ! empty( $path ) && is_string( $path ) && false === strpos( $path, '..' ) )
		$url .= '/' . ltrim( $path, '/' );

	return $url;
}


class TreeViewOnContents {
	var $version = '0.1.3';
	var $buttons = array();
	
	
	function TreeViewOnContents() {
		
		if ( ! defined( 'WP_TREEVIEWONCONTENTS_PLUGIN_URL' ) )
			define( 'WP_TREEVIEWONCONTENTS_PLUGIN_URL', untrailingslashit( plugins_url( '', __FILE__ ) ) );
		
		$this->tvonc_addbuttons();
		
		if( !is_admin() ){
			add_action('wp_print_scripts', array(&$this,'add_jquery_treeview_js') );
			
		}

	}
	
	function tvonc_addbuttons() {
		global $wp_version, $wpmu_version, $shortcode_tags, $wp_scripts;
		
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) {
			return;
		}
		//load_plugin_textdomain("advanced-code-button", false, dirname(plugin_basename(__FILE__)) . '/languages' );
		
		if ( get_user_option('rich_editing') == 'true') {
			add_filter( 'mce_external_plugins', array(&$this, 'mce_external_plugins') );
			add_filter( 'mce_buttons', array(&$this, 'mce_buttons') );
		}
	}
	
	


	// Load the custom TinyMCE plugin
	function mce_external_plugins( $plugins ) {
		$plugins['TreeViewOnContents'] = wp_tvonc_plugin_url('tinymce3/editor_plugin.js');
		return $plugins;
	}
	// Add the custom TinyMCE buttons
	function mce_buttons( $buttons ) {
		array_push( $buttons, 'treeview-on-contents-button' );
		return $buttons;
	}


	function add_jquery_treeview_js() {
		wp_enqueue_script( 'jquerytreeview_js',
			wp_tvonc_plugin_url( 'js/jquery.treeview.js' ),
			array('jquery'),
			$this->version );
		
		wp_enqueue_style( 'jquerytreeview_css',
			wp_tvonc_plugin_url( 'css/jquery.treeview.css' ),
			array(),
			$this->version, 'all' );
		
		
	}
}


function GenerateTreeViewOnContents($atts,$content=null) {
	return $content;
}

function add_css_js()
{
	global $wp_query;
	$posts   = $wp_query->posts;
	$pattern = '/\[' . preg_quote("tvoncmeta") . '[^\]]*\]/im';
	$hasTeaser = !( is_single() || is_page() );
	
	$js = "";
	
	foreach($posts as $post) {
		if (isset($post->post_content)) {
			$post_content = $post->post_content;
			if ( !empty($post_content) && preg_match_all('/\[tvoncmeta([^\]]*)\]([\s\S<]*?)\[/',$post_content,$matches) ) {
				$tvonc_nums = count($matches[0]);
				for( $ii = 0; $ii < $tvonc_nums ; $ii++ ){
					if( preg_match('/<ul class=".*?" id="(.*?)"/',$matches[2][$ii],$prematch ) ){
						$js .= 'jQuery("#'.$prematch[1].'").treeview( ' . $matches[1][$ii] . " );\n";
					}
				}
			}
		}
	}
	$js = "<script type=\"text/javascript\">\njQuery(document).ready(function() {".
		$js.
		"});</script>\n";
	
	echo $js;
}

add_shortcode('tvoncmeta', 'GenerateTreeViewOnContents');
add_action('wp_head', 'add_css_js' );

// Start this plugin once all other plugins are fully loaded
add_action('init', 'TreeViewOnContents' );




function TreeViewOnContents() {
	
	global $TreeViewOnContents;
	$TreeViewOnContents = new TreeViewOnContents();
	
}

?>

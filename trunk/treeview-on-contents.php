<?php
/*
 * Plugin Name: TreeView On Contents
 * Plugin URI: http://lab.planetleaf.com/development/wordpress/treeview-on-contents-plugin.html
 * Description: TreeView On Contents.
 * Version: 0.1.4
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
	var $version = '0.1.4';
	var $buttons = array();
	
	
	function TreeViewOnContents() {
		
		if ( ! defined( 'WP_TREEVIEWONCONTENTS_PLUGIN_URL' ) )
			define( 'WP_TREEVIEWONCONTENTS_PLUGIN_URL', untrailingslashit( plugins_url( '', __FILE__ ) ) );
		
		$this->tvonc_addbuttons();
		
		if( !is_admin() ){
			add_action( 'wp_print_scripts' , array(&$this,'add_jquery_treeview_js') );
		}else{
			add_action( 'admin_head' , array( &$this, 'tvonc_action_javascript' ), 15 );
		}
	}
	
	function tvonc_addbuttons() {
		global $wp_version, $wpmu_version, $shortcode_tags, $wp_scripts;
		
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) {
			return;
		}
		
		if ( get_user_option('rich_editing') == 'true') {
			add_filter( 'mce_external_plugins', array(&$this, 'mce_external_plugins') );
			add_filter( 'mce_buttons', array(&$this, 'mce_buttons') );
		}
	}
	
 	function tvonc_action_javascript() {
		echo '<meta id="treeview-on-contents" name="use_easy_block_selector" content="' . get_option( 'use_easy_block_selector') . '" />' . "\n";
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
	return do_shortcode( $content );
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

add_action('admin_menu', 'tvonc_plugin_menu');

function tvonc_plugin_menu() {
	add_options_page('TreeView On Contents', 'TreeView On Contents', 8, __FILE__, 'tvonc_options');
}

function tvonc_options() {
    $use_easy_block_selector = get_option( 'use_easy_block_selector' , 1 );
?>
<div class="wrap">
    <?php screen_icon(); ?>

    <h2>TreeView On Contents: <?php _e('Options', 'treeview-on-contents') ?></h2>
    <form method="post" action="options.php">
        <?php wp_nonce_field('update-options'); ?>
        <table class="form-table">
            <tr valign="top">
                <th scope="row"><?php _e('Extension of the range selection', 'treeview-on-contents') ?></th>
                <td><fieldset>
                    <label for="use_easy_block_selector">
                        <input type="checkbox" name="use_easy_block_selector" value="1" align="left" <?php checked( $use_easy_block_selector ); ?> >                                    
                        <?php _e('Enable the easy selection of short code and html tags.', 'treeview-on-contents') ?>
                    </label>
                </fieldset></td>
            </tr>
        </table>

        <p class="submit">
            <input type="hidden" name="action" value="update" />
            <input type="hidden" name="page_options" value="use_easy_block_selector" />
            <input type="submit" name="update_option" class="button-primary" value="<?php _e('Save Changes'); ?>" />
        </p>

    </form>
</div>
<?php
}
?>


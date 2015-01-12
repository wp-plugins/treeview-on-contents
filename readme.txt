=== Treeview On Contents ===
Contributors: sekishi
Donate link: http://lab.planetleaf.com/donate/
Tags: tinymce, editor , tree , view , contents

Requires at least: 3.3
Tested up to: 4.1
Stable tag: 0.1.8
License: GPLv2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Enable editing of the treeview on TinyMCE.

== Description ==

Enable the jQuery treeview on the page of wordpress.
It is easily editable on the TinyMCE.

Automatically selects the enclosing shortcodes.(version 0.1.4 or later)
This mode is the same as the Easy Block Selector plugin.

Treeview On Contents Plugin Overview.
http://lab.planetleaf.com/development/wordpress/treeview-on-contents-plugin.html



This plugin used jQuery Treeview Plugin.
jQuery Treeview plugin http://bassistance.de/jquery-plugins/jquery-plugin-treeview/

A setup of JQuery Treeview Plugin is possible as the option of a shortcode [tvoncmeta].

== Installation ==

1. Upload the entire `treeview-on-contents` folder to the `/wp-content/plugins/` directory.
1. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= treeview is broken when you install the google analyticator. =
Please disable the setting of Outbound link tracking.

== Screenshots ==

1. Re-editing is possible when you select a shortcode [tvoncmeta].
2. Html tag in a treeview can be embedded.
3. Files can be imported using FILE API. 
4. Treeview can be edited by drag and drop.

== Changelog ==

= 0.1.8 =
* support wordpress version 3.9 or higher ( tinyMCE version 4.1).

= 0.1.7 =
* support wordpress version 3.9 or higher ( tinyMCE version 4.0).

= 0.1.6 =
* Fixed a null check of posts.

= 0.1.5 =
* Fixed a line feed code in the source code.
* Fixed a parameters in add_option_page.

= 0.1.4 =
* Automatically selects the enclosing shortcodes.
* Fixed a bug when selecting a list tag.
* Support a nested shortcode.
* Add the option to dashboard setting.

= 0.1.3 =
* New design of the dialog.
* Fixed a bug where the event(hyperlinks) would fire when you drop the item.
* Fixed a bug where the radio buttons are not getting reflected in some versions of wordpress.

= 0.1.2 =
* Enable a localization.
* Added Japanese localization file.

= 0.1.1 =
* The selected text when you try to change the item name.
* Work on the wordpress version 3.3 or later.

= 0.1.0 =
* NEW: Initial release.


== Upgrade Notice ==

No upgrade, so far.


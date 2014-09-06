/*
 * TreeView On Contents - wordpress editor plugin
 *
 * Author: sekishi
 * Contributors:
 * Parts of this plugin are inspired by Joern Zaefferer's Treeview plugin
 *
 * License: GPLv2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Version: 0.1.7
 * Date: 9 sep 2014
 * 
 * Copyright 2013 sekishi http://lab.planetleaf.com/
 * For documentation visit http://lab.planetleaf.com/
 *
 */

function getuuid() {
	var c4 = function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (c4()+c4()+'_'+c4()+'_'+c4()+'_'+c4()+'_'+c4()+c4()+c4());
}

var draggnode;
var dragswitch = 0;
var blinkinterval;

var SHORT_CODE = 'tvoncmeta';
var SHORT_CODE_POTIONS;
var FUNC_CODE;

var TREEVIEW_OPTION = '{ animated: "fast",toggle: "false" }';

var ROOTFOLDER_STR = '<div><span class="root">=== tree edit root ===</span></div>';
var FOLDER_STR = '<div><span class="folder">new item</span></div>';
var FILE_STR = '<div><span class="file">new item</span></div>';

function filesSelected(files) {
	var tag = '';
	for (var i = 0; i < files.length; i++) {
		if( files[i].type === 'folder' || files[i].size === 0 ){
			tag = tag + '<li><div><span class="folder">' + files[i].name + '</span></div></li>';
		}else{
			tag = tag + '<li><div><span class="file">' + files[i].name + '</span></div></li>';
		}
	}
	var rootnode = jQuery('#draggtarget');
	if( rootnode.size() === 0 ){
		rootnode = jQuery('#previewtreeview').find('ul:first > ul > li');
	}
	var node = rootnode.find('ul:first');
	if( !node.html() ){
		node = rootnode;
		var branches = node.append( '<ul>' + tag +'</ul>' );
		tvonc_source2html();
		jQuery('#'+FUNC_CODE).treeview();
		jQuery('#'+FUNC_CODE).treeview({ add: branches });
		jQuery('#'+FUNC_CODE).treeview();
	}else{
		var branches = node.append( tag );
		tvonc_source2html();
		jQuery('#'+FUNC_CODE).treeview();
		jQuery('#'+FUNC_CODE).treeview({ add: branches });
		jQuery('#'+FUNC_CODE).treeview();
	}
	
}

function onFileOver( event ) {
	event.preventDefault();
}

function onFileDrop( event ) {
	event.preventDefault();
	filesSelected(event.dataTransfer.files);
}

function eventdisabler( event ) {
	event.preventDefault();
	return false;
}

function tvonc_setViewType( no ) {

	var treetypr = new Array( "treeview" , "treeview-red" , "treeview-black" , "treeview-famfamfam" , "filetree treeview" );

	jQuery('#previewtreeview ul:first').removeAttr('class');
	jQuery('#previewtreeview ul:first').addClass( treetypr[ no ] );
	jQuery('#'+FUNC_CODE).treeview();
}

function get_tvonc_contents() {
	var inst;
	var tmce_ver=window.tinyMCE.majorVersion;
	if( tmce_ver == "2" ){
		inst = tinyMCE.getInstanceById('content');
	} else {
		inst = tinyMCE.get('content');
	}
	return inst;
}


function tvonc_InsertTreeView() {
	var code;
	
	jQuery("#previewtreeview a[href]").unbind('click', eventdisabler);
	
	jQuery('#previewtreeview li').removeAttr('style');
	jQuery('#previewtreeview *').removeClass('ui-droppable ui-draggable last collapsable lastCollapsable expandable lastExpandable');
	jQuery('#previewtreeview *').removeClass('hitarea collapsable-hitarea lastCollapsable-hitarea');
	jQuery('#previewtreeview li').each(
		function(){
			if( !jQuery(this).hasClass() ){
				jQuery(this).removeAttr('class');
			}
		}
	);
	
	
	jQuery('#draggtarget').removeAttr('id');
	
	jQuery('#previewtreeview ul:empty').remove();
	jQuery('#previewtreeview div:empty').remove();
	
	// edit dummy root unwaped.
	var editheader = jQuery('#previewtreeview span:first.root');
	if( !(typeof editheader === 'undefined') ){
		//
		editheader.closest('div').remove();
		jQuery('#previewtreeview ul:first > ul > li').children().unwrap();
		jQuery('#previewtreeview ul:first > ul > ul').children().unwrap();
	}
	
	jQuery('#previewtreeview div').each(function() {
		jQuery( this ).children().unwrap();
	});
	
	code = jQuery('#previewtreeview').html();
	
	code = code.replace(/<li id=".*?"/g,"<li");
	
	var inst = get_tvonc_contents();
	
	var html = inst.selection.getContent();
	if (code) {
		html = code;
	}
	var tag;
	
	if( typeof SHORT_CODE_POTIONS === 'undefined' || SHORT_CODE_POTIONS === null )
	{
		tag = '[' + SHORT_CODE + ' {animated: "fast"} ]' + html + '[/' + SHORT_CODE + ']';
	}else{
		tag = '[' + SHORT_CODE + SHORT_CODE_POTIONS[1] + ']' + html + '[/' + SHORT_CODE + ']';
	}
	
	var tmce_ver=window.tinyMCE.majorVersion;
	if( tmce_ver >= "4" ) {
		window.tinyMCE.execCommand('mceInsertContent', false, tag);
	} else {
		 window.tinyMCE.execInstanceCommand('content', 'mceInsertContent', false, tag);
	}
	
	tinyMCEPopup.close();
	
	return;
}



function tvonc_setFocusSourceCode() {
	var inst = get_tvonc_contents();
	var html = inst.selection.getContent();
	
	if( html ) {
		html = tvonc_removePtag(html);
		html = tvonc_unescapeHTML(html);
		html = tvonc_removeShortcode(html);

		FUNC_CODE = 'TV'+getuuid();
		
		html = html.replace(/id="(.*?)"/,' id="'+FUNC_CODE+'"');
		
		var viewtypestr = html.match(/<ul class="(.*?)"/);
		var ii = 0;
		if( viewtypestr === null ){
			viewtypestr = html.match(/id="(.*?)" class="(.*?)"/);
			if( viewtypestr ){
				viewtypestr[1] = viewtypestr[2];
			}
		}
		
		if( viewtypestr ){
			if( viewtypestr[1] === 'treeview' )ii = 0;
			if( viewtypestr[1] === 'treeview-red' )ii = 1;
			if( viewtypestr[1] === 'treeview-red treeview' )ii = 1;
			if( viewtypestr[1] === 'treeview-black' )ii = 2;
			if( viewtypestr[1] === 'treeview-black treeview' )ii = 2;
			if( viewtypestr[1] === 'treeview-famfamfam' )ii = 3;
			if( viewtypestr[1] === 'treeview-famfamfam treeview' )ii = 3;
			if( viewtypestr[1] === 'filetree' )ii = 4;
			if( viewtypestr[1] === 'filetree treeview' )ii = 4;
		}else{
			ii = 4;
			var viewtypestr = html.match(/ul class="(.*?)"/);
		}
		//document.getElementsByName('treeviewtype')[ii].checked = true;
		jQuery("input[name='treeviewtype']:eq("+ii+")").attr("checked", true);
		jQuery("input[name='treeviewtype']:eq("+ii+")").parents().addClass('checked');
		
		jQuery('#previewtreeview').html(html);
		
		// wrap div+span
		jQuery('#previewtreeview li').each( function() {
			if( !(typeof jQuery( this ).contents().first()[0].data === 'undefined') ){
				if( jQuery( this ).children().is('ul') ){
					jQuery( jQuery( this ).contents().first()[0] ).wrap('<div><span class="folder">');
				}else{
					jQuery( jQuery( this ).contents().first()[0] ).wrap('<div><span class="file">');
				}
			}
		});
		// remove a <br> tag for mce optimize.
		jQuery('#previewtreeview span').next('br').remove();
		// wrap div
		jQuery('#previewtreeview li > span').each( function() {
			jQuery( this ).wrap('<div>');//div
		});
		
		// wrap treeview header
		if( !jQuery('#previewtreeview ul:first > ul').is('ul') ){
			jQuery('#previewtreeview ul:first').wrap('<ul class="filetree treeview" id="'+FUNC_CODE+'"><ul><li>');
		}else{
			jQuery('#previewtreeview ul:first > ul').wrap('<ul><li>');
		}
		// wraped edit dummy root.
		jQuery('#previewtreeview ul:first > ul > li ').prepend( ROOTFOLDER_STR );
		
	}else{
		FUNC_CODE = "TV"+getuuid();
		html = '<ul class="filetree treeview" id="'+FUNC_CODE+'"><ul><li>'+ROOTFOLDER_STR+'</li></ul></ul>';
	//	document.getElementsByName("treeviewtype")[4].checked = true;
		jQuery("input[name='treeviewtype']:eq(4)").attr("checked", true);
		jQuery("input[name='treeviewtype']:eq(4)").parents().addClass('checked');
		
		jQuery('#previewtreeview').html(html);
	}
	jQuery('#'+FUNC_CODE).treeview();
	
	jQuery("#previewtreeview a[href]").bind("click", eventdisabler);
	jQuery("*").bind("load", eventdisabler);
	
	fullbindContextMenu();
	
	
	draggnode = jQuery("#previewtreeview li:first");
	draggnode.attr('id', 'draggtarget');
	
}

function tvonc_modifytreeview() {
	
	jQuery('#previewtreeview *').removeClass('ui-droppable ui-draggable last collapsable lastCollapsable expandable lastExpandable');
	jQuery('#previewtreeview *').removeClass('hitarea collapsable-hitarea lastCollapsable-hitarea');
	jQuery('#previewtreeview li').each(
		function(){
			if( !jQuery(this).hasClass() ){
				jQuery(this).removeAttr('class');
			}
		}
	);
	
	jQuery('#previewtreeview ul:empty').remove();
	jQuery('#previewtreeview div:empty').remove();
	
	
	jQuery('#'+FUNC_CODE).treeview();
	jQuery("#previewtreeview a[href]").bind("click", eventdisabler);
	fullbindContextMenu();
}


function tvonc_source2html() {
	jQuery('#previewtreeview li').removeAttr('style');
	jQuery('#previewtreeview li').removeClass('ui-droppable ui-draggable last collapsable lastCollapsable expandable lastExpandable');
	jQuery('#previewtreeview div').removeClass('hitarea collapsable-hitarea lastCollapsable-hitarea');
	jQuery('#previewtreeview li').each(
		function(){
			if( !jQuery(this).hasClass() ){
				jQuery(this).removeAttr('class');
			}
		}
	);
	
//	jQuery('#draggtarget').removeAttr('id');
	
	jQuery('#previewtreeview ul:empty').remove();
	jQuery('#previewtreeview div:empty').remove();

	var html  = jQuery('#previewtreeview').html();
	jQuery('#previewtreeview').html(html);

	jQuery('#'+FUNC_CODE).treeview();
	jQuery("#previewtreeview a[href]").bind("click", eventdisabler);
	fullbindContextMenu();
}

function tvonc_removeHTML(str) {
	return str.replace(/<.+?>/g,"");
}
function tvonc_escapeHTML(str) {
	str = str.replace(/&/g,"&amp;");
	str = str.replace(/\\/g,"&yen;");
	str = str.replace(/\|/g,"&brvbar;");
	str = str.replace(/"/g,"&quot;");
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	str = str.replace(/[\n|\r]/g,"\r");
	return str;
}

function tvonc_unescapeHTML(str) {
	str = str.replace(/&lt;/g,"<");
	str = str.replace(/&gt;/g,">");
	str = str.replace(/&quot;/g,'"');
	str = str.replace(/&brvbar;/g,"|");
	str = str.replace(/&yen;/g,"\\");
	str = str.replace(/&amp;/g,"&");
	return str;
}
function tvonc_removePtag(html) {
	html = html.replace(/<p>/g,"");
	html = html.replace(/<\/p>/g,"");
	return html;
}

function tvonc_removeShortcode(html) {
	SHORT_CODE_POTIONS = String(html).match('\\[' + SHORT_CODE + '(.*?)\\]');
	
	var reg = new RegExp('\\[' + SHORT_CODE + '.*?\\]');
	var tag = String(html).replace(reg,"");
	
	reg = new RegExp('\\[\/' + SHORT_CODE + '.*?\\]');
	tag = String(tag).replace(reg,"");
	
	return tag;
}

function init() {
	tinyMCEPopup.resizeToInnerSize();
	tvonc_setFocusSourceCode();
}
tinyMCEPopup.executeOnLoad("init();");

function fullbindContextMenu() {
	
	jQuery('#previewtreeview').find('li,div').contextMenu('tvoncMenu', {
		bindings: {
			'import': function( t ) {
				
				var mW = jQuery( this ).innerWidth() / 2;
				var mH = jQuery( this ).innerHeight() / 2;
				dragswitch = 0;
				
				tvonc_source2html();
				
				blinkinterval = setInterval(
						function(){
							jQuery("#message-of-drop").fadeOut(800,function(){jQuery(this).fadeIn(800);});
						},1600
					);
				jQuery('#dropwindow').css({'display':'block' });
				jQuery('#dropwindow').animate({'opacity':'0.8'},'fast');
				
			},
			'folder': function( t ) {
				if( jQuery( t ).is('li') ){
					if( jQuery( t ).closest('li').parent().parent().is('ul') )
						return;
					
					var branches = jQuery( t ).parent().append('<li>'+FOLDER_STR+'</li>');
					jQuery('#'+FUNC_CODE).treeview({ add: branches });
					tvonc_source2html();
				}else{
					var node = jQuery( t ).closest('li').find('ul:first');
					if( !node.html() ){
						node = jQuery( t ).closest('li');
						if( node.is('li') ){
							// --+
							//	 +- new 
							// 
							var branches = node.append('<ul><li>'+FOLDER_STR+'</li></ul>');
							jQuery('#'+FUNC_CODE).treeview({ add: branches });
							tvonc_source2html();
						}
					}else{
						// --+
						//	 +-folder
						//	 +- new 
						// 
						var branches = node.append('<li>'+FOLDER_STR+'</li>');
						jQuery('#'+FUNC_CODE).treeview({ add: branches });
						tvonc_source2html();
					}
				}
			},
			'file': function( t ) {
				if( jQuery( t ).is('li') ){
					var branches = jQuery( t ).parent().append('<li>'+FILE_STR+'</li>');
					jQuery('#'+FUNC_CODE).treeview({ add: branches });
					tvonc_source2html();
				}else{
					var node = jQuery( t ).closest('li').find('ul:first');
					if( !node.html() ){
						node = jQuery( t ).closest('li');
						if( node.is('li') ){
							var branches = node.append('<ul><li>'+FILE_STR+'</li></ul>');
							jQuery('#'+FUNC_CODE).treeview({ add: branches });
							tvonc_source2html();
						}
					}else{
						var branches = node.append('<li>'+FILE_STR+'</li>');
						jQuery('#'+FUNC_CODE).treeview({ add: branches });
						tvonc_source2html();
					}
				}
			},
			
			'iconchange': function( t ) {
				if( jQuery( t ).is('li') ){
				}else{
					var spannode = jQuery( t ).children('span');
					if( spannode.hasClass('folder') ){
						spannode.removeClass('folder');
						jQuery( t ).children('span').addClass('file');
					}else if( spannode.hasClass('file') ){
						spannode.removeClass('file');
						jQuery( t ).children('span').addClass('folder');
					}
				}
			},
			
			
			'delete': function( t ) {
				if (jQuery( t ).is('li') || jQuery( t ).parents('li').length) {
					jQuery('#draggtarget').remove();
					
					if( jQuery('#previewtreeview').children().children().html() ){
						tvonc_source2html();
					}else{
						var	branches = jQuery('#previewtreeview').children().append('<ul><li>'+ROOTFOLDER_STR+'</li></ul></ul>');
						jQuery('#'+FUNC_CODE).treeview({ add: branches });
						tvonc_source2html();
					}
					
				}
			}
		}
	});
}


jQuery(function() {
	
	var radio = jQuery('div.radio-group');
	radio.disableSelection();
	jQuery('input', radio).css({'opacity': '0'});
	jQuery('label', radio).click(function() {
		jQuery(this).parent().parent().each(function() {
			jQuery('label',this).removeClass('checked');	
		});
		jQuery(this).addClass('checked');
	});
	
	jQuery('.close,.modalBK').click(function(){
		jQuery('.modal').animate(
			{opacity:0},
			{
				duration:'fast',complete:
				function() {
					clearInterval( blinkinterval );
					jQuery('.modal').css({'display':'none'});
				}
			}
		);
	});	
	
	jQuery('#previewtreeview').dblclick( function(event) {
		if( jQuery(event.target).closest('li').parent().parent().is('ul') )
			return;
			
		// name edit
		var node = jQuery(event.target).closest('li').find('span:first');
		if( !jQuery(event.target).is('li') && !jQuery(event.target).is('div') && node.is('span') && node.text() ) {
			node.find('*').each(
				function(){
					jQuery(this).removeClass('hover');
					if( !jQuery(this).hasClass() ){
						jQuery(this).removeAttr('class');
					}
				});
			str = node.html();
			node.html("<input id='tempstrbox' name='tempstrbox' type='text' value='"+str+"'>");
			jQuery('#tempstrbox').focus().select();
			jQuery('#tempstrbox').focus().blur(function(){
				var inputVal = jQuery(this).val();
				if(inputVal===''){
					inputVal = this.defaultValue;
				};
				jQuery(this).parent().html(inputVal);
				tvonc_modifytreeview();
			});
			jQuery('#tempstrbox').focus().keypress(function(ev) {
				if ((ev.which && ev.which === 13) || (ev.keyCode && ev.keyCode === 13)) {
					var inputVal = jQuery(this).val();
					if(inputVal===''){
						inputVal = this.defaultValue;
					};
					jQuery(this).parent().html(inputVal);
					tvonc_modifytreeview();
				}
			});
			return true;
		}
	});
	

	jQuery('#previewtreeview').mousedown( function(event) {
		// dragg start
		jQuery('body').css('cursor','auto');
		jQuery('#previewtreeview *').removeClass('ui-droppable ui-draggable');

		if( !(typeof draggnode === 'undefined') && !jQuery(event.target).is('input') ){
			var inputnode = draggnode.find('input');
			if( inputnode.size() > 0 ){
				inputnode.closest('span').html( inputnode.val() );
				tvonc_modifytreeview();
			}
			
		}
		
		var node = jQuery(event.target).closest('li').find('span:first');
		if( !jQuery(event.target).is('li') && !jQuery(event.target).is('div') && node.is('span') && node.text() ) {
			draggnode = jQuery(event.target).closest('li');
			
			jQuery('#draggtarget').removeAttr('id');
			draggnode.attr('id', 'draggtarget');
			
			if( event.which === 1 ){
				dragswitch = 1;
				
				if( !draggnode.parent().parent().is('ul') ){
					var dragfunc;
					dragfunc = draggnode.draggable({
						cursor: 'move',
						opacity: 1 ,
						revert: true ,
						scroll: false
					}).data('draggable')
					if( dragfunc )dragfunc._mouseDown(event);
				}
				
			}
			
		}
	});

	
	jQuery('#previewtreeview').mouseup( function(event) {
		if( event.which === 1 ){
			if( dragswitch ){
				dragswitch = 0;
			}
		}
	});
	
	jQuery('#previewtreeview').mousemove( function(event) {
		if( dragswitch ){
			dragswitch = 0;

			if( !(typeof draggnode === 'undefined') ){
				
				jQuery('#previewtreeview span').droppable({
					tolerance: "pointer" ,
					accept: draggnode ,
					hoverClass: 'ui-droppable-hover',
					drop: function(event,ui) {
						
						var dropnode_html = draggnode.html();
						
						jQuery('body').css('cursor','auto');
						jQuery('#previewtreeview ul:empty').remove();
						jQuery('#previewtreeview div:empty').remove();
						draggnode.find('div:empty').remove();
						
						
						// === Fixed Firefox ===
						jQuery('#draggtarget').find('a[href]').removeAttr('href');
						jQuery('#draggtarget').remove();
						// === Fixed Firefox ===
						var inputnode = draggnode.find('input');
						if( inputnode.size() > 0 ){
							inputnode.closest('span').html( inputnode.val() );
						}
						
						var node = jQuery(this).closest('li').find('ul:first');
						if( !node.html() ){
							node = jQuery(this).closest('li');
							if( node.is('li') ){
								// --+
								//	 +- new 
								// 
								var branches = node.append('<ul><li>'+dropnode_html+'</li></ul>');
								jQuery('#'+FUNC_CODE).treeview({ add: branches });
								tvonc_source2html();
								return;
							}
						}else{
							// --+
							//	 +-folder
							//	 +- new 
							// 
							var branches = node.prepend('<li>'+dropnode_html+'</li>');
							jQuery('#'+FUNC_CODE).treeview({ add: branches });
							tvonc_source2html();
							return;
						}
						
					}
				});
				
			}
			
		}
	});
	
});

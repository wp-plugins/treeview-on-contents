(function() {
	// Load plugin specific language pack

	tinymce.create('tinymce.plugins.TreeViewOnContents', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {

			ed.addButton('treeview-on-contents-button', {
				title : 'Insert TreeView',
				image : url + '/tvonc_mce_icon.png',
				onclick : function() {
					
					function searchPrevTextNode( srcnode ){
						var orgnode = srcnode;
						var textnode = null;
						while( !textnode ){
							while( !srcnode.previousSibling ){
								if( srcnode.parentNode ){
									srcnode = srcnode.parentNode;
									textnode = searchTextNode( srcnode );
									if( textnode && textnode !== orgnode )
										return textnode;
								}else{
									return null;
								}
							}
							if( srcnode.previousSibling ){
								srcnode = srcnode.previousSibling;
								if( !srcnode )return null;
							}else{
								return null;
							}
							textnode = searchTextNodeB( srcnode );
							if( textnode )
								return textnode;
						}
						return null;
					}

					function searchNextTextNode( srcnode ){
						var orgnode = srcnode;
						var textnode = null;
						while( !textnode ){
							while( !srcnode.previousSibling ){
								if( srcnode.parentNode ){
									srcnode = srcnode.parentNode;
									textnode = searchTextNode( srcnode );
									if( textnode && textnode !== orgnode  )
										return textnode;
								}else{
									return null;
								}
							}
							if( srcnode.nodeName === 'BODY' ) srcnode = srcnode.childNodes[0];
							if( srcnode.nextSibling ){
								srcnode = srcnode.nextSibling;
								if( !srcnode )return null;
							}else{
								// search next node
								while( !srcnode.nextSibling ){
									if( srcnode.parentNode ){
										srcnode = srcnode.parentNode;
									}else{
										break;
									}
								}
								if( srcnode.nextSibling ){
									srcnode = srcnode.nextSibling;
									if( !srcnode )return null;
								}
							}
							textnode = searchTextNode( srcnode );
							if( textnode )
								return textnode;
						}
						return null;
					}

					function searchTextNode( srcnode ){
						while( srcnode.nodeType !== Node.TEXT_NODE ){
							if( srcnode.childNodes ){
								var ii = 0;
								var defaultnext = srcnode.childNodes[0];
								for(ii = 0;ii < srcnode.childNodes.length ;ii++){
									if( srcnode.childNodes[ii].nodeType === Node.TEXT_NODE  ){
										defaultnext = srcnode.childNodes[ii];
										break;
									}
								}
								srcnode = defaultnext;
							}else{
								return null;
							}
						}
						return srcnode;
					}
					function searchTextNodeB( srcnode ){
						while( srcnode.nodeType !== Node.TEXT_NODE ){
							if( srcnode.childNodes ){
								var ii = srcnode.childNodes.length-1;
								var defaultnext = srcnode.childNodes[srcnode.childNodes.length-1];
								for(ii = srcnode.childNodes.length-1;ii >= 0 ;ii--){
									if( srcnode.childNodes[ii].nodeType === Node.TEXT_NODE  ){
										defaultnext = srcnode.childNodes[ii];
										break;
									}
								}
								srcnode = defaultnext;
							}else{
								return null;
							}
						}
						return srcnode;
					}
					
					
					var selection = tinyMCE.activeEditor.selection.getSel();
					if( selection.rangeCount > 0 ){
						var range = selection.getRangeAt(0);

						var startNode = range.startContainer;
						var endNode   = range.endContainer;
						
						var element = document.getElementById('treeview-on-contents');
						var use_easy_block_selector = 0;
						if( element.getAttribute("name") === 'use_easy_block_selector' && element.getAttribute("content") === '1' ){
							use_easy_block_selector = 1;
						}
						
						if( startNode.nodeValue && use_easy_block_selector )
						{
							var start_curpos = range.startOffset;
							var end_curpos = range.endOffset;
							var textnode;
							var openshortcodestr;
							var endshortcodestr;

							var shorcodestr = "notshortcode";
							var texttest = 0;
							var tagheadpos = range.startOffset;
							var cc,cc_old;
							cc = startNode.nodeValue[ tagheadpos ];
							if( cc === '[' ){
								cc = startNode.nodeValue[ ++tagheadpos ];
							}
							cc_old = cc;
							if( (cc >= 'A' && cc <= 'Z') || (cc >= 'a' && cc <= 'z') || (cc >= '0' && cc <= '9') || cc === '-' || cc === '_' ){
								texttest = 1;
								while( tagheadpos ){
									tagheadpos--;
									cc = startNode.nodeValue[ tagheadpos ];
									if( (cc >= 'A' && cc <= 'Z') || (cc >= 'a' && cc <= 'z') || (cc >= '0' && cc <= '9') || cc === '-' || cc === '_' || cc === '/' ){
										// 
									}else if( cc === '[' ){
										if( cc_old === '/' ){
										   texttest=3;
										}else{
										   texttest=2;
										}
										break;
									}else{
										break;
									}
									cc_old = cc;
								}
							}
							var taghead_endpos = tagheadpos + texttest -1;
							if( texttest === 2	||	texttest === 3 ){
								while( taghead_endpos < startNode.nodeValue.length ){
									cc = startNode.nodeValue[ taghead_endpos ];
									if( (cc >= 'A' && cc <= 'Z') || (cc >= 'a' && cc <= 'z') || (cc >= '0' && cc <= '9') || cc === '-' || cc === '_' || cc === '/' ){
										// 
									}else if( cc === ']' || cc === ' ' ){
										shorcodestr = startNode.nodeValue.substring(tagheadpos + texttest -1,taghead_endpos);
										if( texttest === 3 ){
											// search to shortcode head
											openshortcodestr = '['+shorcodestr;
											end_curpos = taghead_endpos + 1;
											start_curpos = -1;
											while( start_curpos === -1 ){
												if( startNode.nodeType === Node.TEXT_NODE && startNode.nodeValue.length >= openshortcodestr.length ){
													start_curpos = startNode.nodeValue.indexOf( openshortcodestr );
													if( start_curpos !== -1 ){
														if( endNode === startNode && end_curpos >= start_curpos ){
															// enclosing shortcode on the same line.
															start_curpos = -1;
														}else{
															break;
														}
													}
												}
												startNode = searchPrevTextNode( startNode );
												if( startNode === null ){
													break;
												}
											}
											range.setStart( startNode , start_curpos );
											range.setEnd(	endNode   , end_curpos );
										}else{
											// search to shortcode tarm
											endshortcodestr = '[\/'+shorcodestr+']';
											start_curpos = tagheadpos;
											end_curpos = -1;
											while( end_curpos === -1 ){
												var textnode = searchTextNode( endNode );
												if( textnode ){
													if( textnode.nodeType === Node.TEXT_NODE && textnode.nodeValue.length >= endshortcodestr.length ){
														end_curpos = textnode.nodeValue.indexOf( endshortcodestr );
														if( end_curpos !== -1 ){
															endNode = textnode;
															if( endNode === startNode && end_curpos <= start_curpos ){
																// enclosing shortcode on the same line.
																end_curpos = -1;
															}else{
																break;
															}
														}
													}
												}
												endNode = searchNextTextNode( endNode );
												if( endNode === null ){
													break;
												}
											}
											if( end_curpos === -1 ){
												end_curpos = endNode.nodeValue.length;
											}else{
												end_curpos += endshortcodestr.length;
											}
											range.setStart( startNode , start_curpos );
											range.setEnd(	endNode   , end_curpos );
										}
										break;
									}else{
										break;
									}
									taghead_endpos++;
								}
							}else{
								if( selection.isCollapsed === false )
								{
									start_curpos = 0;
									end_curpos = endNode.nodeValue.length;
									range.setStart( startNode , start_curpos );
									range.setEnd(	endNode   , end_curpos );
								}
							}
						}
						selection.addRange(range);
					}
					ed.windowManager.open({
						file: ajaxurl + '?action=treeview_on_contents_tinymce',
						width : 500,
						height : 500,
						inline : 1,
						maximizable : true
					}, {
						plugin_url : url
					});
					
				}
			});
			
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
		createControl : function(n, cm) {
			return null;
		},
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'TreeView On Contents',
				author : 'sekishi',
				authorurl : 'http://lab.planetleaf.com',
				infourl : 'http://lab.planetleaf.com',
			};
		}

	});

	// Register plugin
	tinymce.PluginManager.add('TreeViewOnContents', tinymce.plugins.TreeViewOnContents);
})();


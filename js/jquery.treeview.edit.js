(function(jQuery) {
	var CLASSES = jQuery.treeview.classes;
	var proxied = jQuery.fn.treeview;
	jQuery.fn.treeview = function(settings) {
		settings = jQuery.extend({}, settings);
		if (settings.add) {
			return this.trigger("add", [settings.add]);
		}
		if (settings.remove) {
			return this.trigger("remove", [settings.remove]);
		}
		return proxied.apply(this, arguments).bind("add", function(event, branches) {
			jQuery(branches).prev()
				.removeClass(CLASSES.last)
				.removeClass(CLASSES.lastCollapsable)
				.removeClass(CLASSES.lastExpandable)
			.find(">.hitarea")
				.removeClass(CLASSES.lastCollapsableHitarea)
				.removeClass(CLASSES.lastExpandableHitarea);
			jQuery(branches).find("li").andSelf().prepareBranches(settings).applyClasses(settings, jQuery(this).data("toggler"));
		}).bind("remove", function(event, branches) {
			var prev = jQuery(branches).prev();
			var parent = jQuery(branches).parent();
			jQuery(branches).remove();
			prev.filter(":last-child").addClass(CLASSES.last)
				.filter("." + CLASSES.expandable).replaceClass(CLASSES.last, CLASSES.lastExpandable).end()
				.find(">.hitarea").replaceClass(CLASSES.expandableHitarea, CLASSES.lastExpandableHitarea).end()
				.filter("." + CLASSES.collapsable).replaceClass(CLASSES.last, CLASSES.lastCollapsable).end()
				.find(">.hitarea").replaceClass(CLASSES.collapsableHitarea, CLASSES.lastCollapsableHitarea);
			if (parent.is(":not(:has(>))") && parent[0] != this) {
				parent.parent().removeClass(CLASSES.collapsable).removeClass(CLASSES.expandable)
				parent.siblings(".hitarea").andSelf().remove();
			}
		});
	};
	
})(jQuery);
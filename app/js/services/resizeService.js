four51.app.factory('Resize', function($resource, $451) {
	function _then(fn, data) {
		if (angular.isFunction(fn))
			fn(data);
	}

	var _set = function() {
		$(window).resize(function() {
			var windowHeight = $(window).height();
			var navHeight = $("navigation").height();
            var brandingHeight = $("branding").parent('section').height()
			var marginHeight = +($(".container-content").css('margin-top').replace('px',''));
            var navBottomHeight = $(".view-footer").height() ? $(".view-footer").height() : 0;
            console.log(navBottomHeight);
			var visibleHeight = windowHeight - navHeight - brandingHeight - marginHeight - navBottomHeight;
            var visibleAreaPercentage = (visibleHeight/windowHeight)*100;
            visibleAreaPercentage = visibleAreaPercentage.toString() + "%";
			if ($("#visibleAreaStyles")) {
				$("#visibleAreaStyles").remove();
			}
			$("head").append(
				"<style id='visibleAreaStyles' type='text/css'> #visibleArea{ max-height:"+
					visibleAreaPercentage +
					";}</style>");
		});

		$(window).resize();
	}

	return {
		set: _set
	}
});
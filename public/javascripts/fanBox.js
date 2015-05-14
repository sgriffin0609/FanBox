 $(function () {
        
	$(".sizeButton a").click(function(a) {
		$(".sizeButton a").removeClass('selected');
		var c = $(this);
		c.addClass('selected');
	});
	
	$(".genderButton a").click(function(a) {
		$(".genderButton a").removeClass('selected');
		var c = $(this);
		c.addClass('selected');
		});
	
	
});

$(function() {
	var genderValue = getParameterByName("gender");
	$('.genderSet').html(genderValue);
	
	var nameValue = getParameterByName("name");
	$('.nameSet').html(nameValue);
	
	$('#fanBoxQuizSave').click(function() {
		location.href = "/Checkout";
	});
	
	$('#submitToConfirm').click(function() {
		location.href = "/Confirm";
	});
	
	$(function() { 
    $( "#datepicker" ).datepicker(); 

  });
});

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
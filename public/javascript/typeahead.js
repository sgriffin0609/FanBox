$(function() {
    var teams = [
        "Arizona Cardinals",
        "Atlanta Falcons",
		"Baltimore Ravens",
		"Buffalo Bills",
		"Carolina Panthers",
		"Chicago Bears",
		"Cincinatti Bengals",
		"Cleveland Browns",
		"Dallas Cowboys",
		"Denver Broncos",
		"Detroit Lions",
		"Green Bay Packers",
		"Houston Texans",
		"Indianapolis Colts",
		"Jacksonville Jaguars",
		"Kansas City Chief",
		"Miami Dolphins",
		"Minnesota Vikings",
		"New England Patriots",
		"New Orleans Saints",
		"New York Giants",
		"New York Jets",
		"Oakland Raiders",
		"Philadelphia Eagles",
		"Pittsburgh Steelers",
		"San Diego Chargers",
		"San Francisco 49ers",
		"Seattle Seahawks",
		"St. Louis Rams",
		"Tampa Bay Buccaneers",
		"Tennessee Titans",
		"Washington Redskins"
    ];
	
    $("#typeahead").autocomplete( 
	{ 
		source: teams,
		select: function(event, ui) {
			var label = ui.item.label;
			var value = ui.item.value;
			
			$('.activeSelectionContainer').hide();
			$('.activeSelectionContainer').removeClass("activeSelectionContainer");
			
			var genderValue = $('#genderValue').html();
			
			if (value == "Dallas Cowboys")
			{
				var dallasCowboysContent = $('#CowboysGirlsSelectionContent').html();
				$('#TeamSpecificQuizContainer').html(dallasCowboysContent);
				$('#TeamSpecificQuizContainer').addClass("activeSelectionContainer");
				$('#finalBoxSelection').addClass("activeSelectionContainer");
				$('#TeamSpecificQuizContainer').show();
				$('#finalBoxSelection').show();
			}
			
			if (value == "Pittsburgh Steelers")
			{
				var steelersContent = $('#SteelersMensSelectionContent').html();
				$('#TeamSpecificQuizContainer').html(steelersContent);
				$('#TeamSpecificQuizContainer').addClass("activeSelectionContainer");
				$('#finalBoxSelection').addClass("activeSelectionContainer");
				$('#TeamSpecificQuizContainer').show();
				$('#finalBoxSelection').show();
			}
		}
	});
});

document.addEventListener('DOMContentLoaded', function () {

	var highlightColors = {};
	var highightSaturationAndLightness = "100%, 80%";
	var htmlTagNameDivs = document.getElementsByClassName('tagName');

	Array.prototype.map.call(htmlTagNameDivs, function(htmlTagNameDiv) { 
		htmlTagNameDiv.addEventListener("click", function(){

		 	var targetDivs = document.getElementsByClassName(this.id);

		 	// I suspect this can be refactored one further level to pass 'add' or
		 	// 'remove' as a first order function but that's not a high priority for
		 	// me right now compared with some UI/formatting work I want to finish.
		 	if(this.classList.contains('highlight')) { 
	 			this.classList.remove('highlight');
	 			Array.prototype.map.call(targetDivs, function(targetDiv) {
	 				targetDiv.classList.remove("highlight");
	 			});
	    	} 
	    	else {
	    		this.classList.add('highlight');
	 			Array.prototype.map.call(targetDivs, function(targetDiv) {
	 				targetDiv.classList.add("highlight");
	 			});
	    	};
		});
	});
});


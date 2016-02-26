document.addEventListener('DOMContentLoaded', function () {

	console.log("did it load");

	var htmlTagNameDivs = document.getElementsByClassName('tagName');

	Array.prototype.map.call(htmlTagNameDivs, function(htmlTagNameDiv) { 
		htmlTagNameDiv.addEventListener("click", function(){

		 	var targetDivs = this.id;

		 	if(this.classList.contains('highlight')) { 
	 			this.classList.remove('highlight');
	    		document.getElementsByClassName("." + targetDivs).classList.remove("highlight");
	    	} 
	    	else {
	    		this.classList.add('highlight');
	    		document.getElementsByClassName("." + targetDivs).classList.add("highlight");

	    	};
		});
	});
});


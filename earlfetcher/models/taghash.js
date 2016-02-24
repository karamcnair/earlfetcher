function TagHash() {
	
	var tagHash = {};

	// what's the right way to do this with open & closed?
	this.addOpenTag = function(name) {
		// addTag(name, 'open'); 
		addTag(name, 'open');
	}

	this.addCloseTag = function (name) {
		addTag(name, 'close');
	}

	function addTag(name, type) {
		console.log("addTag ", name, type);
		if (!tagHash[name]) {
			 tagHash[name] = {};
			 tagHash[name][type] = 1;
			 console.log( "adding Tag " + name + " " + type + " with count " + tagHash[name][type] );

		} else {
			if(!tagHash[name][type]) {
			  	tagHash[name][type] = 1;
			  				 console.log( "adding Tag " + name + " " + type + " with count " + tagHash[name][type] );

			 }
			 else {
				tagHash[name][type] = tagHash[name][type] + 1;

							 console.log( "adding Tag " + name + " " + type + " with count " + tagHash[name][type] );

			}
		}
	}

	this.toSummary = function() {

		var outputHTML = "";
		var outputArray = [];
		 // outputHTML += "<table>";

		var keys = Object.keys(tagHash);
		console.log(keys);

		console.log(tagHash['html']['open']);

		console.log(tagHash);

		for(var key in keys) {

			var keyString = '"' + key + '"';
			// console.log(keys[key]);
			// console.log(tagHash[keys[key]]);
			// console.log(tagHash[keyString]);

			// outputHTML += "<tr>";
			var types = Object.keys(tagHash[keys[key]]);

			for(var type in types) {
				// outputHTML += "<td>" + keys[key] + "</td><td>" + types[type] + "</td><td>"+ tagHash[keys[key]][types[type]] + "</td>";
				console.log(keys[key] + ' ' + types[type] + ' ' + tagHash[keys[key]][types[type]]);
				// outputArray[key].tag = keys[key];
				// outputArray[key].type = keys[key][types[type]];
				// outputArray[key].value = tagHash[keys[key]][types[type]];
				// console.log(outputArray);

			}
			// outputHTML += "</tr>";
		}
		// outputHTML += "</table>";
		console.log(tagHash);
		return tagHash;
	}
}

module.exports = TagHash;
function TagHash() {
	
	var tagHash = {};

	
	this.addOpenTag = function(name) {
		// addTag(name, 'open'); 
		addTag(name, 'open');
	}

	this.addCloseTag = function (name) {
		addTag(name, 'close');
	}

	function addTag(name, type) {
		if (!tagHash[name]) {
			 tagHash[name] = {};
			 tagHash[name][type] = 1;

		} else {
			if(!tagHash[name][type]) {
			  	tagHash[name][type] = 1;
			 }
			 else {
				tagHash[name][type] = tagHash[name][type] + 1;
			}
		}
	}

	// Currently just returns the raw object b/c JADE is fine with it
	// I might modify it to make it more friendly for dynamic table 
	// resizing.
	this.getTagHash = function() {
		return tagHash;
	}
}

module.exports = TagHash;
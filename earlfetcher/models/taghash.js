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

		} else {
			if(!tagHash[name][type]) {
			  	tagHash[name][type] = 1;
			 }
			 else {
				tagHash[name][type] = tagHash[name][type] + 1;
			}
		}
	}

	this.getTagHash = function() {
		console.log(tagHash);
		return tagHash;
	}
}

module.exports = TagHash;
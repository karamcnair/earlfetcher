// Although it would be possible to subclass the Tag type, I tend to 
// prefer composition over inheritance and for this size of object, 
// subclassing feels like overkill to me.

// This class STRICTLY requires that it be passed a string that defines a legal
// HTML element tag. It can be an opening tag, a closing tag, or a self-closing tag,
// but it has to be valid (i.e. '<html attr=> >'' will not work)

// var Tag = function(string) {
function Tag(tagname, tagtype, tagattributes) {

	// perform validation - return error/throw exception 
	// if the preconditions aren't met.
var chalk = require('chalk');
	var type = tagtype;
	var name = tagname;
	var attributes = "";

	if (tagattributes) {
		var keys = Object.keys(tagattributes)

		for (key in keys) {
			// console.log(chalk.red("In new Tag"));
			// console.log(keys[key], "'" + tagattributes[keys[key]] + "'" );
			attributes += keys[key] + "='" + tagattributes[keys[key]] + "' ";
		}; 
	};

	attributes = attributes.trim();

	this.getType = function() { return type;}
	this.getName = function() { return name;}
	this.getAttributes = function() { return attributes;}

	this.selfClosingVoidTags = ['area', 'base', 'br', 'col', 
		'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 
		'param', 'source', 'track', 'wbr'];
}

Tag.prototype.encodedString = function() {

		// can improve by not padding the space if no attributes
		if (this.getType() === 'open') {
			return "<span class=" + this.getName() + ">&lt;" + this.getName() + ((this.getAttributes().length > 0) ? " " + this.getAttributes() : "") + "&gt;</span>";
		} else if (this.getType() === 'close') {
			return "<span class=" + this.getName() + ">&lt;/" + this.getName() +"&gt;</span>";
		} 
		else
			return "";
}

Tag.prototype.getType = function () { return this.getType(); }
Tag.prototype.getName = function () { return this.getName(); }
Tag.prototype.getAttributes = function () { return this.getAttributes(); }

module.exports = Tag;





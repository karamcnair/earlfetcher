// Although it would be possible to subclass the Tag type, I tend to 
// prefer composition over inheritance and for this size of object, 
// subclassing feels like overkill to me.

// This class STRICTLY requires that it be passed a string that defines a legal
// HTML element tag. It can be an opening tag, a closing tag, or a self-closing tag,
// but it has to be valid (i.e. '<html attr=> >'' will not work)

// var Tag = function(string) {
function Tag(string) {

	// perform validation - return error/throw exception 
	// if the preconditions aren't met.
	string = string.trim();

	var type = "";
	var tagstring = string;
	var name = "";
	var attributes = "";

	// We're guaranteed that the 1st char is "<", last 2 are "/>"
	function parseSelfClosingTag() {
		parseTag(1,tagstring.length-2);
	}	

	// We're guaranteed 1st & last char are "<" and ">"
	function parseOpenTag() {
		parseTag(1,tagstring.length-1);
	}

	// We're guaranteed that the 1st 2 chars are "</", last 1 is ">"
	function parseCloseTag() {
		parseTag(2,tagstring.length-1);
	}

	function parseTag(start, end) {
		var newString = tagstring.substring(start,end);
		// the tag name is the first 'word' in the new string
		// TBD - need to fix word boundary for hyphen
		var re  = /(\w+)/;
		var results = newString.match(re);

		// if there's nothing here, we have a problem
		name = results[0];
		attributes = newString.substring(name.length).trim();
	}

	// if it ends in "/>", it's a self-closing tag
	if(tagstring.substring(tagstring.length-2) === "/>")  
		type = 'selfclosing';
	// else if it starts with "</" it's a close tag
	else if (tagstring.charAt(1) === '/') 
		type = 'close';
	else
		type = 'open';

	switch (type) {
		case 'selfclosing':
			parseSelfClosingTag();
			break;
		case 'close':
			parseCloseTag();
			break;
		case 'open':
			parseOpenTag();
			break;
		default:
			console.log("in default case");
	}

	this.getType = function() { return type;}
	this.getName = function() { return name;}
	this.getAttributes = function() { return attributes;}
}

Tag.prototype.encodedString = function() {

		// can improve by not padding the space if no attributes
		if (this.getType() === 'open') {
			return "<span class=" + this.getName() + ">&lt;" + this.getName() + (this.getAttributes() ? " " + this.getAttributes() : "") + "&gt;</span>";
		} else if (this.getType() === 'close') {
			return "<span class=" + this.getName() + ">&lt;/" + this.getName() +"&gt;</span>";
		} else if (this.getType() === 'selfclosing') {
			return "<span class=" + this.getName() + ">&lt;" + this.getName() + (this.getAttributes() ? " " + this.getAttributes() : "") + "/&gt;</span>";
		} 
		else
			return "";
}

Tag.prototype.encode = function(string) {
	// whatever this is, all we have to do is replace its first char with &lt; and its last with &gt;
	var encodedString = "&lt;" + string.substring(1,string.length-1) + "&gt;";
	// console.log("encodedString = ", encodedString);
	return (encodedString)
}

Tag.prototype.getType = function () { return this.getType(); }
Tag.prototype.getName = function () { return this.getName(); }
Tag.prototype.getAttributes = function () { return this.getAttributes(); }

module.exports = Tag;





// Although it would be possible to subclass the Tag type, I tend to
// prefer composition over inheritance and for this size of object,
// subclassing feels like overkill to me.

function Tag(tagname, tagtype, tagattributes) {

    "use strict";
    var type = tagtype;
    var name = tagname;
    var attributes = "";

    if (tagattributes) {

        var keys = Object.keys(tagattributes);
        console.log(keys);
        Array.prototype.map.call(keys, function (key) {
            attributes += key + "='" + tagattributes[key] + "' ";
        });
    }

    attributes = attributes.trim();

    this.getType = function () {
        return type;
    };
    this.getName = function () {
        return name;
    };
    this.getAttributes = function () {
        return attributes;
    };

    this.selfClosingVoidTags = ['area', 'base', 'br', 'col',
            'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta',
            'param', 'source', 'track', 'wbr'];
}

Tag.prototype.encodedString = function () {
    "use strict";

    if (this.getType() === 'open') {
        return "<span class=" + this.getName() + ">&lt;" + this.getName() + ((this.getAttributes().length > 0)
            ? " " + this.getAttributes()
            : "") + "&gt;</span>";
    } else if (this.getType() === 'close') {
        return "<span class=" + this.getName() + ">&lt;/" + this.getName() + "&gt;</span>";
    } else {
        return "";
    }
};

Tag.prototype.getType = function () {
    "use strict";
    return this.getType();
};

Tag.prototype.getName = function () {
    "use strict";
    return this.getName();
};

Tag.prototype.getAttributes = function () {
    "use strict";
    return this.getAttributes();
};

module.exports = Tag;





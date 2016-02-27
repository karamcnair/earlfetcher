var htmlparser = require("htmlparser2");
var TagHash = require('./taghash');
var Tag = require('./tag');
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

exports.parseHTML = function (rawHTML) {
    "use strict";

    var outputHTML = "<pre>";
    var tagHash = new TagHash();
    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
            var tag = new Tag(name, 'open', attribs);
            outputHTML += tag.encodedString();
            tagHash.addOpenTag(name);
        },
        onclosetag: function (name) {
            var tag = new Tag(name, 'close');

            if (tag.selfClosingVoidTags.indexOf(name) < 0) {
                outputHTML += tag.encodedString();

                tagHash.addCloseTag(name);
            }
        },
        ontext: function (text) {
            outputHTML += entities.encode(text);
        },
        onprocessinginstruction: function (name, data) {
            outputHTML += entities.encode("<" + data + ">");
        },
        oncomment: function (text) {
            outputHTML += entities.encode("<!--" + text + "-->");
        },
        onerror: function (error) {
            outputHTML += "<h3 color:'red'> Error in HTMLparser2: " + error + "</h3>";
        }
    }, {decodeEntities: true});

    parser.write(rawHTML);
    parser.end();

    outputHTML += "</pre>";

    return {outputHTML: outputHTML, tagSummary: tagHash.getTagHash()};
};

exports.tidyUrl = function (url) {
    "use strict";

    // get rid of whitespace
    url = url.trim();

    // if no protocol, prepend it
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // this isn't ideal - we're not validating that it's a legal hostname
        // but what they supplied is definitely not a usable URL so this is still _better_
        url = 'http://' + url;
    }

    return url.trim();
};


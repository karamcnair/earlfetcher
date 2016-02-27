function TagHash() {
    "use strict";
    var tagHash = {};

    this.addOpenTag = function (name) {
        // addTag(name, 'open');
        this.addTag(name, 'open');
    };

    this.addCloseTag = function (name) {
        this.addTag(name, 'close');
    };

    this.addTag = function (name, type) {
        if (!tagHash[name]) {
            tagHash[name] = {};
            tagHash[name][type] = 1;

        } else {
            if (!tagHash[name][type]) {
                tagHash[name][type] = 1;
            } else {
                tagHash[name][type] = tagHash[name][type] + 1;
            }
        }
    };

    // Currently just returns the raw object because JADE is fine with it
    // I might modify it to make it more friendly for dynamic table
    // resizing.
    this.getTagHash = function () {
        return tagHash;
    };
}

module.exports = TagHash;
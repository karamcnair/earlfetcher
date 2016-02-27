document.addEventListener('DOMContentLoaded', function () {

    // use strict goes _inside_ a wrapping function
    // http://stackoverflow.com/questions/4462478/jslint-is-suddenly-reporting-use-the-function-form-of-use-strict
    "use strict";
    var lasthue = 0;
    var htmlTagNameDivs = document.getElementsByClassName('tagName');

    function getDistinctHue() {
        // var hue = Math.floor((Math.random() * 360) + 1);
        var phase = 105;
        lasthue += phase;
        lasthue %= 360;
        return Math.floor(lasthue);
    }

    function highlight(targetDiv, hue, enable) {
        var huestring = "hsl(" + hue + ", 100%, 85%)";

        if (enable) {
            targetDiv.classList.add('highlight');
            targetDiv.style.backgroundColor = huestring;
        } else {
            targetDiv.style.backgroundColor = '';
            targetDiv.classList.remove('highlight');
        }
    }

    var divs = document.getElementsByTagName('div');

    Array.prototype.map.call(htmlTagNameDivs, function (htmlTagNameDiv) {
        htmlTagNameDiv.addEventListener("click", function () {

            var hue = this.getAttribute('data-highlight-hue');

            if (!hue) {
                hue = getDistinctHue();
                this.setAttribute('data-highlight-hue', hue);
            }

            var targetDivs = document.getElementsByClassName(this.id);

            // I suspect this can be refactored one further level to pass 'add' or
            // 'remove' as a first order function but that's not a high priority for
            // me right now compared with some UI/formatting work I want to finish.
            if (this.classList.contains('highlight')) {
                highlight(this, hue, false)
                Array.prototype.map.call(targetDivs, function (targetDiv) {
                    highlight(targetDiv, hue, false);
                });
            } else {
                highlight(this, hue, true)
                Array.prototype.map.call(targetDivs, function (targetDiv) {
                    highlight(targetDiv, hue, true);
                });
            }
        });
    });
});




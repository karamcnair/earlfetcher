## EarlFetcher

A coding exercise (but I'm not going to include the details of the company or position to make this less Googlable for other applicants.)

### Overview

A simple web app that:
* retrieves the HTML of a user-specified URL and displays the code (with whitespace preserved)
* summarizes the HTML element tags present in the code with a count of each tag, and
* allows the user to click on the tag name to highlight the occurences of the tag in the code.

Note that because whitespace is preserved, sites with a lot of leading whitespace at the top of their HTML code (like [this one](https://gentle-hollows-35618.herokuapp.com/?theUrl=http%3A%2F%2Fvendorexpress.amazon.com) may look like they have not loaded - scroll down in the browser window to see the retrieved HTML.

### Demo
You can try this app out at [https://gentle-hollows-35618.herokuapp.com/](https://gentle-hollows-35618.herokuapp.com/)

### Installation & usage
You must have [Node.js](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/getting-started/installing-node) to install and run the earlfetcher app.
1. In a terminal shell, run ```npm install``` in the earlfetcher directory. This will install the required third-party libraries.
2. run ```npm start``` to launch the application.
3. Visit http://localhost:3000/ in your web browser.
4. type control-C in the shell where you ran ```npm start``` to exit the application.

### Testing
In the earlfetcher home directory, run `mocha -R spec tests/*.js` to run the automated tests. The file 'testApp.js' launches the app on its default port, so if you run that test suite while the app is running some tests will fail because the port is already in use.

### Known Issues/Future Enhancements
* Improve styling to keep summary table fixed in place while user scrolls page below - allowing user to still access the tag names while viewing the page.
* Hook the tests into a build step within the Express app deployment framework.
* Hook the JSLint call into a build step rather than running it manually
* Possibly improve HTTP performance (although I did run a few manual performance comparisons between the library I'm using (```request```) and 'superagent' which claims to be faster and found no difference).

### Reflections

I started on this assignment with the high level plan to:

1. retrieve and parse the HTML
2. traverse the tree, outputting spans with class='_tag name_' around tag nodes and raw text for other nodes.
3. use client-side JavaScript to select and highlight the tags based on class name.

And indeed, that's almost what I ended doing, but I took a couple of detours along the way. One particularly bumpy detour, in fact. In the end, the solution was to output the modified HTML on the fly as the parser detected each node, but until I merged steps 1 & 2, there were some hiccups.

I chose JavaScript and Node/Express because that's something I had used not that long ago, but I certainly wouldn't describe myself as fluent in that environment. The most popular HTML parsers available in the Node package directory are:
* htmlparser2
* parse5

htmlparser's interface allows you to specify a callback to be executed at each point in parsing the tree. I quickly used this to build the tag summary counts. But when it came to traversing the tree it had built to output the documentation available for the associated [Domhandler](https://github.com/fb55/domhandler) and [DomUtils](https://github.com/fb55/DomUtils) was pretty thin.

I then investigated the parse5 library. Its serialization method returned the original HTML input, but the module doesn't provide a clean interface to hook into modifying the serialization output. It does allow you to specify a 'tree adapter' to change the structure of the parse tree being built, but would then output tags/etc according to the HTML spec. I could have chosen to subclass its traversal code, but that would create a fairly brittle dependency on a library I didn't own, from an ongoing maintenance perspective.

At that point, I wondered "Because I don't really need a full parse tree for the inline tag markup - could I just recognize individual tags and replace them with spans?" That was the bumpy detour. Processing the tag counting distinctly from the 'presentation' has a nice 'separation of concerns' feel to it, although it does introduce a risk of the count not matching the actually highlighted tags, although this could be detected with a test that compared the summary counts with a 'live count' of the spans with 'class="_tag name_". While obviously, you can't parse HTML with regexes, for tag recognition I thought I didn't need to. I thought it was worth exploring and I started looking at how to identify tags via regexes.

I won't go into all the grim details of how the special case code kept growing after I found the next "<" in the retrieved HTML (it's all in the git repo if you want to see) but when I realized that JavaScript code passed in <script> tags to the browser could contain completely arbitrary HTML in document.write() calls, it was clear that even simple tag detection via regexes was a completely dead end. To ignore everything within the script tags required matching open and close tags, which meant parsing WAS required. I returned to the HMTL parsing libraries and realized that I could generate my output HTML while in the initial parsing (which is more efficient, anyway).





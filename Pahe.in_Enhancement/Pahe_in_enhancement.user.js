// ==UserScript==
// @name         Pahe.in Enhancement
// @namespace    https://github.com/Shivelight/userscripts
// @description  Enhance Pahe.in browsing experience.
// @version      0.1.2
// @author       Shivelight
// @license      MIT
// @homepage     https://github.com/Shivelight/userscripts/tree/master/Pahe.in_Enhancement
// @homepageURL  https://github.com/Shivelight/userscripts/tree/master/Pahe.in_Enhancement
// @downloadURL  https://github.com/Shivelight/userscripts/raw/master/Pahe.in_Enhancement/Pahe_in_enhancement.user.js
// @updateURL    https://github.com/Shivelight/userscripts/raw/master/Pahe.in_Enhancement/Pahe_in_enhancement.user.js
// @supportURL   https://github.com/Shivelight/userscripts/issues
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @match        https://pahe.ph/*
// @match        https://pahe.li/*
// @match        https://pahe.ink/*
// @run-at       document-start
// ==/UserScript==

var original = window.addEventListener;
var oldlet;
var links;

var patch = function() {
    console.log("oldlet: " + oldlet);
    console.log("links: ", links);
    var totalLinks = Object.keys(links).length; console.log("total links: " + totalLinks);
    var linkIndexStep = Object.keys(links)[1]; console.log("links index step: " + linkIndexStep);

    var totalObserved = 0;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                let node = mutation.addedNodes[i]
                if (node.tagName == oldlet.toUpperCase()) {
                    let downloadButtons = document.querySelectorAll(oldlet);
                    if (downloadButtons.length == totalLinks) {
                        observer.disconnect();
                        var index = 0;
                        downloadButtons.forEach(button => {
                            button.setAttribute("href", links[index * linkIndexStep]);
                            button.outerHTML = button.outerHTML.replaceAll(oldlet, "a");
                            //console.log(button.href);
                            index++;
                        });
                        return;
                    }
                }
            }

            //console.log(mutation);
        });
    });

    const target = document.querySelector(".box-inner-block");
    observer.observe(target, { childList: true, subtree: true });
}

window.addEventListener = function(type, listener, useCapture) {
    if (type === "load") {
        let arr = listener.toString().split(";");
        arr.some(function (element) {
            //console.log(element);
            if (element.trim().startsWith("let")) {
                const letRegex = /'(.+)'/gm;
                let m = letRegex.exec(element);
                oldlet = m[1];
            }
            if (element.trim().startsWith("var")) {
                const varRegex = /var (.*?)\s?=/gm;
                let m = varRegex.exec(element);
                eval(element + ";")
                links = eval(m[1])
                patch();
                return true;
            }
        });
    }

    return original.apply(this, arguments);;
};

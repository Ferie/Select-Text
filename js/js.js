if (!window.highlightSelection) {
    highlightSelection = {};
}

highlightSelection.Selector = {};



/**
 * function that returns the highlated text - crossbrowsers version
 */
highlightSelection.Selector.getSelected = function() {
    var text = '';
    if (window.getSelection) {
        text = window.getSelection();
        highlight('#FFCC00');
    } else if (document.getSelection) {
        text = document.getSelection();
        highlight('#FFCC00');
    } else if (document.selection) {
        text = document.selection.createRange().text;
        highlight('#FFCC00');
    }
    return text;
};



/**
 * functions that highlight the backgound of selected text
 * 
 * source: http://stackoverflow.com/questions/2582831/how-can-i-highlight-the-text-of-the-dom-range-object
 */
function highlight(colour) {
    var range,
        sel;
    if (window.getSelection) {
        // IE9 and non-IE
        try {
            if (!document.execCommand("BackColor", false, colour)) {
                makeEditableAndHighlight(colour);
            }
        } catch (ex) {
            makeEditableAndHighlight(colour)
        }
    } else if (document.selection && document.selection.createRange) {
        // IE <= 8 case
        range = document.selection.createRange();
        range.execCommand("BackColor", false, colour);
    }
}


function makeEditableAndHighlight(colour) {
    var range,
        sel = highlightSelection.Selector.getSelected;

    if (sel.rangeCount && sel.getRangeAt) {
        range = sel.getRangeAt(0);
    }

    document.designMode = "on";
    if (range) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
    // Use HiliteColor since some browsers apply BackColor to the whole block
    if (!document.execCommand("HiliteColor", false, colour)) {
        document.execCommand("BackColor", false, colour);
    }
    document.designMode = "off";
}



// set a counter for the highlated texts titles
var count = 1;

/**
 * trick to get the DOM ready crossbrowsers using vanilla JavaScript
 * 
 * source: http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the
 */
function ready(f) {/in/.test(document.readyState) ? setTimeout('ready(' + f + ')',9) : f();}

ready(function() {
    // check for Internet Explorer < 9 to attach correctly the event listner
    if (window.addEventListener) {
        var ie = false;
        document.body.addEventListener("mouseup", function() {
            selections(ie);
        });
    } else if (window.attachEvent) {
        var ie = true;
        document.body.attachEvent("onmouseup", function() {
            selections(ie);
        });
    }

    /**
     * function that creates the right column selections components
     */
    function selections(ie) {
        var string = highlightSelection.Selector.getSelected();
        if (string !== '') {
            // creation of the title with the word "Selection" and the progressive number
            var selectionTitle = document.createElement('h3');
            selectionTitle.className = 'heading2 selectionsSpacer';
            var title = document.createTextNode('Selection ' + count + ':');
            selectionTitle.appendChild(title);

            // creation of the div that contains the highlated text
            var selectionDiv = document.createElement('div');
            selectionDiv.className = 'selection';
            var text = document.createTextNode(string);
            selectionDiv.appendChild(text);

            // append the children to the right column
            // check browser versions
            if (ie) {
                document.querySelectorAll(".selections")[0].appendChild(selectionTitle);
                document.querySelectorAll(".selections")[0].appendChild(selectionDiv);
            } else {
                document.getElementsByClassName("selections")[0].appendChild(selectionTitle);
                document.getElementsByClassName("selections")[0].appendChild(selectionDiv);
            }

            count++;
        }
    }
});

/* No need to edit anything in this file */

function loadInjectedCSS(event, path) {
    // Try to get the contents of the stylesheet.
    var req = new XMLHttpRequest();
    req.open('GET', path, false);
    req.send();
    
    // Error check for reading the stylesheet.
    if (!req.responseText) {
        opera.postError('EXTENSION ERROR: Can\'t read ' + path);
        return;
    }
    
    // Send the contents of the stylesheet to the injected script.
    event.source.postMessage({
        topic: 'LoadedInjectedCSS',
        data: {
            css: req.responseText,
            path: path
        }
    });
}

function onMessage(event) {
    var message = event.data;
    // Check the correct message has been received and send the stylesheet path to loadInjectedCSS().
    if (message.topic == 'LoadInjectedCSS') {
        var path = message.data;
        loadInjectedCSS(event, path);
    }
}

window.addEventListener('DOMContentLoaded', function() {
    // On receipt of a message from the injected script, execute onMessage().
    opera.extension.onmessage = onMessage;
    
    // Specify the properties of the button before creating it.
	var UIItemProperties = {
		disabled: true,
		title: "Layers",
		icon: "images/icon_18x18.png",
		onclick: function(event) {
			// Send a message to the currently-selected tab.
			var tab = opera.extension.tabs.getFocused();
			if (tab) { // Null if the focused tab is not accessible by this extension
				tab.postMessage('toggleCSS');
			}
		}
	};

    // Create the button and add it to the toolbar.
    var button = opera.contexts.toolbar.createItem( UIItemProperties );
    opera.contexts.toolbar.addItem(button);
    
	function toggleButton() {
		var tab = opera.extension.tabs.getFocused();
		if (tab) {
			button.disabled = false;
		} else {
			button.disabled = true;
		}
	}

    // Only enable the button when the extension and page are ready.
	opera.extension.onconnect = toggleButton;
	opera.extension.tabs.onfocus = toggleButton;
	opera.extension.tabs.onblur = toggleButton;
}, false);


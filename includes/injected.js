window.addEventListener('load', function() {
    
    // Specify the path to the stylesheet here:
    var path = 'styles/style.css';
    
    /* No need to change anything below this line */
    
    var isApplied = false;
    var style;
    
    // Error check for the stylesheet filename.
    if (!path) {
        opera.postError('EXTENSION ERROR: No CSS file has been specified');
        return;
    }
    
    var onCSS = function(event) {
        var message = event.data;
        
        // Check this is the correct message and path from the background script.
        if (message.topic === 'LoadedInjectedCSS' && message.data.path === path) {
            // Remove the message listener so it doesn't get called again.
            opera.extension.removeEventListener('message', onCSS, false);
            
            var css = message.data.css;

            // Create a <style> element and add it to the <head> element of the current page.
            // Insert the contents of the stylesheet into the <style> element.
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.appendChild(document.createTextNode(css));
            window.document.getElementsByTagName('head')[0].appendChild(style);
            
            return true;
        }        
        return false;
    }
    
    opera.extension.addEventListener('message', function(event) {
        if (event.data === 'toggleCSS') {
            // When the toolbar button has been clicked, determine whether CSS should be applied or not.
            if (!isApplied) {
                // Send the stylesheet path to the background script to get the CSS.
                opera.extension.postMessage({
                    topic: 'LoadInjectedCSS',
                    data: path
                });
            } else {
                // Try to remove the <style> element we created.
                try {
                    window.document.getElementsByTagName('head')[0].removeChild(style);
                    isApplied = false;
                } catch(e) {}
            }
        } else {
            // On receipt of a message from the background script, execute onCSS().
            isApplied = onCSS(event);
        }
    }, false);
}, false);

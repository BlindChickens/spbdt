export class ScreenManager {
    constructor() {
        this.screens = ko.observableArray([]);
    }
    open(screen) {
        if (this.screens().find(s => s.screen === screen)){
            alert("Screen already open.");
        }
        let $screen = $('<div><div></div></div>');
        let onopen = function () {
            let $parent = $screen.parent();
            $parent.removeClass('ui-widget ui-widget-content');
            $parent.css('background', '#eee');
            $parent.css('width', screen.settings().fullscreen() ? '100vw' : '50vw');
            $parent.css('height', screen.settings().fullscreen() ? '100vh' : '70vh');
            $parent.css('max-height', screen.settings().fullscreen() ? '' : '90vh');
            $parent.css('top', screen.settings().fullscreen() ? '0' : '5%');
            $screen.css('padding', '0');
            $screen.children().height('auto');
            $screen.css('display', '');
            if (screen.settings().fullscreen()) {
                $('.ui-dialog-titlebar').remove();
            } else {
                $parent.css('min-height', '20vh');
            }
        };
        let options = {
            title:  screen.constructor.name,
            width:  screen.settings().fullscreen() ? '100vw' : '50vw',
            modal:  true,
            open: onopen,
            closeOnEscape: false,
            resizable: false,
            dialogClass: screen.settings().fullscreen() ? 'fullscreen' : '',
        };
        $screen.dialog(options);
        let close = () => $screen.dialog('destroy');
        ko.applyBindingsToNode($screen.children()[0], { screen: screen });
        this.screens.push({screen: screen, close: close});
        return this;
    };
    close (screen) {
        let s = this.screens().find(s => s.screen === screen);
        if (!s) {
            alert('Screen is not open. This is obviously an error.');
        }
        this.screens.remove(s);
        s.close();
        return this;
    }
}
const screen_manager = new ScreenManager();
export default screen_manager;
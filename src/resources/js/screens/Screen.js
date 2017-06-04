import SPBDT from '../SPBDT/SPBDT';
import screen_manager from './ScreenManager';

export default class Screen extends SPBDT {
    constructor(settings) {
        super();
        this.settings = ko.observable(ko.mapping.fromJS(this.defaultSettings(settings)));
    }
    open() {
        screen_manager.open(this);
    };

    close() {
        screen_manager.close(this);
    }

    defaultSettings(...settings){
        settings = $.extend(true, {}, ...settings);
        return $.extend(true, {
            height: 'auto',
            width: '100%',
            max_height: '',
            fullscreen: true,
        }, settings);
    }

};
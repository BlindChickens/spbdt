import IntroScreen from './screens/IntroScreen';

// window.view_model = new (function(){
//     this.prop1 = ko.observable("prop1");
//     this.win_size = ko.observable(900);
// })();

export const start = function () {
    new IntroScreen().open();
};
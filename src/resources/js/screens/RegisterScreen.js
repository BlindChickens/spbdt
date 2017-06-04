import Screen from './Screen';
import * as backend from '../SPBDT/backend';

function RegisterScreen (settings){
    this.parent(settings);
};
RegisterScreen.inherits(Screen);
    
RegisterScreen.prototype.func1 = function() {
    backend.getUser(1);
};

export { RegisterScreen as default };

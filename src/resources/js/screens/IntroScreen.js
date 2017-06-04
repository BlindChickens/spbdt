import Screen from './Screen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

export default class IntroScreen extends Screen {
    constructor() {
        super();
    };
    onLogin() {
        new LoginScreen().open();
    };
    onRegister() {
        new RegisterScreen({ fullscreen: false }).open();
    };
};


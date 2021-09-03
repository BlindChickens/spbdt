import { Screen } from 'spa';
// import LoginScreen from './LoginScreen';
// import RegisterScreen from './RegisterScreen';

export default class IntroScreen extends Screen {
    constructor() {
        super();
    };
    onLogin() {
        console.log('DAARSY');
        // new LoginScreen().open();
    };
    onRegister() {
        // new RegisterScreen({ fullscreen: false }).open();
    };
};


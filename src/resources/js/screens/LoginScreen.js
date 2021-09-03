import KScreen from '../scripty';
export default class LoginScreen extends KScreen {
    constructor() {
        super();
        this.nname = ko.observable('Jacques');
        this.surname = ko.observable('Combrink');
    }
    func() {
        console.log('asdfasdfsadfsadf');
        console.log('asdfasdfsadfsadf');
        console.log('asdfasdfsadfsadf');
        console.log('asdfasdfsadfsadf');
        console.log('asdfasdfsadfsadf');
    };
};


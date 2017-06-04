import Screen from './Screen';

export default class LoginScreen extends Screen {
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


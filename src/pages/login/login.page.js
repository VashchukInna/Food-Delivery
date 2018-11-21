'use strict';

import Page from '../page';
import loginPageContent from './login.page.html';
import router from '../../router';

class LoginPage extends Page {
    constructor(url) {
        super(url);
        this.content = loginPageContent;
    }

    pageIsRendered = () => {
        let login = new Login(this.authorization);
        login.init();
    };
}

class Login {
    constructor(authorization) {
        this.authorization = authorization;
    }

    validateLoginForm() {
        let submitButton = document.getElementById('button-submit');
        submitButton.addEventListener('click', (e) => {
            let login = document.getElementById('username').value;
            let password = document.getElementById('password').value;
            let user = this.authorization.login(login, password);
            if (user) {
                router.showHomePage();
            } else {
                this.showAuthorizationStatus('Login was unsuccessful, please check your username and password');
            }
        });
    }

    showAuthorizationStatus(message, color) {
        this.unauthorizedUser = document.getElementById('unauthorized-user');
        this.unauthorizedUser.innerHTML = message;
        this.unauthorizedUser.style.color = 'red';
    }

    init() {
        this.validateLoginForm();
        this.showAuthorizationStatus('');
    }
}

const page = new LoginPage('#/login');

export default page;
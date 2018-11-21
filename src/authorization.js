'use strict';

import access from './data/access.json';
import users from './data/users.json';

const USER = 'user';

class Authorization {

    constructor(storage) {
        this.storage = storage;
    }

    giveAccessToUrl = (route) => {
        for (let i = 0; i < access.length; i++) {
            let {accessByExecutants, path} = access[i];
            let getUrl = route === '/' ? '' : route;
            if (path === getUrl) {
                if (accessByExecutants === 'adminAndUser') {
                    return true;
                }
                if (accessByExecutants.indexOf(this.getExecutant()) !== -1) {
                    return true;
                }
            }
        }
        return false;
    };

    findUser(user, pass) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === user) {
                if (users[i].password === pass) {
                    return users[i];
                }
                return null;
            }
        }
    }

    login(user, pass) {
        let userIsFound = this.findUser(user, pass);

        if (userIsFound) {
            this.storage.setItem(USER, JSON.stringify(userIsFound));
            return userIsFound;
        }
        return false;
    }

    logout() {
        this.storage.removeItem(USER);
    }

    getUser() {
        let userData = this.storage.getItem(USER);

        if (!userData) {
            return;
        }

        return JSON.parse(userData);
    }

    getUsers = () => {
        return users;
    };

    getExecutant = () => {
        let user = this.getUser();
        if (!user) {
            return 'unauthorized';
        }
        return user.executant;
    };
}

export default new Authorization(window.localStorage);
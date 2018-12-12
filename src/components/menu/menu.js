'use strict';

import _ from 'lodash';

class Menu {
    constructor(router, authorization) {
        this.createMenu = [
            {
                name: 'Home',
                path: '#/',
            },
            {
                name: 'Menu',
                path: '#/menu',
            },
            {
                name: 'Combo',
                path: '#/combo',
            },
            {
                name: 'Contacts',
                path: '#/contacts',
            },
            {
                name: 'Cart',
                path: '#/cart',
            },
            {
                name: 'Login',
                path: '#/login',
            },
            {
                name: 'Admin',
                path: '#/admin',
            },
            {
                name: 'Logout',
                path: '#/logout',
            },
        ];
        this.authorization = authorization;
        this.router = router;
    }

    createLinkElement = (name, hash) => {

        let a = document.createElement('a');
        a.innerHTML = name;
        a.setAttribute('href', hash);
        a.addEventListener('click', () => {
            this.router.renderPage(hash);
        });
        return a;
    };

    init = () => {
        let userMenu = document.getElementById('user-menu');
        userMenu.innerHTML = '';
        // iterates over elements of collection and invokes iteratee for each element
        _.each(this.createMenu, ({name, path}) => {
            this.includeLinkToTheMenu(name, path);
        });

        // create a sub-menu to the menu item
        let secondElementOftheMenu = document.getElementById('user-menu').lastChild;
        let list = document.createElement('ul');
        list.setAttribute('class', 'dropdown');
        secondElementOftheMenu.appendChild(list);

        let dropdownItem = document.createElement('li');
        list.appendChild(dropdownItem);
        let link = document.createElement('a');
        link.setAttribute('href', '#/signin');
        link.innerHTML = 'Sign in';
        dropdownItem.appendChild(link);
    };

    includeLinkToTheMenu = (name, path) => {
        let userMenu = document.getElementById('user-menu');
        if (this.authorization.giveAccessToUrl(path)) {
            let li = document.createElement('li');
            let link = this.createLinkElement(name, path);
            li.appendChild(link);
            userMenu.appendChild(li);
        }
    };
}

export default Menu;
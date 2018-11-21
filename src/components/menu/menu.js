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
                name: 'About Us',
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
                name: 'Create Your Lunch',
                path: '#/createyourlunch',
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
                name: 'Sign in',
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
        let secondElementOftheMenu = document.getElementById('user-menu').children[2];
        let list = document.createElement('ul');
        list.setAttribute('class', 'dropdown');
        secondElementOftheMenu.appendChild(list);

        let dropdownItem = document.createElement('li');
        list.appendChild(dropdownItem);
        let link = document.createElement('a');
        link.setAttribute('href', '#/monday');
        link.innerHTML = 'Monday';
        dropdownItem.appendChild(link);

        let dropdownItemTuesday = document.createElement('li');
        list.appendChild(dropdownItemTuesday);
        let link2 = document.createElement('a');
        link2.setAttribute('href', '#/tuesday');
        link2.innerHTML = 'Tuesday';
        dropdownItemTuesday.appendChild(link2);

        let dropdownItemWednesday = document.createElement('li');
        list.appendChild(dropdownItemWednesday);
        let link3 = document.createElement('a');
        link3.setAttribute('href', '#/wednesday');
        link3.innerHTML = 'Wednesday';
        dropdownItemWednesday.appendChild(link3);

        let dropdownItemThursday = document.createElement('li');
        list.appendChild(dropdownItemThursday);
        let link4 = document.createElement('a');
        link4.setAttribute('href', '#/thursday');
        link4.innerHTML = 'Thursday';
        dropdownItemThursday.appendChild(link4);

        let dropdownItemFriday = document.createElement('li');
        list.appendChild(dropdownItemFriday);
        let link5 = document.createElement('a');
        link5.setAttribute('href', '#/friday');
        link5.innerHTML = 'Friday';
        dropdownItemFriday.appendChild(link5);

        let dropdownItemSaturday = document.createElement('li');
        list.appendChild(dropdownItemSaturday);
        let link6 = document.createElement('a');
        link6.setAttribute('href', '#/saturday');
        link6.innerHTML = 'Saturday';
        dropdownItemSaturday.appendChild(link6);

        let dropdownItemSunday = document.createElement('li');
        list.appendChild(dropdownItemSunday);
        let link7 = document.createElement('a');
        link7.setAttribute('href', '#/sunday');
        link7.innerHTML = 'Sunday';
        dropdownItemSunday.appendChild(link7);
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
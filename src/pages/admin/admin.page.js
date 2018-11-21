'use strict';

import Page from '../page';
import adminPageContent from './admin.page.html';

class AdminPage extends Page {
    constructor(url) {
        super(url);
        this.content = adminPageContent;
    }

    pageIsRendered = () => {
        let listOfUsers = document.getElementById('list-of-users');
        let usersList = this.authorization.getUsers();
        for (let i = 0; i < usersList.length; i++) {
            let li = document.createElement('li');
            li.innerHTML = usersList[i].username;
            listOfUsers.appendChild(li);
        }
    };
}

const page = new AdminPage('#/admin');

export default page;
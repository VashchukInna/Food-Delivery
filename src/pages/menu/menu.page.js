'use strict';

import Page from '../page';
import menuPageContent from './menu.page.html';

class MenuPage extends Page {
    constructor(url) {
        super(url);
        this.content = menuPageContent;
    }

    pageIsRendered = () => {

    }

}


const page = new MenuPage('#/menu');

export default page;
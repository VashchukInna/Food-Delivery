'use strict';

import Page from '../page';
import homePageContent from './home.page.html';

class HomePage extends Page {
    constructor(url) {
        super(url);
        this.content = homePageContent;
    }
}

const homePage = new HomePage('#/');

export default homePage;
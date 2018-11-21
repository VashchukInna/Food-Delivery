'use strict';

import Page from '../page';
import createLunchPageContent from './createlunch.page.html';

class CreateLunchPage extends Page {
    constructor(url) {
        super(url);
        this.content = createLunchPageContent;
    }

    pageIsRendered = () => {
    };
}

const page = new CreateLunchPage('#/createyourlunch');

export default page;
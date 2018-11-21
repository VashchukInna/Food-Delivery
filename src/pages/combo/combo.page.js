'use strict';

import Page from '../page';
import comboPageContent from './combo.page.html';

class ComboPage extends Page {
    constructor(url) {
        super(url);
        this.content = comboPageContent;
    }

    pageIsRendered = () => {
    };
}

const page = new ComboPage('#/combo');

export default page;
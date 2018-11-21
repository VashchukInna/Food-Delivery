'use strict';

import Page from '../page';
import cartPageContent from './cart.page.html';

class CartPage extends Page {
    constructor(url) {
        super(url);
        this.content = cartPageContent;
    }

    pageIsRendered = () => {


    };
}

const page = new CartPage('#/cart');

export default page;
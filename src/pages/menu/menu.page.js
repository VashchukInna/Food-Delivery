'use strict';

import Page from '../page';
import menuPageContent from './menu.page.html';
import menu from '../../data/menu.json';

class MenuPage extends Page {
    constructor(url) {
        super(url);
        this.content = menuPageContent;
    }

    pageIsRendered = () => {
        let nav = document.querySelector('.main-menu');
        let list = document.querySelector('.horizontal-list');

        const createCart = () => {
            if (!localStorage.cart) {
                localStorage.cart = '[]';
            }
        };

        const retrieveCart = () => {
            return new Map(JSON.parse(localStorage.cart));
        };

        const resaveCart = (array) => {
            return localStorage.cart = JSON.stringify(Array.from(array.entries()));
        };

        const addToCart = async (food) => {
            if (!food) {
                return false
            }
            const {id} = food;
            const properties = (({name, image, cost}) => ({name, image, cost}))(food);
            const cart = retrieveCart();
            await cart.set(id, properties);
            showMessage("Item added to cart", 'success');
            return resaveCart(cart);
        };

        const removeFromCart = async (foodId) => {
            if (!foodId) {
                return false
            }
            const cart = retrieveCart();
            await cart.delete(foodId);
            showMessage("Item removed from cart", 'success');
            return resaveCart(cart);
        };

        const checkCartForItem = (foodId) => {
            if (!foodId) {
                return false
            }
            return retrieveCart().has(foodId.toString());
        };

        const htmlToElement = (html) => {
            let template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        };

        const fetchMenu = () => {
            return new Promise((resolve) => {
                resolve(menu);
            })
        };

        const populateMenu = (foodList, parentNode) => {
            return new Promise((resolve, reject) => {
                if (foodList.length == 0) {
                    return reject("No items match your search");
                }
                let item = '';
                let buttonClass;
                let buttonText;
                foodList.forEach((elem) => {
                    if (!checkCartForItem(elem.id)) {
                        buttonClass = 'confirm';
                        buttonText = 'Add to cart';
                    } else {
                        buttonClass = 'decline';
                        buttonText = 'Remove from cart';
                    }
                    item += `<li class="raised vertical card">
                              <div class="img-thumbnail"><img src=${elem.image} alt=${elem.name}></div>
                              <div class="vertical card-details">
                                <h4 class="food-name">${elem.name}</h4>
                                <h6 class="amount">Amount: $ <span class="amount">${elem.cost}</span></h6>
                                <div class="order-buttons">
                                  <button class="big fluid button ${buttonClass}" data-id="${elem.id}" data-name="${elem.name}" data-image="${elem.image}" data-cost="${elem.cost}">
                                  ${buttonText}
                                  </button>
                                </div>
                              </div>
                            </li>`;
                });
                resolve(parentNode.innerHTML = item);
            })
        };

        const showMessage = (message, status = "failure") => {
            if (document.querySelector('.pop-up')) {
                hideMessage();
            }
            const elem = htmlToElement(`<div class="pop-up ${status}">
                  <p>${message}</p></div>`);

            nav.after(elem);
            localStorage.setItem("msgTimeout", setTimeout(hideMessage, 2000));
        };

        const hideMessage = () => {
            window.clearTimeout(localStorage.msgTimeout);
            document.querySelector('.pop-up').remove();
        };

        createCart();

        list.addEventListener('click', (event) => {
            const clicked = event.target;
            if (clicked.tagName === 'BUTTON') {
                if (clicked.classList.contains('decline')) {
                    clicked.classList.replace('decline', 'confirm');
                    clicked.textContent = 'Add to cart';
                    removeFromCart(clicked.dataset.id);
                    return;
                }
                addToCart(clicked.dataset);
                clicked.classList.replace('confirm', 'decline');
                clicked.textContent = 'Remove from cart';
            }
        });

        fetchMenu({foodCount: 20}).then((result) => {
            populateMenu(result, list)
                .catch((error) => {
                    showMessage(error);
                });
        });
    }
}

const page = new MenuPage('#/menu');

export default page;
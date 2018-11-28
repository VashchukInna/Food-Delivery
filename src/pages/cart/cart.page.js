'use strict';

import Page from '../page';
import cartPageContent from './cart.page.html';

class CartPage extends Page {
    constructor(url) {
        super(url);
        this.content = cartPageContent;
    }

    pageIsRendered = () => {
        let nav = document.querySelector('.main-menu');
        let cartList = document.querySelector('.vertical-list');
        let total = document.getElementById('total');
        let orderButton = document.getElementById('order');
        let addressInput = document.querySelector('#address_input');

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

        const removeFromCart = async (foodId) => {
            if (!foodId) {
                return false
            }
            const cart = retrieveCart();
            await cart.delete(foodId);
            showMessage("Item removed from cart", 'success')
            return resaveCart(cart);
        };

        const emptyCart = () => {
            localStorage.cart = '[]';
        };

        const htmlToElement = (html) => {
            var template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        };

        const fadeOut = (element) => {
            element.classList.add('fade');
            window.setTimeout(() => {
                element.classList.add('shrink');
            }, 600)
            window.setTimeout(() => {
                element.classList.add('hidden');
            }, 1100)
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

        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                const cart = retrieveCart();
                if (cart.size === 0) {
                    const text = `<div>You have not added any food items to your cart</div>`;
                    cartList.innerHTML = text;
                    return;
                }
                let sum = 0;
                cart.forEach((item, key) => {
                    sum += parseInt(item.cost);
                    let node = `<li class="raised horizontal card">
                <div class="img-thumbnail">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="horizontal card-details">
                  <h4 class="food-name">${item.name}</h4>
                  <h6 class="amount">Amount: $ <span class="amount">${item.cost}</span></h6>
                  <div class="order-buttons">
                    <button class="big button decline" data-id="${key}" data-cost="${item.cost}">Remove</button>
                  </div>
                </div>
              </li>`;
                    cartList.insertBefore(htmlToElement(node), addressInput);
                });
                total.textContent = sum;
            }
        };

        cartList.addEventListener('click', (event) => {
            const clicked = event.target;
            if (clicked.textContent === 'Remove') {
                removeFromCart(clicked.dataset.id);
                total.textContent = parseInt(total.textContent) - parseInt(clicked.dataset.cost);
                const parentList = clicked.parentNode.parentNode.parentNode;
                fadeOut(parentList);
            }
        });

        orderButton.addEventListener('click', (event) => {
            const cart = retrieveCart();
            checkout(cart);
        });

        const checkout = (cart) => {
            showMessage("Thank you for ordering!", 'success');
            setTimeout(() => {
                window.location = '';
                emptyCart();
            }, 2000)
        }
    };
}

const page = new CartPage('#/cart');

export default page;
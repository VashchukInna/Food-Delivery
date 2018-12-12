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
            showMessage('Item removed from cart', 'success');
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

            // removes whitespace from the beginning and end of the line
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
                    return reject('No items match your search');
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
                    item += `<li class="raised vertical card" id="${elem.id}">
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

        const showMessage = (message, status = 'failure') => {
            if (document.querySelector('.pop-up')) {
                hideMessage();
            }
            const elem = htmlToElement(`<div class="pop-up ${status}">
                  <p>${message}</p></div>`);

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

        // search by name of the dish
        window.onload = function () {
            let searchDishes = document.querySelector('#search-dishes'),
                dishes = document.querySelectorAll('.raised.vertical.card'),
                dishName = document.querySelectorAll('.food-name'),
                searchVal;
            searchDishes.addEventListener('keydown', function () {
                searchVal = this.value.toLowerCase();
                for (var i = 0; i < dishes.length; i++) {
                    if (!searchVal || dishName[i].innerHTML.toLowerCase().indexOf(searchVal) > -1) {
                        dishes[i].style['display'] = 'flex';
                    } else {
                        dishes[i].style['display'] = 'none';
                    }
                }
            });
        };

        // filter by cuisine, type of dish and day of the week
        window.search = function search() {
            let dishes = document.querySelectorAll('.raised.vertical.card');
            let dishName = document.querySelectorAll('.food-name');
            const filters = ["cuisine-ukrainian",
                "cuisine-chinese",
                "cuisine-italian",
                "day-of-the-week-monday",
                "day-of-the-week-tuesday",
                "day-of-the-week-wednesday",
                "day-of-the-week-thursday",
                "day-of-the-week-friday",
                "day-of-the-week-saturday",
                "day-of-the-week-sunday",
                "type-of-dish-soup",
                "type-of-dish-main",
                "type-of-dish-salad",
                "type-of-dish-pasta",
                "type-of-dish-pizza"]
                .map((id) => document.getElementById(id))
                .filter((el) => !!el && el.checked)
                .map((el) => (item) => !!item.search[el.name])
            for (let i = 0; i < dishes.length; i++) {
                if (filter(menu, filters).map(_ => _.name) == dishName[i].innerHTML) {
                    dishes[i].style['display'] = 'flex';
                } else {
                    dishes[i].style['display'] = 'none';
                }
            }
        };

        function filter(menu, filters) {
            return menu.filter((item) => {
                for (let i = 0; i < filters.length; i++) {
                    if (filters[i](item)) continue;
                    return false;
                }
                return true;
            })
        }

        // pagination
        let el = document.getElementById('pagination');

        window.onload = function () {
            let list = document.querySelectorAll('.raised.vertical.card');
            for (let i = 0; i < list.length; i++) {
                let start = 0;
                let end = 11;
                if (i > start && end > i) {
                    list[i].style.display = "block";
                } else {
                    list[i].style.display = "none";
                }
            }
        };

        let getDishes = menu.length;

        let service = {
            getDishesCount: function () {
                return getDishes;
            },
            getPagedData: function (pageNo, pageLength) {
                let startOfRecord = (pageNo - 1) * pageLength;
                let endOfRecord = startOfRecord + pageLength;
                let pagedData = getDishes.slice(startOfRecord, endOfRecord);
                return pagedData;
            }
        };

        let pagination = {
            currentPage: 1,
            pageLength: 11,
            totalRecords: 36,
            render: function () {
                this.totalRecords = service.getDishesCount();
                let pages = Math.ceil(this.totalRecords / this.pageLength);
                this.pages = pages;

                let buttons = '';

                for (let i = 1; i <= pages; i++) {
                    buttons += this.getButton(i);
                }

                el.innerHTML = buttons;

            },
            getButton: function (dish) {
                let classNames = 'pagination-btn';
                if (this.currentPage == dish) {
                    classNames += ' current-page';
                }
                let html = `
                    <button id="btn-${dish}"
                        class="${classNames}"
                        type="button"
                        onclick="gotoPage(this, ${dish})"
                    >${dish}
                    </button>
                `;
                return html;
            },
        };

        window.gotoPage = function gotoPage(btn, pageNo) {
            let start = 1;
            let end = 11;
            switch (pageNo) {
                case 1:
                    start = 1;
                    end = 11;
                    break;
                case 2:
                    start = 10;
                    end = 21;
                    break;
                case 3:
                    start = 20;
                    end = 31;
                    break;
                case 4:
                    start = 30;
                    end = 41;
                    break;
            }

            let list = document.querySelectorAll('.raised.vertical.card');
            for (let i = 0; i < list.length; i++) {
                if (i > start && end > i) {
                    list[i].style.display = 'block';
                } else {
                    list[i].style.display = 'none';
                }
            }
        };

        pagination.render();
    }
}


const page = new MenuPage('#/menu');

export default page;
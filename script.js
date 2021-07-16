const cartItems = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function totalPrice() {
  const sumPrice = document.querySelector('.total-price');
  let price = 0;
  const listPrices = document.querySelectorAll('li');
  listPrices.forEach((item) => {
  const computer = item.innerText.split('$');
  price += Number(computer[1]);
  });
  sumPrice.innerHTML = `${(Math.round((price * 100)) / 100)}`;
  } 

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getJson = async () => {
  const loading = document.querySelector('.loading');
  const linkProduct = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const fetchProductUrl = await fetch(linkProduct);
  const productJson = await fetchProductUrl.json();
  const productResults = productJson.results;
  loading.remove();
  productResults.forEach((product) => document.querySelector('.items')
    .appendChild(createProductItemElement(product)));   
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const getComputer = async (id) => {
  const linkComputer = `https://api.mercadolibre.com/items/${id}`;
  const fetchComputerUrl = await fetch(linkComputer);
  const computerJson = await fetchComputerUrl.json();    
  return computerJson;    
};

const addLocalStorage = () => {
  const list = document.querySelector(cartItems);
  const textList = list.innerHTML;
  localStorage.setItem('cartList', '');
  localStorage.setItem('cartList', JSON.stringify(textList));
};

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
  addLocalStorage();
}

const getLocalStorage = () => {
  const getStorage = JSON.parse(localStorage.getItem('cartList'));
  const list = document.querySelector(cartItems);
  list.innerHTML = getStorage;
  list.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const buttonEvent = () => {
  const computerList = document.querySelector('.items');
  computerList.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const btnParent = event.target.parentElement;
      const id = getSkuFromProductItem(btnParent);
      const computer = await getComputer(id);
      document.querySelector(cartItems)
        .appendChild(createCartItemElement(computer));
      addLocalStorage();
      totalPrice();
    }
  });
};

const buttonRemove = () => {
  const listComputers = document.querySelector('.cart__items');
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    while (listComputers.firstChild) {
      listComputers.removeChild(listComputers.firstChild);
      totalPrice();
      addLocalStorage();
    }
  });
};

window.onload = () => {
  getJson();
  buttonEvent();
  getLocalStorage();
  totalPrice();
  buttonRemove();
};
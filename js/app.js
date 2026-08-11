function renderLabels(labels) {
    if (!labels || labels.length === 0) return '';
    const labelItems = labels.map(label => `<span class="${label.type}">${label.text}</span>`).join('');
    return `<div class="product-label">${labelItems}</div>`;
}

function renderRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fa fa-star"></i> ' : '<i class="fa fa-star-o"></i> ';
    }
    return `<div class="product-rating">${stars}</div>`;
}

function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;
}

function quickAddToCart(productId) {
    const products = window.allProducts || [];
    const product = products.find(p => String(p.id) === String(productId));

    if (!product) {
        alert('Không tìm thấy thông tin sản phẩm!');
        return;
    }

    const selectedStorage = (product.storages && product.storages.length > 0) ? product.storages[0] : '';
    const selectedColor = (product.colors && product.colors.length > 0) ? (product.colors[0].name || product.colors[0].code) : '';
    const unitPrice = parsePrice(product.price);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item =>
        String(item.id) === String(product.id) &&
        item.storage === selectedStorage &&
        item.color === selectedColor
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
        cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            priceFormatted: product.price,
            unitPrice: unitPrice,
            quantity: 1,
            totalPrice: unitPrice,
            storage: selectedStorage,
            color: selectedColor
        };
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

function renderProducts(products) {
    const container = document.getElementById('product-list');
    if (!container) return;

    const htmlContent = products.map(product => {
        return `
            <!-- Thêm col-md-4 để chia 3 sản phẩm 1 dòng -->
            <div class="col-md-4 col-xs-6">
                <div class="product" style="margin-bottom: 30px;">
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                        ${renderLabels(product.labels)}
                    </div>
                    <div class="product-body">
                        <p class="product-category">${product.category}</p>
                        <h3 class="product-name"><a href="detail.html?id=${product.id}">${product.name}</a></h3>
                        <h4 class="product-price">
                            ${product.price} 
                            ${product.oldPrice ? `<del class="product-old-price">${product.oldPrice}</del>` : ''}
                        </h4>
                        ${renderRating(product.rating)}
                        <div class="product-btns">
                            <button class="add-to-wishlist">
                                <i class="fa fa-heart-o"></i>
                                <span class="tooltipp">Thêm vào yêu thích</span>
                            </button>
                            <button class="add-to-compare">
                                <i class="fa fa-exchange"></i>
                                <span class="tooltipp">So sánh sản phẩm</span>
                            </button>
                        </div>
                    </div>
                    <!-- Nút Thêm Vào Giỏ Hàng -->
                    <div class="add-to-cart">
                        <button class="add-to-cart-btn" onclick="quickAddToCart('${product.id}')">
                            <i class="fa fa-shopping-cart"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = htmlContent;
}

fetch('data/products.json')
    .then(response => response.json())
    .then(data => {
        window.allProducts = data;
        renderProducts(data);
    })
    .catch(error => console.error('Lỗi khi tải dữ liệu sản phẩm:', error));
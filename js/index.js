document.addEventListener('DOMContentLoaded', function () {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file products.json');
            return response.json();
        })
        .then(products => {
            window.allProducts = products;

            function renderTab(tabSelector) {
                const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
                const container = document.querySelector(`${tabSelector} .products-slick`);

                if (!container) return;

                container.innerHTML = randomProducts.map((item, index) => {
                    let labelHTML = '';
                    if (item.discount || item.badge) {
                        labelHTML = `
                            <div class="product-label">
                                ${item.discount ? `<span class="sale">${item.discount}</span>` : ''}
                                ${item.badge ? `<span class="new">${item.badge}</span>` : ''}
                            </div>
                        `;
                    }

                    const rating = item.rating || 5;
                    let starsHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHTML += i <= rating ? '<i class="fa fa-star"></i>\n' : '<i class="fa fa-star-o"></i>\n';
                    }

                    const oldPriceHTML = item.oldPrice ? `<del class="product-old-price">${item.oldPrice}</del>` : '';

                    return `
                        <!-- Sản phẩm ${index + 1} -->
                        <div class="product">
                            <div class="product-img">
                                <img src="${item.image || ''}" alt="${item.name || ''}">
                                ${labelHTML}
                            </div>
                            <div class="product-body">
                                <p class="product-category">${item.category || ''}</p>
                                <h3 class="product-name"><a href="detail.html?id=${item.id}">${item.name || ''}</a></h3>
                                <h4 class="product-price">${item.price || ''} ${oldPriceHTML}</h4>
                                <div class="product-rating">
                                    ${starsHTML}
                                </div>
                                <div class="product-btns">
                                    <button class="add-to-wishlist"><i class="fa fa-heart-o"></i><span class="tooltipp">Thêm vào yêu thích</span></button>
                                    <button class="add-to-compare"><i class="fa fa-exchange"></i><span class="tooltipp">So sánh sản phẩm</span></button>
                                    <a class="quick-view" href="detail.html?id=${item.id}"><i class="fa fa-eye"></i><span class="tooltipp">Xem chi tiết</span></a>
                                </div>
                            </div>
                            <!-- Nút Thêm Vào Giỏ Hàng Trực Tiếp -->
                            <div class="add-to-cart">
                                <button class="add-to-cart-btn" onclick="quickAddToCart('${item.id}')">
                                    <i class="fa fa-shopping-cart"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                        <!-- /Sản phẩm ${index + 1} -->
                    `;
                }).join('');
            }

            renderTab('#tab-smartphones');
            renderTab('#tab2');

            if (typeof $ !== 'undefined' && $.fn.slick) {
                $('.products-slick').each(function () {
                    var $this = $(this),
                        $nav = $this.attr('data-nav');

                    if ($this.hasClass('slick-initialized')) {
                        $this.slick('unslick');
                    }

                    $this.slick({
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        autoplay: true,
                        infinite: true,
                        speed: 300,
                        dots: false,
                        arrows: true,
                        appendArrows: $nav ? $nav : false,
                        responsive: [
                            {
                                breakpoint: 991,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]
                    });
                });
            }
        })
        .catch(err => console.error('Lỗi nạp dữ liệu:', err));

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('product-details-container');

    if (container && productId) {
        fetch('data/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id == productId || p.id === String(productId));

                if (!product) {
                    container.innerHTML = '<h3>Sản phẩm không tồn tại!</h3>';
                    return;
                }

                window.currentProduct = product;
                renderProductDetail(product, container);
            })
            .catch(error => {
                console.error('Lỗi khi tải chi tiết sản phẩm:', error);
                container.innerHTML = '<h3>Đã có lỗi xảy ra khi tải dữ liệu!</h3>';
            });
    }
});

/* ===================================================
   CÁC HÀM XỬ LÝ TRANG CHI TIẾT SẢN PHẨM
   =================================================== */
function renderProductDetail(product, container) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += i <= product.rating ? '<i class="fa fa-star"></i>' : '<i class="fa fa-star-o"></i>';
    }

    let storageOptionsHtml = '';
    if (product.storages && product.storages.length > 0) {
        const options = product.storages.map(s => `<option value="${s}">${s}</option>`).join('');
        storageOptionsHtml = `
            <label>
                Dung lượng
                <select class="input-select" id="selectedStorage">
                    ${options}
                </select>
            </label>
        `;
    }

    let colorOptionsHtml = '';
    if (product.colors && product.colors.length > 0) {
        const options = product.colors.map(c => `<option value="${c.name || c.code}">${c.name || c.code}</option>`).join('');
        colorOptionsHtml = `
            <label>
                Màu sắc
                <select class="input-select" id="selectedColor">
                    ${options}
                </select>
            </label>
        `;
    }

    container.innerHTML = `
        <h2 class="product-name">${product.name}</h2>
        <div>
            <div class="product-rating">
                ${starsHtml}
            </div>
            <a class="review-link" href="#">${product.reviewCount || 0} Đánh giá | Thêm đánh giá của bạn</a>
        </div>
        <div>
            <h3 class="product-price">
                ${product.price} 
                ${product.oldPrice ? `<del class="product-old-price">${product.oldPrice}</del>` : ''}
            </h3>
            <span class="product-available">${product.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
        </div>
        <p>${product.description || ''}</p>

        <div class="product-options">
            ${storageOptionsHtml}
            ${colorOptionsHtml}
        </div>

        <div class="add-to-cart">
            <div class="qty-label">
                Số lượng
                <div class="input-number">
                    <input type="number" id="productQty" value="1" min="1">
                    <span class="qty-up">+</span>
                    <span class="qty-down">-</span>
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                <i class="fa fa-shopping-cart"></i> Thêm vào giỏ hàng
            </button>
        </div>

        <ul class="product-btns">
            <li><a href="#"><i class="fa fa-heart-o"></i> Thêm vào yêu thích</a></li>
            <li><a href="#"><i class="fa fa-exchange"></i> So sánh sản phẩm</a></li>
        </ul>

        <ul class="product-links">
            <li>Danh mục:</li>
            <li><a href="#">${product.category}</a></li>
        </ul>

        <ul class="product-links">
            <li>Chia sẻ:</li>
            <li><a href="#"><i class="fa fa-facebook"></i></a></li>
            <li><a href="#"><i class="fa fa-twitter"></i></a></li>
            <li><a href="#"><i class="fa fa-google-plus"></i></a></li>
            <li><a href="#"><i class="fa fa-envelope"></i></a></li>
        </ul>
    `;

    initQtyEvents();
}

function initQtyEvents() {
    const qtyInput = document.getElementById('productQty');
    const qtyUp = document.querySelector('.qty-up');
    const qtyDown = document.querySelector('.qty-down');

    if (qtyUp && qtyDown && qtyInput) {
        qtyUp.addEventListener('click', function () {
            qtyInput.value = parseInt(qtyInput.value) || 1;
            qtyInput.value = parseInt(qtyInput.value) + 1;
        });
        qtyDown.addEventListener('click', function () {
            qtyInput.value = parseInt(qtyInput.value) || 1;
            if (parseInt(qtyInput.value) > 1) {
                qtyInput.value = parseInt(qtyInput.value) - 1;
            }
        });
    }
}

// Hàm hỗ trợ chuyển chuỗi giá tiền ("15.000.000₫") về số (15000000)
function parsePrice(priceString) {
    if (typeof priceString === 'number') return priceString;
    if (!priceString) return 0;
    return parseInt(priceString.replace(/[^\d]/g, ''), 10) || 0;
}

// Hàm thêm từ trang CHI TIẾT SẢN PHẨM (có tùy chọn màu sắc, dung lượng, số lượng)
function addToCart(productId) {
    const product = window.currentProduct;
    if (!product) return;

    const qtyInput = document.getElementById('productQty');
    const quantity = parseInt(qtyInput ? qtyInput.value : 1) || 1;

    const storageSelect = document.getElementById('selectedStorage');
    const colorSelect = document.getElementById('selectedColor');
    const selectedStorage = storageSelect ? storageSelect.value : '';
    const selectedColor = colorSelect ? colorSelect.value : '';

    const unitPrice = parsePrice(product.price);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingIndex = cart.findIndex(item =>
        String(item.id) === String(product.id) &&
        item.storage === selectedStorage &&
        item.color === selectedColor
    );

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].totalPrice = cart[existingIndex].quantity * cart[existingIndex].unitPrice;
    } else {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            category: product.category,
            priceFormatted: product.price,
            unitPrice: unitPrice,
            quantity: quantity,
            totalPrice: unitPrice * quantity,
            storage: selectedStorage,
            color: selectedColor
        };
        cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm sản phẩm vào giỏ hàng thành công!');
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
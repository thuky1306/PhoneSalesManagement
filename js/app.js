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

function renderProducts(products) {
    const container = document.getElementById('product-list');

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
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = htmlContent;
}

fetch('data/products.json')
    .then(response => response.json())
    .then(data => renderProducts(data))
    .catch(error => console.error('Lỗi khi tải dữ liệu sản phẩm:', error));
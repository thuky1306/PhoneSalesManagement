document.addEventListener('DOMContentLoaded', function () {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) throw new Error('Không thể tải file products.json');
            return response.json();
        })
        .then(products => {
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

                    // Cấu trúc HTML nguyên bản
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
                                    <a class="quick-view" href="detail.html?id=${item.id}"><i class="fa fa-eye"></i><span class="tooltipp"></span></a>
                                </div>
                            </div>
                        </div>
                        <!-- /Sản phẩm ${index + 1} -->
                    `;
                }).join('');
            }

            renderTab('#tab-smartphones'); 
            renderTab('#tab2');           

            // Khởi tạo lại Slick Slider cho cả 2 Nav
            if (typeof $ !== 'undefined' && $.fn.slick) {
                $('.products-slick').each(function () {
                    var $this = $(this),
                        $nav = $this.attr('data-nav');

                    // Nếu slider đã chạy trước đó thì huỷ để load dữ liệu mới
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
});
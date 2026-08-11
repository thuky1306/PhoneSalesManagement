document.addEventListener('DOMContentLoaded', function () {
    renderCart();

    const btnClearCart = document.getElementById('btnClearCart');
    if (btnClearCart) {
        btnClearCart.addEventListener('click', clearCart);
    }
});

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const tbody = document.getElementById('cart-tbody');
    if (!tbody) return;

    const cart = getCart();

    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px;">
                    <p style="font-size: 16px; margin-bottom: 10px;">Giỏ hàng của bạn đang trống!</p>
                    <a href="index.html" class="btn-continue" style="display: inline-block;">Mua sắm ngay</a>
                </td>
            </tr>
        `;
        updateOrderSummary(0, 0);
        return;
    }

    tbody.innerHTML = cart.map((item, index) => {
        const unitPrice = item.unitPrice || 0;
        const quantity = item.quantity || 1;
        const subtotal = unitPrice * quantity;

        const optionText = [item.storage, item.color].filter(Boolean).join(' - ');

        return `
            <tr>
                <td>
                    <div class="cart-item-info">
                        <div class="cart-item-img">
                            <img src="${item.image || 'img/no-image.png'}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="category">${item.category || ''}</div>
                            <a href="detail.html?id=${item.id}" class="name">${item.name}</a>
                            ${optionText ? `<p style="font-size: 12px; color: #888; margin: 3px 0 0;">Phân loại: ${optionText}</p>` : ''}
                        </div>
                    </div>
                </td>
                <td><span class="price-text">${formatCurrency(unitPrice)}</span></td>
                <td style="text-align: center;">
                    <div class="qty-box">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <input type="number" class="qty-input" value="${quantity}" min="1" onchange="changeQtyInput(${index}, this.value)">
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </td>
                <td style="text-align: right;"><span class="subtotal-text">${formatCurrency(subtotal)}</span></td>
                <td style="text-align: center;">
                    <button class="btn-remove" title="Xóa" onclick="removeItem(${index})">
                        <i class="fa fa-times"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const grandTotal = cart.reduce((sum, item) => sum + ((item.unitPrice || 0) * (item.quantity || 1)), 0);

    updateOrderSummary(grandTotal, totalQuantity);
}

function updateQty(index, change) {
    let cart = getCart();
    if (!cart[index]) return;

    cart[index].quantity = (cart[index].quantity || 1) + change;

    if (cart[index].quantity < 1) {
        if (confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = 1;
        }
    } else {
        cart[index].totalPrice = cart[index].unitPrice * cart[index].quantity;
    }

    saveCart(cart);
}

function changeQtyInput(index, value) {
    let cart = getCart();
    if (!cart[index]) return;

    let newQty = parseInt(value);

    if (isNaN(newQty) || newQty < 1) {
        alert('Số lượng không hợp lệ!');
        renderCart();
        return;
    }

    cart[index].quantity = newQty;
    cart[index].totalPrice = cart[index].unitPrice * cart[index].quantity;

    saveCart(cart);
}

function removeItem(index) {
    let cart = getCart();
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        cart.splice(index, 1);
        saveCart(cart);
    }
}

function clearCart() {
    let cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
        localStorage.removeItem('cart');
        renderCart();
    }
}

function updateOrderSummary(grandTotal, totalQuantity) {
    const summaryContainer = document.querySelector('.summary-card');
    if (!summaryContainer) return;

    const subtotalText = summaryContainer.querySelector('.summary-row:first-of-type span:last-child');
    const subtotalLabel = summaryContainer.querySelector('.summary-row:first-of-type span:first-child');
    const totalPriceText = summaryContainer.querySelector('.summary-total-price');

    if (subtotalLabel) {
        subtotalLabel.textContent = `Tạm tính (${totalQuantity} sản phẩm)`;
    }
    if (subtotalText) {
        subtotalText.textContent = formatCurrency(grandTotal);
    }
    if (totalPriceText) {
        totalPriceText.textContent = formatCurrency(grandTotal);
    }
}
import api from '../utils/backend-api.utils';
import * as common from './../utils/common';

const ProductCard = ({ id, name, price, brand, sku, oldPrice, image, warrantyStatus, onClick }) => {
    const addToCart = async () => {
        try {
            let body = {
                cartItems: [
                    {
                        inforProduct: id,
                        quantity: 1
                    }
                ]
            }
            const res = await api.cart.postCart(body);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Thêm thành công vào giỏ hàng", 'success');
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch (e) {
            common.Toast(e.message, 'error');
        }
    }

    return (
        <div className="product-card">
            <div className="img-product-box">
                <img src={image} />
            </div>
            <div className="product-info">
                <div className="product-name">{name}</div>
                <div className="product-price">Giá bán: {common.numberWithCommas(price)} VND</div>
                <div className="product-brand">Thương hiệu: {brand}</div>
                <div className="product-warranty">Tình trạng bảo hành: <span>{warrantyStatus ? 'Vẫn còn' : 'Hết hạn'}</span></div>
                <div className="product-sku">SKU: <span>{sku}</span></div>
                <div className="product-primary-price">Giá gốc: <span>{common.numberWithCommas(oldPrice)} VND</span></div>
            </div>
            <div className="product-action">
                <button className="btn button-add-to-cart" onClick={addToCart}>Thêm vào giỏ hàng</button>
                <button className="btn button-buy-now">Mua ngay</button>
                <button className="btn button-detail" onClick={onClick}>Chi tiết</button>
            </div>
        </div>
    )
}

export default ProductCard;

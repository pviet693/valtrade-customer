const ProductCard = ({ name, price, brand, sku, oldPrice, image, warrantyStatus, onClick }) => {
    // const formatName = (name) => {
    //     return `${name.substring(0, 45)}...`;
    // }

    return (
        <div className="product-card">
            <div className="img-product-box">
                <img src={image} />
            </div>
            <div className="product-info">
                <div className="product-name">{name}</div>
                <div className="product-price">Giá bán: {new Intl.NumberFormat().format(price)} VND</div>
                <div className="product-brand">Thương hiệu: {brand}</div>
                <div className="product-warranty">Tình trạng bảo hành: <span>{warrantyStatus ? 'Vẫn còn' : 'Hết hạn'}</span></div>
                <div className="product-sku">SKU: <span>{sku}</span></div>
                <div className="product-primary-price">Giá gốc: <span>{new Intl.NumberFormat().format(oldPrice)} VND</span></div>
            </div>
            <div className="product-action">
                <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                <button className="btn button-buy-now">Mua ngay</button>
                <button className="btn button-detail" onClick={onClick}>Chi tiết</button>
            </div>
        </div>
    )
}

export default ProductCard;

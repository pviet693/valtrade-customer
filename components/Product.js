const Product = ({ name, price, brand, sku, oldPrice, image}) => {
    const formatPrice = (price) => {
       return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div className="col-md-3 d-flex align-items-center flex-column mb-4 h-100">
            <div className="product-card">
                <div className="img-product-box">
                    <img src={image} />
                </div>
                <div className="product-info">
                    <div className="product-name">Tên: {name}</div>
                    <div className="product-price">Giá bán: {formatPrice(price)} VND</div>
                    <div className="product-brand">Thương hiệu: {brand}</div>
                    <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                    <div className="product-sku">SKU: <span>{sku}</span></div>
                    <div className="product-primary-price">Giá gốc: <span>{formatPrice(oldPrice)} VND</span></div>
                </div>
                <div className="product-action">
                    <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                    <button className="btn button-buy-now">Mua ngay</button>
                    <button className="btn button-detail">Chi tiết</button>
                </div>
            </div>
        </div>
    )
}

export default Product

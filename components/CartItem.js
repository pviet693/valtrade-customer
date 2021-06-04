import { Checkbox } from 'primereact/checkbox';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as common from './../utils/common';

export const CartItem = (props) => {
    const {
        productId,
        shopName, shopId, contact,
        isChoose, productName, productImage,
        productPrice, productQuantity, total,
        increase, decrease, selectCard,
        viewDetail, remove
    } = props;

    return (
        <div className="cart-item-content">
            <div className="cart-item__shop">
                <div className="cart-item__shop-name">
                    {shopName}
                </div>
                <div className="cart-item__shop-contact" href="tel:">
                    Liên hệ: <a className="cart-item__shop-contact" href="tel:">{common.formatPhone(contact)}</a>
                </div>
                <button className="btn btn-view-shop">Xem shop</button>
                <button className="btn btn-remove" onClick={() => remove(productId)}><DeleteOutlineIcon /></button>
            </div>
            <div className="cart-item__product">
                <div className="cart-item__product-info">
                    <Checkbox inputId="123" checked={isChoose} onChange={() => selectCard(productId)} />
                    <img src={productImage} alt="image" />
                    <div className="name">{productName}</div>
                </div>
                <div className="cart-item__product-price">
                    {common.numberWithCommas(productPrice)} VND
                </div>
                <div className="cart-item__product-quantity">
                    <div className="cart-item__product-quantity-container">
                        <button className="btn-increment-decrement" onClick={() => decrease(productId)}>-</button>
                        <input className="input-quantity" value={productQuantity} onChange={() => { }} disabled={true} />
                        <button className="btn-increment-decrement" onClick={() => increase(productId)}>+</button>
                    </div>
                </div>
                <div className="cart-item__product-total">
                    {common.numberWithCommas(total)} VND
                </div>
                <div className="cart-item__product-action">
                    <button className="btn btn-view-detail" onClick={() => viewDetail(productId)}>Chi tiết</button>
                </div>
            </div>
        </div>
    )
}
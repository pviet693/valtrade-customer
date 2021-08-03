import * as common from './../utils/common';
import { v4 as uuidv4 } from "uuid";

export const OrderItem = (props) => {
    const { order, onClick } = props;
    const {
        total,
        contact,
        status,
        arrayProductShop
    } = order;
    return (
        <div className="order-item__container" onClick={onClick}>
            <div className="order-item__header">
                <div className="shop-infor">
                    <div className="shop-name">
                        Liên hệ shop:
                    </div>
                    <div className="shop-contact">
                        {contact}
                    </div>
                    <button className="view-shop">
                        Xem shop
                    </button>
                </div>
                <div className="order-status">
                    {status}
                </div>
            </div>
            <div className="order-item__content">
                {
                    arrayProductShop?.map((product) => (
                        <div key={uuidv4()} className="order-infor">
                            <img src={product.image} width="160" height="140" />
                            <div className="ml-4">
                                <div className="product-name">
                                    {product.name}
                                </div>
                                <div>x {product.quantity}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="order-item__summary">
                Tổng số tiền: {common.numberWithCommas(total)}
            </div>
        </div>
    )
}
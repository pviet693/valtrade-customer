import { Checkbox } from 'primereact/checkbox';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as common from './../utils/common';
import Button from '@material-ui/core/Button';
import { useEffect } from 'react';
import api from '../utils/backend-api.utils';

export const OrderItem = ({phone, arrayProduct }) => {
    console.log(arrayProduct);
    return (
        <div className="order-item__container">
            <div className="order-item__header">
                <div className="shop-infor">
                    <div className="shop-name">
                        Liên hệ shop:
                    </div>
                    <div className="shop-contact">
                        {phone}
                    </div>
                    <button className="view-shop">
                        Xem shop
                    </button>
                </div>
                <div className="order-status">
                    Trạng thái đơn hàng
                </div>
            </div>
            <div className="order-item__content">
                {
                    arrayProduct.map(x=> (
                        <div key={x.id} className="order-infor">
                            <img src={x.image} width="150" height="130" />
                            <div className="ml-3">
                                <div className="product-name">
                                    {x.name}
                                </div>
                                <div>x {x.quantity}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="order-item__summary">
                Tổng số tiền: 150.000   
            </div>
        </div>
    )
}
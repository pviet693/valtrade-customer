import { Checkbox } from 'primereact/checkbox';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import * as common from './../utils/common';
import Button from '@material-ui/core/Button';

export const OrderItem = (props) => {
    const {abc} = props;

    return (
        <div className="order-item__container">
            <div className="order-item__header">
                <div className="shop-infor">
                    <div className="shop-name">
                        Tên shop
                    </div>
                    <div className="shop-contact">
                        0967541985
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
                <div className="order-infor">
                    <img src="/static/adidas-3-la.jpg" width="150" height="130" />
                    <div className="ml-3">
                        <div className="product-name">
                            Áo sơ mi nam công sở Hàng Hiệu Louis Oxford Cotton cao cấp sơ mi nam đẹp xuất khẩu form SlimFit Hàn Quốc - Anle Store
                        </div>
                        <div>x 1</div>
                    </div>
                </div>
                <div className="order-price">
                    139.000
                </div>
            </div>
            <div className="order-item__summary">
                Tổng số tiền: 150.000   
            </div>
        </div>
    )
}
import Head from "next/head";
import SlideNav from "../components/SlideNav";
import { useContext, useEffect, useState } from "react";
import * as common from "../utils/common";
import api from "../utils/backend-api.utils";
import { Timeline } from 'primereact/timeline';
import { useRouter } from 'next/router';
import { DataContext } from "../store/GlobalState";
import classNames from "classnames";

function MyOrder() {
    const { toast } = useContext(DataContext);
    const router = useRouter();
    const [idOrder, setIdOrder] = useState("");
    const [listStatus, setListStatus] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);

    const getData = async (id) => {
        try {
            const response = await api.order.getOrderDetail(id);
            const { result } = response.data;
            const { inforOrder } = result;
            setOrderDetails(inforOrder);
            const listState = [{ state: "Chấp nhận đơn hàng", timeState: inforOrder.timeOrder }].concat(inforOrder.stateOrder);
            listState.reverse();
            setListStatus(listState);
        } catch (error) {
            common.ToastPrime("Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    }

    useState(() => {
        console.log(listStatus);
    }, [listStatus]);

    useEffect(() => {
        if (idOrder) {
            getData(idOrder);
        }
    }, [idOrder]);

    useEffect(() => {
        const { id } = router.query;
        setIdOrder(id);
    }, []);

    return (
        <>
            <Head>
                <title>Chi tiết đơn hàng</title>
            </Head>
            <div className="order-details__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="order-details__content">
                            <div className="order-details__content__title">Chi tiết đơn hàng</div>
                            <hr />
                            <div className="order-details-status">
                                <div className="step-status">
                                    <div className={classNames("step-status__icon", { "active-icon": orderDetails?.stateOrder.length >= 1 })}>
                                        <svg enableBackground="new 0 0 32 32" viewBox="0 0 32 32" x="0" y="0"
                                            className={classNames("svg-icon", { "active": orderDetails?.stateOrder.length >= 1 })}
                                        ><g><path d="m5 3.4v23.7c0 .4.3.7.7.7.2 0 .3 0 .3-.2.5-.4 1-.5 1.7-.5.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1s1.7.4 2.2 1.1c.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.9 0 1.7.4 2.2 1.1.2.2.3.4.5.4s.3-.2.5-.4c.5-.7 1.4-1.1 2.2-1.1.7 0 1.2.2 1.7.5.2.2.3.2.3.2.3 0 .7-.4.7-.7v-23.7z" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></path><g><line fill="none" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="3" x1="10" x2="22" y1="11.5" y2="11.5"></line><line fill="none" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="3" x1="10" x2="22" y1="18.5" y2="18.5"></line></g></g></svg>
                                    </div>
                                    <div className="step-status__label">
                                        Đã đặt hàng
                                    </div>
                                    <div className="step-status__time">
                                        {orderDetails?.stateOrder.length >= 1 ? common.formatTime(orderDetails?.stateOrder[0].timeState) : ""}
                                    </div>
                                </div>
                                <div className="step-status">
                                    <div className={classNames("step-status__icon", { "active-icon": orderDetails?.stateOrder.length >= 2 })}>
                                        <svg enableBackground="new 0 0 32 32" viewBox="0 0 32 32" x="0" y="0"
                                            className={classNames("svg-icon", { "active": orderDetails?.stateOrder.length >= 2 })}
                                        ><g><path clipRule="evenodd" d="m24 22h-21c-.5 0-1-.5-1-1v-15c0-.6.5-1 1-1h21c .5 0 1 .4 1 1v15c0 .5-.5 1-1 1z" fill="none" fillRule="evenodd" strokeMiterlimit="10" strokeWidth="3"></path><path clipRule="evenodd" d="m24.8 10h4.2c.5 0 1 .4 1 1v15c0 .5-.5 1-1 1h-21c-.6 0-1-.4-1-1v-4" fill="none" fillRule="evenodd" strokeMiterlimit="10" strokeWidth="3"></path><path d="m12.9 17.2c-.7-.1-1.5-.4-2.1-.9l.8-1.2c.6.5 1.1.7 1.7.7.7 0 1-.3 1-.8 0-1.2-3.2-1.2-3.2-3.4 0-1.2.7-2 1.8-2.2v-1.3h1.2v1.2c.8.1 1.3.5 1.8 1l-.9 1c-.4-.4-.8-.6-1.3-.6-.6 0-.9.2-.9.8 0 1.1 3.2 1 3.2 3.3 0 1.2-.6 2-1.9 2.3v1.2h-1.2z" stroke="none"></path></g></svg>
                                    </div>
                                    <div className="step-status__label">
                                        Đã xác nhận thông tin thanh toán
                                    </div>
                                    <div className="step-status__time">
                                        {orderDetails?.stateOrder.length >= 2 ? common.formatTime(orderDetails?.stateOrder[1].timeState) : ""}
                                    </div>
                                </div>
                                <div className="step-status">
                                    <div className={classNames("step-status__icon", { "active-icon": orderDetails?.stateOrder.length >= 3 })}>
                                        <svg enableBackground="new 0 0 32 32" viewBox="0 0 32 32" x="0" y="0"
                                            className={classNames("svg-icon", { "active": orderDetails?.stateOrder.length >= 3 })}
                                        ><g><line fill="none" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" x1="18.1" x2="9.6" y1="20.5" y2="20.5"></line><circle cx="7.5" cy="23.5" fill="none" r="4" strokeMiterlimit="10" strokeWidth="3"></circle><circle cx="20.5" cy="23.5" fill="none" r="4" strokeMiterlimit="10" strokeWidth="3"></circle><line fill="none" strokeMiterlimit="10" strokeWidth="3" x1="19.7" x2="30" y1="15.5" y2="15.5"></line><polyline fill="none" points="4.6 20.5 1.5 20.5 1.5 4.5 20.5 4.5 20.5 18.4" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polyline><polyline fill="none" points="20.5 9 29.5 9 30.5 22 24.7 22" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polyline></g></svg>
                                    </div>
                                    <div className="step-status__label">
                                        Đã giao cho ĐVVC
                                    </div>
                                    <div className="step-status__time">
                                        {orderDetails?.stateOrder.length >= 3 ? common.formatTime(orderDetails?.stateOrder[2].timeState) : ""}
                                    </div>
                                </div>
                                <div className="step-status">
                                    <div className={classNames("step-status__icon", { "active-icon": orderDetails?.stateOrder.length >= 4 })}>
                                        <svg enableBackground="new 0 0 32 32" viewBox="0 0 32 32" x="0" y="0"
                                            className={classNames("svg-icon", { "active": orderDetails?.stateOrder.length >= 4 })}
                                        ><g><polygon fill="none" points="2 28 2 19.2 10.6 19.2 11.7 21.5 19.8 21.5 20.9 19.2 30 19.1 30 28" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polygon><polyline fill="none" points="21 8 27 8 30 19.1" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polyline><polyline fill="none" points="2 19.2 5 8 11 8" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polyline><line fill="none" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3" x1="16" x2="16" y1="4" y2="14"></line><path d="m20.1 13.4-3.6 3.6c-.3.3-.7.3-.9 0l-3.6-3.6c-.4-.4-.1-1.1.5-1.1h7.2c.5 0 .8.7.4 1.1z" stroke="none"></path></g></svg>
                                    </div>
                                    <div className="step-status__label">
                                        Đơn hàng đã nhận
                                    </div>
                                    <div className="step-status__time">
                                        {orderDetails?.stateOrder.length >= 4 ? common.formatTime(orderDetails?.stateOrder[3].timeState) : ""}
                                    </div>
                                </div>
                                <div className="step-status">
                                    <div className={classNames("step-status__icon", { "active-icon": orderDetails?.stateOrder.length >= 5 })}>
                                        <svg enableBackground="new 0 0 32 32" viewBox="0 0 32 32" x="0" y="0"
                                            className={classNames("svg-icon", { "active": orderDetails?.stateOrder.length >= 5 })}
                                        ><polygon fill="none" points="16 3.2 20.2 11.9 29.5 13 22.2 19 24.3 28.8 16 23.8 7.7 28.8 9.8 19 2.5 13 11.8 11.9" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></polygon></svg>
                                    </div>
                                    <div className="step-status__label">
                                        Đơn hàng đã giao
                                    </div>
                                    <div className="step-status__time">
                                        {orderDetails?.stateOrder.length >= 5 ? common.formatTime(orderDetails?.stateOrder[4].timeState) : ""}
                                    </div>
                                </div>

                                <div className="status__line">
                                    <div className="status__line-background" style={{ background: "rgb(224, 224, 224)" }}></div>
                                    <div className="status__line-foreground" style={{ width: "calc((100% - 160px) * 1)", background: "rgb(45, 194, 88)" }}></div>
                                </div>
                            </div>
                            <div className="divide" />
                            <div className="d-flex justify-content-between">
                                <h5>Địa Chỉ Nhận Hàng</h5>
                                <div style={{
                                    fontSize: "0.875em"
                                }}>
                                    <div>
                                        {
                                            orderDetails && Object.keys(orderDetails?.shipType)[0] === "ghn"
                                                ? "Giao hàng nhanh"
                                                : orderDetails && Object.keys(orderDetails?.shipType)[0] === "ghtk"
                                                    ? "Giao hàng tiết kiệm"
                                                    : "Nhận hàng tại shop"
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex mb-3">
                                <div className="address-order">
                                    <div>{orderDetails?.nameRecei}</div>
                                    <div>{orderDetails?.contact}</div>
                                    <div>{orderDetails?.addressOrder}</div>
                                </div>
                                <div className="order-timeline">
                                    <Timeline value={listStatus} content={(item) => `${common.formatTime(item.timeState)} -- ${item.state}`} />
                                </div>
                            </div>
                            {/* <div className="order-cart">
                                <div className="order-cart__header">
                                    <div className="mr-3" style={{ fontWeight: 600 }}>Tin shop</div>
                                    <div>Liên hệ: 09765315678</div>
                                </div>
                                <hr style={{ marginTop: 0 }} />
                                <div className="order-cart__product">
                                    <div className="product-info">
                                        <img src="/static/adidas-3-la.jpg" />
                                        <div>
                                            <div>KTX khu A, Phường Linh Trung, Quận Thủ Đức, TP. Hồ Chí Minh</div>
                                            <div>x 1</div>
                                        </div>
                                    </div>
                                    <div>379000 VND</div>
                                </div>
                                <hr style={{ marginBottom: 0 }} />
                                <div className="order-summary">
                                    <div className="d-flex">
                                        <div>Tổng tiền hàng: </div>
                                        <div className="money">379000 VND</div>
                                    </div>
                                    <div className="d-flex">
                                        <div>Phí vận chuyển: </div>
                                        <div className="money">379000 VND</div>
                                    </div>
                                    <div className="d-flex">
                                        <div>Tổng số tiền: </div>
                                        <div className="money">379000 VND</div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyOrder;

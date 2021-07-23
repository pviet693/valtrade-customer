import Head from "next/head";
import SlideNav from "./../components/SlideNav";
import { OrderItem } from "../components/OrderItem";

function MyOrder(params) {
    return (
        <>
            <Head>
                <title>Quản lí đơn hàng</title>
            </Head>
            <div className="notification__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="notification__content">
                            <div className="notification__content__title">Quản lí đơn hàng</div>
                            <hr />

                            <OrderItem />
                            <OrderItem />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyOrder;

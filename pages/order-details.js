import Head from "next/head";
import SlideNav from "./../components/SlideNav";
import { OrderItem } from "../components/OrderItem";
import { useEffect, useState } from "react";
import api from "../utils/backend-api.utils";
import { v4 as uuidv4 } from "uuid";

function MyOrder() {
    const [orderDetails, setOrderDetails] = useState(null);

    const getData = async () => {

    }

    useEffect(() => {

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
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyOrder;

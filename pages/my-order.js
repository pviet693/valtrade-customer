import Head from "next/head";
import SlideNav from "./../components/SlideNav";
import { OrderItem } from "../components/OrderItem";
import { useEffect, useState } from "react";
import api from "../utils/backend-api.utils";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from 'next/router';

function MyOrder() {
    const router = useRouter();
    const [lstOrder, setLstOrder] = useState([]);

    useEffect(async() =>{
        try{
            const res = await api.order.getOrder();
            if (res.status==200){
                if (res.data.code === 200){
                    let orders = [];
                    const { result } = res.data;
                    result.forEach((order) => {
                        const { inforOrder, _id } = order;
                        const { total, contact, stateOrder, arrayProductShop } = inforOrder;
                        const status = stateOrder[stateOrder.length - 1].state;
                        let orderItem = {
                            id: _id,
                            total,
                            contact,
                            status,
                            arrayProductShop: []
                        }
                        arrayProductShop.forEach((product) => {
                            const { inforProduct, quantity } = product;
                            const { name, arrayImage } = inforProduct;
                            const image = arrayImage[0].url;
                            orderItem.arrayProductShop.push({
                                name,
                                image,
                                quantity
                            });
                        });
                        orders.push(orderItem);
                    });
                    setLstOrder(orders);
                }
            }
        } catch(err){
            console.log(err);
        }
    },[]);

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
                            {
                                lstOrder.map(order => (
                                    <OrderItem
                                        key={uuidv4()}
                                        order={order}
                                        onClick={() => {
                                            router.push({
                                                pathname: '/order-details',
                                                query: { id: order.id },
                                            })
                                        }}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyOrder;

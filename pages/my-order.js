import Head from "next/head";
import SlideNav from "./../components/SlideNav";
import { OrderItem } from "../components/OrderItem";
import { useEffect, useState } from "react";
import api from "../utils/backend-api.utils";

function MyOrder(params) {
    const [lstOrder, setLstOrder] = useState([]);
    const [products, setProducts] = useState([]);
     
    useEffect(async() =>{
        try{
            const res = await api.order.getOrder();
            if (res.status==200){
                if (res.data.code === 200){
                    let orders = [];
                    res.data.result.map(x => {
                        let order = {
                            contact: "",
                            lstProduct: []
                        }
                        order.contact = x.inforOrder.contact || "";
                        let listProduct = [];
                        x.inforOrder.arrayProductShop.forEach(x=>{
                            let product = {
                                image: "",
                                name: "",
                                quantity: 0,
                                id: ""
                            };
                            product.name = x.inforProduct.name || "";
                            product.image = x.inforProduct.arrayImage[0].url || "";
                            product.quantity = x.quantity || 0;
                            product.id = x.inforProduct._id || "";
                            listProduct.push(product);
                        });
                        order.lstProduct = listProduct;
                        orders.push(order);
                    })
                    setLstOrder(orders);
                }
            }
        } catch(err){
            console.log(err);
        }
    },[]);

    console.log(lstOrder);

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

                            {/* <OrderItem />
                            <OrderItem /> */}
                            {
                                lstOrder.map(order => (
                                    <OrderItem phone={order.contact} arrayProduct={order.lstProduct} />
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

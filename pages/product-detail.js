import Head from 'next/head';
import { Galleria } from 'primereact/galleria';
import { useContext, useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { DataContext } from '../store/GlobalState';
import api from '../utils/backend-api.utils';
import * as common from './../utils/common';
import { Image } from 'cloudinary-react';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import RestorePageOutlinedIcon from '@material-ui/icons/RestorePageOutlined';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import cookie from "cookie";
import Router from "next/router";
import Moment from 'moment';
Moment.locale('en');
import { InputNumber } from 'primereact/inputnumber';

const ProductDetail = ({ product, productRecommend, comments, attributes }) => {
    const { state, dispatch, toast, swal } = useContext(DataContext);
    const { cart, auth } = state;
    const [showReport, setShowReport] = useState(false);
    const [showRequire, setShowRequire] = useState(false);
    const [reason, setReason] = useState("");
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [information] = useState(() => {
        if (typeof product.information === "string") {
            return JSON.parse(product.information);
        }
        return product.information;
    });
    const [bodyRate, setBodyRate] = useState({
        productId: product.id,
        rate: 0,
        comment: ""
    });
    const [listComments, setListComments] = useState(comments);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    const itemTemplate = (item) => {
        return (
            <Image
                publicId={item.id}
                version={getVersionImage(item.url)}
                cloud_name="ktant"
                secure="true"
                alt="Image Product"
                height="400"
                width="400"
                crop="fill"
                loading="lazy"
            >
            </Image>
        );
    }

    const thumbnailTemplate = (item) => {
        return (
            <Image
                publicId={item.id}
                version={getVersionImage(item.url)}
                cloud_name="ktant"
                secure="true"
                alt="Image Product"
                height="70"
                width="80"
                crop="fill"
                loading="lazy"
            >
            </Image>
        );
    }

    const addToCart = async () => {

        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

        try {
            let cartTemp = cart;
            if (cart.length > 0) {
                let sameProduct = cartTemp.filter(x => x.productId === product.id);
                if (sameProduct.length === 1) {
                    if (product.countProduct === 0 || product.countProduct === sameProduct[0].quantity) {
                        swal.close();
                        common.ToastPrime('L???i', 'S???n ph???m kh??ng ????? s??? l?????ng.', 'error', toast);
                        return false;
                    } else {
                        sameProduct[0].quantity++;
                        let body = {
                            cartItems: [
                                {
                                    inforProduct: sameProduct[0].productId,
                                    quantity: sameProduct[0].quantity,
                                    onProduct: "Product"
                                }
                            ]
                        }
                        const res = await api.cart.postCart(body);
                        swal.close();
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.ToastPrime('Th??nh c??ng', 'Th??m v??o gi??? h??ng th??nh c??ng.', 'success', toast);
                                dispatch({
                                    type: 'ADD_CART', payload: cartTemp
                                });
                                return true;
                            } else {
                                let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                                common.ToastPrime('L???i', message, 'error', toast);
                                return false;
                            }
                        }
                    }
                } else {
                    if (product.countProduct === 0) {
                        swal.close();
                        common.ToastPrime('L???i', 'S???n ph???m kh??ng ????? s??? l?????ng.', 'error', toast);
                        return false;
                    }

                    let body = {
                        cartItems: [
                            {
                                inforProduct: product.id,
                                quantity: 1,
                                onProduct: "Product"
                            }
                        ]
                    }
                    const res = await api.cart.postCart(body);
                    swal.close();
                    if (res.status === 200) {
                        if (res.data.code === 200) {
                            cartTemp.push({
                                productName: product.name,
                                productId: product.id,
                                productImage: product.image,
                                price: product.price,
                                quantity: 1
                            })
                            dispatch({
                                type: 'ADD_CART', payload: cartTemp
                            });
                            common.ToastPrime('Th??nh c??ng', 'Th??m v??o gi??? h??ng th??nh c??ng.', 'success', toast);
                            return true;
                        } else {
                            let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                            common.ToastPrime('L???i', message, 'error', toast);
                            return false;
                        }
                    }
                }
            } else {
                if (product.countProduct === 0) {
                    swal.close();
                    common.ToastPrime('L???i', 'S???n ph???m kh??ng ????? s??? l?????ng.', 'error', toast);
                    return false;
                }

                let body = {
                    cartItems: [
                        {
                            inforProduct: product.id,
                            quantity: 1,
                            onProduct: "Product"
                        }
                    ]
                }
                const res = await api.cart.postCart(body);
                swal.close();
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        cartTemp.push({
                            productName: product.name,
                            productId: product.id,
                            productImage: product.image,
                            price: product.price,
                            quantity: 1
                        })
                        dispatch({
                            type: 'ADD_CART', payload: cartTemp
                        });
                        common.ToastPrime('Th??nh c??ng', 'Th??m v??o gi??? h??ng th??nh c??ng.', 'success', toast);
                        return true;
                    } else {
                        let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                        common.ToastPrime('L???i', message, 'error', toast);
                        return false;
                    }
                }
            }
        } catch (e) {
            swal.close();
            common.ToastPrime('L???i', e.message || e, 'error', toast);
            return false;
        }
    }

    const sendRateComment = async () => {
        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

        let body = {
            ...bodyRate,
            rate: bodyRate.rate * 20
        }
        try {
            const res = await api.product.createComment(body);
            if (res.data.code === 200) {
                common.ToastPrime('Th??nh c??ng', 'G????i tha??nh c??ng.', 'success', toast);
                setBodyRate((prevStates) => ({
                    ...prevStates,
                    rate: 0,
                    comment: ""
                }));
                getListComment();
            } else {
                common.ToastPrime('L???i', response.data.message, 'error', toast);
            }
            swal.close();
        } catch (error) {
            swal.close();
            common.ToastPrime('L???i', error.message || error, 'error', toast);
        }
    }

    const getListComment = async () => {
        const res2 = await api.product.getComment(product.id);
        setListComments(res2.data.result);
    }

    const checkWarranty = (time) => {
        return (new Date(time)).getTime() > (new Date()).getTime();
    }

    const getDiffTime = (time) => {
        const date = (new Date(time)).getTime();
        const currentDate = (new Date()).getTime();
        return Math.ceil((Math.abs(currentDate - date)) / (24 * 3600 * 1000));
    }

    const renderFooter = () => {
        return (
            <div>
                <Button
                    label="Hu??y bo??"
                    icon="pi pi-times"
                    onClick={() => setShowReport(false)}
                    className="p-button-text btn-danger"
                    style={{  }}
                />
                <Button label="G????i" icon="pi pi-check" onClick={() => sendReport()} autoFocus className="btn-primary" />
            </div>
        );
    }

    const renderFooterRequire = () => {
        return (
            <div>
                <Button
                    label="Hu??y bo??"
                    icon="pi pi-times"
                    onClick={() => setShowRequire(false)}
                    className="p-button-text btn-danger"
                    style={{  }}
                />
                <Button label="G????i" icon="pi pi-check" onClick={() => requirePrice()} autoFocus className="btn-primary" />
            </div>
        );
    }

    const requirePrice = async () => {
        try{
            let bodyRequire = {
                productId: product.id,
                priceSuggest: price
            };
            const res = await api.buyer.postPriceRequire(bodyRequire);
            if (res.status === 200){
                if (res.data.code === 200){
                    setShowRequire(false);
                    common.Toast("G???i y??u c???u th??nh c??ng", "success");
                    setPrice("");
                }
                else {
                    common.Toast("Vui l??ng ??i???n ?????y ????? th??ng tin", "error");
                }
            }
        } catch(err){
            console.log(err);
        }
    }

    const sendReport = async () => {
        try{
            let bodyReport = {
                title: title,
                content: reason,
                type: "Product",
                idReport: product.id
            };
            const res = await api.report.createReport(bodyReport);
            if (res.status === 200){
                if (res.data.code === 200){
                    setShowReport(false);
                    common.Toast("T??? c??o th??nh c??ng", "success");
                    setTitle("");
                    setReason("");
                }
                else {
                    common.Toast("Vui l??ng ??i???n ?????y ????? th??ng tin", "error");
                }
            }
        } catch(err){
            console.log(err);
        }
    }

    const buyNow = async () => {
        const response = await addToCart();
        if (response === true) {
            const cartCheckout = [product.id];
            Router.push({
                pathname: '/checkout',
                query: { productCheckouts: cartCheckout }
            }, null, { shallow: true })
        }
    }

    return (
        <div className="product-detail-container">
            <Head>
                <title>Chi ti???t s???n ph???m</title>
            </Head>
            <div className="product-detail-content">
                <div className="container">
                    <div className="shop-info-container">
                        <div className="shop-info-left">
                            <img src="/static/avatar2.png" alt="Avatar" />
                            <div>
                                <div className="shop-name">
                                    {product.shopName}
                                </div>
                                <div className="shop-contact">
                                    Li??n h???: {product.phone}
                                </div>
                                <div className="shop-action">
                                    <button
                                        className="btn btn-follow"
                                        onClick={() => {
                                            const newConversation = {
                                                toUserId: product.sellerInfor._id,
                                                avatar: "/static/avatar-person.svg",
                                                alt: "avatar",
                                                title: product.sellerInfor.nameOwner,
                                                subtitle: "",
                                                dateString: "V????a m????i",
                                                unread: 0,
                                                className: ""
                                            };
                                            dispatch({ type: 'ADD_NEW_CONVERSATION', payload: newConversation });
                                            dispatch({ type: 'ACTIVE_CHAT_USER', payload: product.sellerInfor._id });
                                            dispatch({ type: 'OPEN_CHAT', payload: true })
                                        }}
                                    >
                                        Nh????n tin
                                    </button>
                                    <button className="btn btn-view-shop">Xem shop</button>
                                </div>
                            </div>
                        </div>
                        <div className="shop-info-right">
                            <div className="col-left">
                                <div className="col-left-row star">
                                    <u className="mr-3 mt-1">{(product.rateMedium / 20).toFixed(2)}</u>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                </div>
                                <div className="col-left-row">
                                    <div>S??? l?????ng ????nh gi??: <u>{product.rateCount}</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>S??? l?????ng s???n ph???m ???? ????ng: <u>{product.countProductCreate}</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>S??? l?????ng s???n ph???m ???? b??n: <u>3</u></div>
                                </div>
                            </div>
                            <div className="col-right">
                                <div className="col-right-row"></div>
                                <div className="col-right-row">
                                    <div>Tham gia: <u>{getDiffTime(product.sellerInfor.timeAccept)} ng??y tr?????c</u></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="product-info-container">
                        <div className="product-info-image">
                            <Galleria id={product.id} value={product.arrayImage} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                        </div>
                        <div className="product-info-detail">
                            <div className="detail-name">
                                {product.name}
                            </div>
                            <div className="detail-price d-flex align-items-center">
                                <LocalOfferIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>{common.numberWithCommas(product.price)} VN??</div>
                                <Button className="require-price" onClick={() => setShowRequire(true)}>Y??u c???u gi??</Button>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <VerifiedUserOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>SKU: {product.sku}</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <BeenhereOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>
                                    <span>Ba??o ha??nh: </span>
                                    <span>
                                        {
                                            checkWarranty(product.restWarrantyTime)
                                                ? (
                                                    <span className="detail-warranty-active">
                                                        V????n co??n ({getDiffTime(product.restWarrantyTime)} nga??y)
                                                    </span>
                                                ) : (
                                                    <span className="detail-warranty-expired">
                                                        H????t ha??n
                                                    </span>
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <i className="pi pi-tags mr-2" style={{ color: "#0795df", fontSize: "1.2em" }}></i>
                                <div>Th????ng hi????u: {product.brand}</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <i className="pi pi-tag mr-2" style={{ color: "#0795df", fontSize: "1.2em" }}></i>
                                <div>Gia?? mua ban ??????u: {common.numberWithCommas(product.oldPrice)} VN??</div>
                            </div>
                            <div className="detail-primary d-flex">
                                <LocalShippingOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div className="">
                                    <span className="mr-2">Ph????ng th????c v????n chuy????n:</span>
                                    <div>
                                        {
                                            product.arrayDelivery.map((delivery) => {
                                                return (
                                                    delivery === "ghn"
                                                        ? (
                                                            <div className="d-flex align-items-center" key={delivery}>
                                                                <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                <div style={{ minWidth: 180 }}>Giao ha??ng nhanh</div>
                                                                <img src="/static/logo-ghn.png" alt="logo" width="100" height="55" className="mr-2" />
                                                            </div>
                                                        ) : delivery === "ghtk"
                                                            ? (
                                                                <div className="d-flex align-items-center" key={delivery}>
                                                                    <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                    <div style={{ minWidth: 180 }}>Giao ha??ng ti????t ki????m</div>
                                                                    <img src="/static/ghtk.png" alt="logo" width="100" height="55" className="mr-2" />
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex align-items-center" key={delivery}>
                                                                    <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                    <div>Nh????n ha??ng ta??i shop</div>
                                                                </div>
                                                            )
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <AlarmOnIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>Nga??y ????ng: {Moment(new Date(product.timePost)).format("DD/MM/yyyy - HH:mm:ss A")}</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <RestorePageOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>S???? l??????ng co??n la??i: {product.countProduct} sa??n ph????m</div>
                            </div>
                            {
                                product.note
                                && (
                                    <div className="detail-row">
                                        L??u ??: <span>{product.note}</span>
                                    </div>
                                )
                            }
                            <div className="detail-action">
                                <button className="btn button-add-to-cart" onClick={addToCart}><i className="pi pi-shopping-cart"></i> Th??m v??o gi??? h??ng</button>
                                <button className="btn button-buy-now" onClick={buyNow}>Mua ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="product-details-container">
                        <div className="report" onClick={() => setShowReport(true)}>
                            <img src="/static/flag-report.svg" width="20" height="20" />
                            <span>T???? ca??o ng??????i ba??n</span>
                        </div>
                        <div className="title">
                            Th??ng tin chi ti???t
                        </div>
                        <div>
                            <span>
                                {`M?? ta??: `}
                            </span>
                            <span>
                                {product.description}
                            </span>
                        </div>
                        {
                            attributes.map(x => {
                                return (
                                    <div key={x.key}>
                                        <span>{`${x.name}: `}</span>
                                        {
                                            information[x.key] &&
                                            <span>{information[x.key]}</span>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="comment-container">
                        <div className="title">
                            ????nh gi?? s???n ph???m
                        </div>

                        <div className="comment-row">
                            <div className="comment-row_img">
                                <img
                                    src={
                                        Object.keys(auth).length
                                            ? auth.user.imageUrl ? (auth.user.imageUrl.url || "/static/avatar2.png") : "/static/avatar2.png"
                                            : "/static/avatar2.png"
                                    }
                                    alt="Avatar"
                                />
                            </div>
                            <div className="comment-row_content">
                                <div className="content_name">
                                    {Object.keys(auth).length ? auth.user.name : ""}
                                </div>
                                <div>
                                    <Rating
                                        name="customized-empty"
                                        value={bodyRate.rate}
                                        onChange={(e) => {
                                            setBodyRate((prevStates) => ({
                                                ...prevStates,
                                                rate: Number(e.target.value)
                                            }))
                                        }}
                                        precision={0.5}
                                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                        size="large"
                                    />
                                </div>
                                <InputTextarea
                                    className="w-100"
                                    style={{ maxWidth: "500px" }}
                                    rows={5}
                                    value={bodyRate.comment}
                                    onChange={(e) => {
                                        setBodyRate((prevStates) => ({
                                            ...prevStates,
                                            comment: e.target.value
                                        }))
                                    }}
                                    placeholder="Nh????p nh????n xe??t..."
                                />
                                <div className="row justify-content-end mx-0" style={{ maxWidth: "500px" }}>
                                    <button className="btn btn--send-comment" type="submit" onClick={sendRateComment}>
                                        G????i ??i
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            listComments.map((comment, index) => (
                                <div className="comment-row" key={index}>
                                    <div className="comment-row_img">
                                        <img src={comment.buyerRate.imageUrl ? comment.buyerRate.imageUrl.url : "/static/avatar2.png"} alt="Avatar" />
                                    </div>
                                    <div className="comment-row_content">
                                        <div className="content_name">
                                            {comment.buyerRate.name}
                                        </div>
                                        <Rating
                                            disabled={true}
                                            name="customized-empty"
                                            defaultValue={comment.rate / 20}
                                            precision={0.5}
                                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                            size="large"
                                        />
                                        <div className="dialog-box">
                                            <div className="dialog-box__body">
                                                <span className="tip tip-up"></span>
                                                <div className="message">
                                                    <span>{comment.comment}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="comment-time">
                                            {Moment(new Date(comment.createTime)).format("DD/MM/yyyy HH:mm:ss A")}
                                        </div>    
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                    {/* <div className="product-recommend-container">
                        <div className="title">
                            S???n ph???m t????ng t???
                        </div>
                        <div className="row">
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"??i???n tho???i Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"??i???n tho???i Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"??i???n tho???i Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"??i???n tho???i Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <button className="btn button-see-more">
                                <div>Xem th??m</div>
                                <i className="pi pi-angle-right"></i>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>

            <Dialog header="Ly?? do" visible={showReport} onHide={() => setShowReport(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter()}>
                <input type="text" className="form-control" id="title" placeholder="Ti??u ?????" name="title" value={title} onChange={(e) => setTitle(e.target.value)} style={{marginTop:'0'}}/>
                <textarea
                    rows="5"
                    className="form-control w-100 mt-1"
                    onChange={(e) => setReason(e.target.value)}
                    value={reason}
                />
            </Dialog>

            <Dialog header="Y??u c???u gi?? v???i ng?????i b??n" visible={showRequire} onHide={() => setShowRequire(false)} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooterRequire()}>
                <InputNumber id="price" placeholder="Gi?? y??u c???u" name="price" value={price} onValueChange={(e) =>setPrice(e.target.value)} style={{marginTop:'0', width:'100%'}}
                />
            </Dialog>
        </div>
    )
}

function newFunction(delivery) {
    return {
        delivery
    } === "ghn";
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const { id } = query;
    let token = "";
    let isSignin = false;
    let listAttribute = [];

    // check token
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        token = cookie.parse(cookies).access_token;
        isSignin = token ? true : false;
    }

    let productDetail = {
        id: "",
        brand: "",
        sku: "",
        restWarrantyTime: "",
        description: "",
        note: "",
        arrayImage: [],
        price: "",
        name: "",
        shopName: "",
        phone: "",
        countProduct: 0,
        arrayDelivery: []
    };
    let comments = []
    try {
        const res = await api.buyer.getDetailProduct(id);
        if (res.status === 200) {
            if (res.data.code === 200) {
                const data = res.data.result;
                productDetail.id = id;
                productDetail.categoryId = data.categoryInfor._id;
                productDetail.categoryName = data.categoryInfor.name;
                productDetail.arrayImage = data.arrayImage;
                productDetail.name = data.name || "";
                productDetail.description = data.description || "";
                productDetail.sku = data.sku || "";
                productDetail.restWarrantyTime = data.restWarrantyTime || "";
                productDetail.brand = data.brand.name || "";
                productDetail.note = data.note || "";
                productDetail.price = data.price || "";
                productDetail.shopName = data.sellerInfor.nameShop || "";
                productDetail.phone = data.sellerInfor.phone || "";
                productDetail.countProduct = data.countProduct || 0;
                productDetail.information = data.information;
                data.deliverArray.forEach((delivery) => {
                    productDetail.arrayDelivery.push(Object.keys(delivery)[0]);
                });
                productDetail.oldPrice = data.oldPrice;
                productDetail.timePost = data.timePost;
                productDetail.countProduct = data.countProduct;
                productDetail.sellerInfor = data.sellerInfor;
                productDetail.rateCount = data.rateCount;
                productDetail.countProductCreate = data.countProductCreate;
                productDetail.rateMedium = data.rateMedium;
            }
        }

        const res2 = await api.product.getComment(id);
        comments = res2.data.result;

        const resAttr = await api.category.getDetails(productDetail.categoryId);
        if (resAttr.status === 200) {
            if (resAttr.data.code === 200) {
                let listKey = Object.keys(resAttr.data.result.information);
                common.ListProperties.forEach(x => {
                    if (listKey.includes(x.key)) {
                        listAttribute.push(x);
                    }
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
    // call api get product have same brand

    return {
        props: {
            product: productDetail,
            productRecommend: [],
            comments,
            attributes: listAttribute
        }
    }
}

export default ProductDetail;
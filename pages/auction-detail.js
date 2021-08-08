import Head from 'next/head';
import { Galleria } from 'primereact/galleria';
import AuctionCard from './../components/AuctionCard';
import api from '../utils/backend-api.utils';
import { DataContext } from '../store/GlobalState';
import { useContext, useEffect, useState } from 'react';
import * as common from "../utils/common";
import cookie from "cookie";
import Cookie from 'js-cookie';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';
import VerifiedUserOutlinedIcon from '@material-ui/icons/VerifiedUserOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import _ from "lodash";
import { uuid } from 'uuidv4';
import Moment from 'moment';
Moment.locale('en');

const AuctionDetail = ({ product, logBidUser, currentPriceAuction, attributes }) => {
    const [timeCountDown, setTimeCountDown] = useState(0);
    const [isSell, setIsSell] = useState(product.selled);
    const [currentPrice, setCurrentPrice] = useState(currentPriceAuction || product.price);
    const [priceAuction, setPriceAuction] = useState(currentPriceAuction);
    const [newBid, setNewBid] = useState(null);
    const [information] = useState(() => {
        if (typeof product.information === "string") {
            return JSON.parse(product.information);
        }
        return product.information;
    });
    const { state, socket, toast } = useContext(DataContext);
    const [logAuction, setLogAuction] = useState(logBidUser);
    const { auth } = state;

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

    const itemTemplate = (item) => {
        return <img src={item.url} alt={'item'} style={{ width: "400px", height: "400px", display: 'block', objectFit: 'contain' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.url} alt={'thumbnail'} style={{ display: 'block', width: '80px', height: '60px' }} />;
    }

    useEffect(() => {
        if (socket) {
            socket.on("countUser", (res) => {
                console.log(res, "countUser");
            });
            socket.on("countDownRoom", (res) => {
                console.log("countDownRoom", res);
                setTimeCountDown(res.timeDown);
                if (res.timeDown === 0 && logAuction.length > 0) {
                    setIsSell(true);
                    socket.off('countDownRoom');
                    common.Notification("Thông báo", "Phiên đấu giá đã kết thúc.", "success");
                }
            });
            socket.on("infonewBid", (res) => {
                setNewBid(res);
            });
            socket.on("reply_price", (res) => {
                console.log(res, "price");
            });
            return () => {
                socket.off('countUser');
                socket.off('countDownRoom');
                socket.off('reply_price');
                socket.off('infonewBid');
                socket.emit("leaveRoom", {
                    bidId: product.id,
                    userId: auth.user ? auth.user.userId : undefined,
                });
                socket.off('leaveRoom');
            }
        }
    }, [socket]);

    useEffect(() => {
        if (newBid) {
            let newLogAuction = logAuction.concat([{
                ...newBid,
                uuid: uuid()
            }]);
            console.log(newLogAuction);
            newLogAuction.sort((a, b) => b.priceBid - a.priceBid);
            setLogAuction(newLogAuction);
            setCurrentPrice(newLogAuction[0].priceBid);
        }
    }, [newBid]);

    useEffect(() => {
        console.log(logAuction);
    }, [logAuction]);

    useEffect(() => {
        if (socket) {
            let token = Cookie.get('access_token');
            if (token) {
                if (!_.isEmpty(auth)) {
                    socket.emit("joinRoom", {
                        bidId: product.id,
                        userId: auth.user.userId,
                    });
                }
            } else {
                socket.emit("joinRoom", {
                    bidId: product.id,
                    userId: undefined
                });
            }
            return () => {
                socket.emit("leaveRoom", {
                    bidId: product.id,
                    userId: auth.user ? auth.user.userId : undefined,
                });
                socket.off('leaveRoom');
            }
        }
    }, [auth, socket]);

    const increasePrice = () => {
        let price = priceAuction;
        price += 10000;
        setPriceAuction(price);
    }

    const decreasePrice = () => {
        let price = priceAuction;
        price -= 10000;
        setPriceAuction(price);
    }

    function seconds2time(number) {
        let hours = Math.floor(number / 3600);
        let minutes = Math.floor((number - (hours * 3600)) / 60);
        let seconds = number - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return { hours, minutes, seconds };
    }

    const checkWarranty = (time) => {
        return (new Date(time)).getTime() > (new Date()).getTime();
    }

    const getDiffTime = (time) => {
        const date = (new Date(time)).getTime();
        const currentDate = (new Date()).getTime();
        return Math.ceil((date - currentDate) / (24 * 3600 * 1000));
    }

    const createPrice = () => {
        if (Object.keys(auth).length > 0 && socket) {
            if (priceAuction <= currentPrice) {
                common.ToastPrime("Cảnh báo",
                    `Giá của bạn đang thấp hơn hoặc bằng giá hiện tại: ${common.numberWithCommas(currentPrice)}`,
                    "warn",
                    toast
                );
                return;
            }
            socket.emit("createPrice", {
                userId: auth.user.userId,
                price: priceAuction,
                bidId: product.id
            });

            common.ToastPrime("Thành công",
                `Đấu giá thành công`,
                "success",
                toast
            );
        }
    }

    return (
        <div className="auction-detail-container">
            <Head>
                <title>Đấu giá sản phẩm</title>
            </Head>
            <div className="auction-detail-content">
                <div className="container">
                    <div className="shop-info-container">
                        <div className="shop-info-left">
                            <img src="/static/avatar2.png" alt="Avatar" />
                            <div>
                                <div className="shop-name">
                                    {product.shopName}
                                </div>
                                <div className="shop-contact">
                                    Liên hệ: {product.phone}
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
                                                dateString: "Vừa mới",
                                                unread: 0,
                                                className: ""
                                            };
                                            dispatch({ type: 'ADD_NEW_CONVERSATION', payload: newConversation });
                                            dispatch({ type: 'ACTIVE_CHAT_USER', payload: product.sellerInfor._id });
                                            dispatch({ type: 'OPEN_CHAT', payload: true })
                                        }}
                                    >
                                        Nhắn tin
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
                                    <div>Số lượng đánh giá: <u>{product.rateCount}</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>Số lượng sản phẩm đã đăng: <u>{product.countProductCreate}</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>Số lượng sản phẩm đã bán: <u>3</u></div>
                                </div>
                            </div>
                            <div className="col-right">
                                <div className="col-right-row"></div>
                                <div className="col-right-row">
                                    <div>Tham gia: <u>{getDiffTime(product.restWarrantyTime)} ngày trước</u></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="auction-info-container">
                        <div className="auction-info-image">
                            <Galleria id={auction.id} value={auction.arrayImage} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                        </div>
                        <div className="auction-info-detail">
                            <div className="detail-name">
                                {auction.name}
                            </div>
                            <div className="detail-time">
                                {seconds2time(timeCountDown)}
                            </div>
                            <div className="detail-starting-price">
                                Giá khởi điểm:<span> {new Intl.NumberFormat().format(auction.price)} VND</span>
                            </div>
                            <div className="detail-current-price">
                                Giá thầu hiện tại: <span>{new Intl.NumberFormat().format(6500000)} VND</span>
                            </div>
                            <div className="detail-winner">
                                Người thắng: <span>Phạm Văn Việt</span>
                            </div>
                            <div className="detail-action">
                                <div className="title">Đấu giá ngay</div>
                                <div className="action-price">
                                    <div>
                                        <button className="btn btn-change-price"
                                            onClick={decreasePrice}
                                        >
                                            -
                                        </button>
                                        <div className="price-current px-2">
                                            {new Intl.NumberFormat().format(currentPrice)} VND
                                        </div>
                                        <button className="btn btn-change-price"
                                            onClick={increasePrice}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button className="btn btn-auction">
                                        <img src="/static/hammer.svg" alt="icon-hammer" className="mr-2" />
                                        Đấu giá
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="auction-info-container">
                        <div className="auction-info-image">
                            <Galleria id={product.id} value={product.arrayImage} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                        </div>
                        <div className="auction-info-detail">
                            <div className="detail-name">
                                {product.name}
                            </div>
                            <div className="detail-price d-flex align-items-center">
                                <LocalOfferIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>Giá khởi điểm: {common.numberWithCommas(product.price)} VNĐ</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <VerifiedUserOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>SKU: {product.sku}</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <BeenhereOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div>
                                    <span>Bảo hành: </span>
                                    <span>
                                        {
                                            checkWarranty(product.restWarrantyTime)
                                                ? (
                                                    <span className="detail-warranty-active">
                                                        Vẫn còn ({getDiffTime(product.restWarrantyTime)} ngày)
                                                    </span>
                                                ) : (
                                                    <span className="detail-warranty-expired">
                                                        Hết hạn
                                                    </span>
                                                )
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <i className="pi pi-tags mr-2" style={{ color: "#0795df", fontSize: "1.2em" }}></i>
                                <div>Thương hiệu: {product.brand}</div>
                            </div>
                            <div className="detail-primary d-flex align-items-center">
                                <i className="pi pi-tag mr-2" style={{ color: "#0795df", fontSize: "1.2em" }}></i>
                                <div>Giá mua ban đầu: {common.numberWithCommas(product.oldPrice)} VNĐ</div>
                            </div>
                            <div className="detail-primary d-flex">
                                <LocalShippingOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                <div className="">
                                    <span className="mr-2">Phương thức vận chuyển:</span>
                                    <div>
                                        {
                                            product.arrayDelivery.map((delivery) => {
                                                return (
                                                    delivery === "ghn"
                                                        ? (
                                                            <div className="d-flex align-items-center" key={delivery}>
                                                                <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                <div style={{ minWidth: 180 }}>Giao hàng nhanh</div>
                                                                <img src="/static/logo-ghn.png" alt="logo" width="100" height="55" className="mr-2" />
                                                            </div>
                                                        ) : delivery === "ghtk"
                                                            ? (
                                                                <div className="d-flex align-items-center" key={delivery}>
                                                                    <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                    <div style={{ minWidth: 180 }}>Giao hàng tiết kiệm</div>
                                                                    <img src="/static/ghtk.png" alt="logo" width="100" height="55" className="mr-2" />
                                                                </div>
                                                            ) : (
                                                                <div className="d-flex align-items-center" key={delivery}>
                                                                    <CheckOutlinedIcon className="mr-2" style={{ color: "#0795df" }} />
                                                                    <div>Nhận hàng tại shop</div>
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
                                <div>Ngày đăng: {Moment(new Date(product.timePost)).format("DD/MM/yyyy - HH:mm:ss A")}</div>
                            </div>
                            {
                                product.note
                                && (
                                    <div className="detail-row">
                                        Lưu ý: <span>{product.note}</span>
                                    </div>
                                )
                            }

                            {
                                !isSell
                                    ? (
                                        <div className="auction-detail-action">
                                            <div className="auction-time">
                                                <span>{seconds2time(timeCountDown).hours}</span>
                                                <b>:</b>
                                                <span>{seconds2time(timeCountDown).minutes}</span>
                                                <b>:</b>
                                                <span>{seconds2time(timeCountDown).seconds}</span>
                                            </div>
                                            <div className="price-box">
                                                <button
                                                    onClick={decreasePrice}
                                                    disabled={_.isEmpty(auth) || _.isEmpty(auth.user) || isSell || timeCountDown === 0}
                                                >-</button>
                                                <div className="price-container">
                                                    {common.numberWithCommas(priceAuction)}
                                                </div>
                                                <button
                                                    className="button-right"
                                                    onClick={increasePrice}
                                                    disabled={_.isEmpty(auth) || _.isEmpty(auth.user) || isSell || timeCountDown === 0}
                                                >+</button>
                                            </div>
                                            <button
                                                className="btn-auction"
                                                onClick={createPrice}
                                                disabled={_.isEmpty(auth) || _.isEmpty(auth.user) || isSell || timeCountDown === 0}
                                            >
                                                <img src="/static/hammer.svg" alt="icon-hammer" className="mr-2" />
                                                Đặt giá thầu
                                            </button>
                                        </div>
                                    ) : (
                                        <h3 style={{ color: "#b90000", marginTop: "20px" }}>Đấu giá kết thúc</h3>
                                    )
                            }
                        </div>
                    </div>
                    <div className="auction-history-container">
                        <div className="title">
                            LỊCH SỬ ĐẤU GIÁ
                        </div>
                        <div className="auction-history-table">
                            <table className="table table-bordered table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Người đấu giá</th>
                                        <th scope="col">Giá đấu</th>
                                        <th scope="col">Thời gian đấu giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        logAuction.map((log, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{log.name}</td>
                                                <td>{common.numberWithCommas(log.priceBid)} VND</td>
                                                <td>{Moment(new Date(log.createTime)).format("DD/MM/yyyy HH:mm:ss A")}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="auction-details-container">
                        <div className="auction-details-container__title">
                            Chi tiết sản phẩm
                        </div>
                        <div className="auction-details-container__content">
                            {
                                attributes.map(x => {
                                    return (
                                        <div key={x.key} className="content-row">
                                            <span className="label">{`${x.name}: `}</span>
                                            {
                                                information[x.key] &&
                                                <span>{information[x.key]}</span>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="auction-details-container__title">
                            Mô tả sản phẩm
                        </div>
                        <div className="auction-details-container__content">
                            <span>{product.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const { id } = query;
    let isSignin = false;
    const logBidUser = [];
    let currentPrice = 0;
    let listAttribute = [];

    // check token
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
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

    try {
        const res = await api.auction.getDetail(id);
        console.log(res);
        if (res.status === 200) {
            if (res.data.code === 200) {
                const { logBid } = res.data;
                const data = res.data.result;
                productDetail.id = id;
                productDetail.selled = data.selled;
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
                productDetail.rateCount = data.rateCount;
                productDetail.countProductCreate = data.countProductCreate;
                productDetail.rateMedium = data.rateMedium;
                logBid.forEach(element => {
                    const user = {};
                    user.name = element.inforBuyer.name;
                    user.priceBid = element.priceBid;
                    user.createTime = element.createTime;
                    logBidUser.push(user);
                });
                if (logBidUser.length > 1) {
                    logBidUser.sort((a, b) => b.priceBid - a.priceBid);
                }
                currentPrice = logBidUser[0] ? logBidUser[0].priceBid : productDetail.price;
            }
        }

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

    return {
        props: {
            product: productDetail,
            shop: {},
            auctionRecommend: [],
            logBidUser,
            currentPriceAuction: currentPrice,
            attributes: listAttribute
        }
    }
}

export default AuctionDetail;
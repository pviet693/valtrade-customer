import Head from 'next/head';
import { Galleria } from 'primereact/galleria';
import AuctionCard from './../components/AuctionCard';
import api from '../utils/backend-api.utils';
import { DataContext } from '../store/GlobalState';
import { useContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
// import io from 'socket.io-client/dist/socket.io';

const AuctionDetail = ({ auction }) => {

    const [timeCountDown, setTimeCountDown] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(auction.price);
    const { state, dispatch, toast, swal, socket } = useContext(DataContext);
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
        return <img src={item} alt={'item'} style={{ width: '100%', display: 'block', objectFit: 'contain' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item} alt={'thumbnail'} style={{ display: 'block', width: '80px', height: '60px' }} />;
    }

    const navigateToDetailAuction = (auction) => {
        Router.push({
            pathname: '/auction-detail',
            query: { id: auction.id }
        })
    }

    useEffect(() => {
        if (Object.keys(auth).length > 0 && socket) {
            socket.emit("createPrice", {
                userId: auth.user.userId,
                price: currentPrice,
                bidId: auction.id
            })
        }
    }, [socket, currentPrice, auth]);

    useEffect(() => {
        if (socket) {
            console.log("123");
            socket.on("countUser", (res) => {
                console.log(res);
            });
            socket.on("countDownRoom", (res) => {
                console.log("countDownRoom", res);
                setTimeCountDown(res.timeDown);
            });

            return () => {
                socket.off('countUser');
                socket.off('countDownRoom');
            }
        }
    }, [socket]);

    useEffect(() => {
        if (Object.keys(auth).length > 0 && socket) {
            console.log("abc");
            socket.emit("joinRoom", {
                bidId: auction.id,
                userId: auth.user.userId,
            });
        }
    }, [auth]);

    const increasePrice = () => {
        let price = currentPrice;
        price++;
        setCurrentPrice(price);
    }

    const decreasePrice = () => {
        let price = currentPrice;
        price--;
        setCurrentPrice(price);
    }

    function seconds2time(number) {
        let hours = Math.floor(number / 3600);
        let minutes = Math.floor((number - (hours * 3600)) / 60);
        let seconds = number - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
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
                                    Shop ABC
                                </div>
                                <div className="shop-contact">
                                    Liên hệ: 0968 250 823
                                </div>
                                <div className="shop-action">
                                    <button className="btn btn-follow">Theo dõi</button>
                                    <button className="btn btn-view-shop">Xem shop</button>
                                </div>
                            </div>
                        </div>
                        <div className="shop-info-right">
                            <div className="col-left">
                                <div className="col-left-row star">
                                    <u className="mr-3 mt-1">5.0</u>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                </div>
                                <div className="col-left-row">
                                    <div>Số lượng đánh giá: <u>100</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>Số lượng sản phẩm đã đăng: <u>100</u></div>
                                </div>
                                <div className="col-left-row">
                                    <div>Số lượng sản phẩm đã bán: <u>100</u></div>
                                </div>
                            </div>
                            <div className="col-right">
                                <div className="col-right-row"></div>
                                <div className="col-right-row">
                                    <div>Người theo dõi: <u>100</u></div>
                                </div>
                                <div className="col-right-row">
                                    <div>Tham gia: <u>1 ngày trước</u></div>
                                </div>
                                <div className="col-right-row">
                                    <div>Số phẩm vi phạm: <u>0</u></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="auction-info-container">
                        <div className="auction-info-image">
                            {/* <Galleria value={['/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg']} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} /> */}
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
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>ABC</td>
                                        <td>10000</td>
                                        <td>11/07/2021 - 21:02:23 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* <div className="comment-container">
                        <div className="title">
                            Đánh giá sản phẩm
                        </div>
                        <div className="comment-row">
                            <div className="comment-row_img">
                                <img src={'/static/avatar2.png'} alt="Avatar" />
                            </div>
                            <div className="comment-row_content">
                                <div className="content_name">
                                    Name ABC
                                </div>
                                <div className="content_star">
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                    <i className="pi pi-star"></i>
                                </div>
                                <div className="content_comment">
                                    Space for a comment of product
                                </div>
                                <div className="content_img">
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                    <img src={'/static/adidas-3-la.jpg'} alt="Image" />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="auction-recommend-container">
                        <div className="title">
                            Sản phẩm đấu giá tương tự
                        </div>
                        <div className="row">
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <AuctionCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                    participantsNumber={10} currentPrice={100000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <AuctionCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                    participantsNumber={10} currentPrice={100000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <AuctionCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                    participantsNumber={10} currentPrice={100000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <AuctionCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                    participantsNumber={10} currentPrice={100000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <button className="btn button-see-more">
                                <div>Xem thêm</div>
                                <i className="pi pi-angle-right"></i>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;
    const { id } = query;

    // call api get auction detail
    // call api get auction have same brand
    // call get info shop

    let auctionDetail = {
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
        countProduct: 0
    };

    try {
        const res = await api.auction.getDetail(id);
        if (res.status === 200) {
            if (res.data.code === 200) {
                const data = res.data.result;
                auctionDetail.id = id;
                auctionDetail.arrayImage = data.arrayImage.map(x => x.url);
                auctionDetail.name = data.name || "";
                auctionDetail.description = data.description || "";
                auctionDetail.sku = data.sku || "";
                auctionDetail.restWarrantyTime = data.restWarrantyTime || "";
                auctionDetail.brand = data.brand.name || "";
                auctionDetail.note = data.note || "";
                auctionDetail.price = data.price || "";
                auctionDetail.shopName = data.sellerInfor.nameShop || "";
                auctionDetail.phone = data.sellerInfor.phone || "";
                auctionDetail.countProduct = data.countProduct || 0;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            auction: auctionDetail,
            shop: {},
            auctionRecommend: []
        }
    }
}

export default AuctionDetail;
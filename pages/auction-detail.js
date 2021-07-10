import Head from 'next/head';
import { Galleria } from 'primereact/galleria';
import AuctionCard from './../components/AuctionCard';

const AuctionDetail = () => {

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
            query: { id: auction.id },
        })
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
                            <Galleria value={['/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg', '/static/adidas-3-la.jpg']} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                        </div>
                        <div className="auction-info-detail">
                            <div className="detail-name">
                                Laptop Asus X509JA i3 1005G1 Ram 4GB
                            </div>
                            <div className="detail-time">
                                00:03:29
                            </div>
                            <div className="detail-starting-price">
                                Giá khởi điểm:<span> {new Intl.NumberFormat().format(5000000)} VND</span>
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
                                        <button className="btn btn-change-price">
                                            -
                                        </button>
                                        <div className="price-current">
                                            {new Intl.NumberFormat().format(6550000)} VND
                                        </div>
                                        <button className="btn btn-change-price">
                                            +
                                        </button>
                                    </div>
                                    <button className="btn btn-auction"><img src="/static/hammer.svg" alt="hammer" />Đấu giá</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="comment-container">
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
                    </div>
                    <div className="auction-recommend-container">
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
                    </div>
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

    return {
        props: {
            auction: {},
            shop: {},
            auctionRecommend: []
        }
    }
}

export default AuctionDetail;
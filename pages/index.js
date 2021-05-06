import { useEffect } from "react";
import Head from 'next/head';
import Slider from "react-slick";
import Link from 'next/link';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';

const Home = (props) => {
    const { brands, categories, products } = props;

    const settings = {
        className: "text-center",
        centerMode: true,
        infinite: true,
        centerPadding: "0",
        slidesToShow: 4,
        speed: 1000
    };

    return (
        <>
            <Head>
                <title>Trang chủ</title>
            </Head>
            <div className="home">
                <div className="container">
                    <div className="home-content">
                        <div className="content-brand">
                            <div className="brand-header">
                                <div className="brand-title">
                                    Thương hiệu sản phẩm
                                </div>
                                <Link href="/">
                                    <a>
                                        <div className="see-more">
                                            <div>Xem thêm</div>
                                            <i className="pi pi-angle-right" aria-hidden></i>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                            <Slider {...settings}>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                                <div className="brand-card">
                                    <div className="img-brand-box">
                                        <img src="/static/adidas-3-la.jpg" />
                                    </div>
                                    <div className="brand-name">Adidas</div>
                                </div>
                            </Slider>
                        </div>
                        <div className="content-category">
                            <div className="category-header">
                                <div className="category-title">
                                    Danh mục sản phẩm
                                </div>
                                <Link href="/">
                                    <a>
                                        <div className="see-more">
                                            <div>Xem thêm</div>
                                            <i className="pi pi-angle-right" aria-hidden></i>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                            <div className="row">
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>

                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column">
                                    <div className="category-card">
                                        <div className="img-category-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="category-name">Adidas</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="content-product">
                            <div className="product-header">
                                <div className="product-title">
                                    Sản phẩm đăng mới nhất
                                </div>
                                <Link href="/product">
                                    <a>
                                        <div className="see-more">
                                            <div>Xem thêm</div>
                                            <i className="pi pi-angle-right" aria-hidden></i>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                            <div className="row px-3 justify-content-center">
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                    <div className="product-card">
                                        <div className="img-product-box">
                                            <img src="/static/adidas-3-la.jpg" />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-name">Giày adidas abc dsde jdkls iui</div>
                                            <div className="product-price">4.400.400 đ</div>
                                            <div className="product-brand">Thương hiệu: ABC</div>
                                            <div className="product-warranty">Tình trạng bảo hành: <span>Vẫn còn</span></div>
                                            <div className="product-sku">SKU: <span>SKU123</span></div>
                                            <div className="product-primary-price">Giá gốc: <span>5.000.000 đ</span></div>
                                        </div>
                                        <div className="product-action">
                                            <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                                            <button className="btn button-buy-now">Mua ngay</button>
                                            <button className="btn button-detail">Chi tiết</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    let brands = [];
    let categories = [];
    let products = [];

    try {
        // call api list brand
        // call api list category
        // call api list product
    } catch(error) {
        console.log(error);
    }

    return {
        props: { brands: brands, categories: categories, products: products },
    }
}

export default Home;
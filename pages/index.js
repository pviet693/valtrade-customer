import React, { useContext, useEffect, useState } from "react";
import Head from 'next/head';
import Link from 'next/link';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import Brand from "../components/Brand";
import ProductCard from "../components/ProductCard";
import AuctionCard from "../components/AuctionCard";
import Category from "../components/Category";
import cookie from "cookie";
import { useRouter } from 'next/router';
import { Carousel } from 'primereact/carousel';
import { DataContext } from "../store/GlobalState";
import Router from "next/router";

const Home = ({ brands, categories, products, auctions }) => {
    const router = useRouter();
    const { state, dispatch, toast, swal, socket } = useContext(DataContext);
    const [listCountDown, setListCountDown] = useState({});
    const [listCountUser, setListCountUser] = useState({});
    const [listPrice, setListPrice] = useState({});
    const { auth } = state;

    const size = 8;

    console.log(products);

    function seconds2Time(number) {
        let hours = Math.floor(number / 3600);
        let minutes = Math.floor((number - (hours * 3600)) / 60);
        let seconds = number - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    }

    const brandTemplate = (brand) => (
        <Brand name={brand.name} image={brand.image} imageId={brand.imageId} onClick={() => filterBrand(brand.id)} />
    );

    const filterBrand = (brandId) => {
        router.push({
            pathname: '/product',
            query: {
                brand: brandId
            }
        }, null, { shallow: true });
    }

    const product = products.slice(0, size).map((x, index) =>{
        <div key={x.id} className="col-md-3 d-flex align-items-center flex-column mb-4">
            <ProductCard id={x.id} name={x.name} image={x.image} imageId={x.imageId} countProduct={x.countProduct}
                price={x.price} brand={x.brand.name} sku={x.sku} oldPrice={x.oldPrice} onClick={() => navigateToDetailProduct(x)} />
        </div>
    });

    const auction = auctions.map((x, index) =>
        <div key={x.id} className="col-md-3 d-flex align-items-center flex-column mb-4">
            <AuctionCard name={x.name} image={x.image} time={seconds2Time(listCountDown[x.id] || 0)} winner={listPrice[x.id] ? listPrice[x.id].userName : ""} imageId={x.imageId}
                participantsNumber={listCountUser[x.id] || 0} currentPrice={listPrice[x.id] ? listPrice[x.id].price : x.price} onClick={() => navigateToDetailAuction(x)} />
        </div>
    );

    const category = categories.slice(0, size).map((x, index) => (
        <Category key={index.toString()} name={x.name} image={x.image} imageId={x.imageId} onClick={() => filterCategory(x.id)} />
    ));

    const filterCategory = (id) => {
        router.push({
            pathname: '/product',
            query: {
                categoryId: id
            }
        }, null, { shallow: true });
    }

    const navigateToDetailProduct = (product) => {
        Router.push({
            pathname: '/product-detail',
            query: { id: product.id },
        }, null, { shallow: true });
    }

    const navigateToDetailAuction = (auction) => {
        Router.push({
            pathname: '/auction-detail',
            query: { id: auction.id },
        }, null, { shallow: true });
    }

    useEffect(() => {
        if (socket) {
            socket.on("countListUser", (res) => {
                setListCountUser(res);
            });
            socket.on("listPrice", (res) => {
                setListPrice(res);
            });
            socket.on("listCountDown", (res) => {
                setListCountDown(res);
            });
            return () => {
                socket.off('countListUser');
                socket.off('listPrice');
                socket.off('listCountDown');
            }
        }
    }, [socket]);

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
                            </div>
                            <Carousel
                                value={brands}
                                itemTemplate={brandTemplate}
                                numVisible={4}
                                numScroll={2}
                                autoplayInterval={3000}
                            />
                        </div>
                        <div className="content-category">
                            <div className="category-header">
                                <div className="category-title">
                                    Danh mục sản phẩm
                                </div>
                            </div>
                            <div className="row">
                                {category}
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
                            <div className="row px-3 justify-content-start">
                                {product}
                            </div>
                        </div>

                        <div className="content-product">
                            <div className="product-header">
                                <div className="product-title">
                                    Sản phẩm đấu giá
                                </div>
                                <Link href="/auction">
                                    <a>
                                        <div className="see-more">
                                            <div>Xem thêm</div>
                                            <i className="pi pi-angle-right" aria-hidden></i>
                                        </div>
                                    </a>
                                </Link>
                            </div>
                            <div className="row px-3 justify-content-start">
                                {auction}
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
    let auctions = [];
    let isSignin = false;

    // check token
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).seller_token;
        isSignin = token ? true : false;
    }

    try {
        // call api list brand
        const res = await api.buyer.getListBrand();
        if (res.status === 200) {
            if (res.data.code === 200) {
                res.data.result.map(x => {
                    let brand = {
                        id: "",
                        name: "",
                        description: "",
                        image: ""
                    };
                    brand.id = x._id || "";
                    brand.name = x.name || "";
                    brand.description = x.description || "";
                    brand.image = x.imageUrl.url || "";
                    brand.imageId = x.imageUrl.id || "";
                    brands.push(brand);
                })
            } else {
                let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
        // // call api list category
        const res1 = await api.buyer.getListCategory();
        if (res1.status === 200) {
            if (res1.data.code === 200) {
                res1.data.list.map(x => {
                    let category = {
                        id: "",
                        name: "",
                        image: ""
                    };
                    category.id = x.childId || "";
                    category.name = x.childName || "";
                    category.image = x.imageUrl.url || "";
                    category.imageId = x.imageUrl.id || "";
                    categories.push(category);
                });
            } else {
                let message = res1.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
        // // call api list product
        // let params = {
        //     page: 0,
        //     rows: 8
        // };
        // const res2 = await api.buyer.getListProduct(params);
        // if (res2.status === 200) {
        //     if (res2.data.code === 200) {
        //         res2.data.result.map(x => {
        //             let product = {
        //                 id: "",
        //                 name: "",
        //                 price: "",
        //                 brand: "",
        //                 sku: "",
        //                 oldPrice: "",
        //                 image: "",
        //                 countProduct: 1
        //             };
        //             product.id = x._id || "";
        //             product.name = x.name || "";
        //             product.price = x.price || "";
        //             product.oldPrice = x.oldPrice || "";
        //             product.brand = x.brand || "";
        //             product.sku = x.sku || "";
        //             product.imageId = x.arrayImage[0].id || "";
        //             product.image = x.arrayImage[0].url || "";
        //             product.countProduct = x.countProduct;
        //             products.push(product);
        //         });
        //     }
        //     else {
        //         let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
        //         common.Toast(message, 'error');
        //     }
        // }

        // call api get recommendProduct
        const res2 = await api.buyer.getListRecommended();
        if (res2.status === 200) {
            if (res2.data.code === 200) {
                res2.data.result.map(x => {
                    let product = {
                        id: "",
                        name: "",
                        price: "",
                        brand: "",
                        sku: "",
                        oldPrice: "",
                        image: "",
                        countProduct: 1
                    };
                    product.id = x._id || "";
                    product.name = x.name || "";
                    product.price = x.price || "";
                    product.oldPrice = x.oldPrice || "";
                    product.brand = x.brand || "";
                    product.sku = x.sku || "";
                    product.imageId = x.arrayImage[0].id || "";
                    product.image = x.arrayImage[0].url || "";
                    product.countProduct = x.countProduct;
                    products.push(product);
                });
            }
            else {
                let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }

        let params2 = {
            page: 0,
            rows: 8
        }
        const resAuction = await api.auction.getList(params2);
        if (resAuction.status === 200) {
            if (resAuction.data.code === 200) {
                resAuction.data.result.map(x => {
                    let product = {
                        id: "",
                        name: "",
                        price: "",
                        brand: "",
                        sku: "",
                        oldPrice: "",
                        image: "",
                        countProduct: 1
                    };
                    product.id = x._id || "";
                    product.name = x.name || "";
                    product.price = x.price || "";
                    product.oldPrice = x.oldPrice || "";
                    product.brand = x.brand || "";
                    product.sku = x.sku || "";
                    product.imageId = x.arrayImage[0].id || "";
                    product.image = x.arrayImage[0].url || "";
                    product.countProduct = x.countProduct || 1;
                    auctions.push(product);
                });
            }
            else {
                let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
    }

    catch (error) {
        console.log(error.message);
    }
    return {
        props: { brands: brands, categories: categories, products: products, isSignin: isSignin, auctions }
    }
}

export default Home;
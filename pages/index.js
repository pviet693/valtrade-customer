import React, { useEffect, useState } from "react";
import Head from 'next/head';
import Slider from "react-slick";
import Link from 'next/link';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import Brand from "../components/Brand";
import Product from "../components/Product";
import Category from "../components/Category";

const Home = ({ brands, categories, products }) => {
    const size = 8;

    const brand = brands.slice(0,size).map((x,index) => 
        <Brand key={index.toString()} name={x.name} image={x.image} />
    );

    const product = products.slice(0,size).map((x, index) => 
        <Product key={index.toString()} name={x.name} image={x.image}
        price={x.price} brand={x.brand.name} sku={x.sku} oldPrice={x.oldPrice} />
    );

    const category = categories.slice(0,size).map((x, index) => (
        <Category key={index.toString()} name={x.name} image={x.image} />
    ));
    
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
                                {brand}
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
                    brands.push(brand);
                })
            } else {
                let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
        // call api list category
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
                    categories.push(category);
                });
            } else {
                let message = res1.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
        // call api list product

        const res2 = await api.buyer.getListProduct();
        console.log(res2.data.result);
            if (res2.status === 200){
                if (res2.data.code === 200){
                    res2.data.result.map(x => {
                        let product = {
                            id: "",
                            name: "",
                            price: "",
                            brand: "",
                            sku: "",
                            oldPrice: "",
                            image: "",
                        };
                        product.id = x._id || "";
                        product.name = x.name || "";
                        product.price = x.price || "";
                        product.oldPrice = x.oldPrice || "";
                        product.brand = x.brand || "";
                        product.sku = x.sku || "";  
                        product.image = x.arrayImage[0].url || "";  
                        products.push(product);          
                    });
                }
                else {
                    let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        
    } catch(error) {
        console.log(error);
    }
    return {
        props: { brands: brands, categories: categories, products: products },
    }
}

export default Home;
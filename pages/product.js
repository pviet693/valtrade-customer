import Link from 'next/link';
import Head from 'next/head';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import { useRouter } from 'next/router';
import { Checkbox } from 'primereact/checkbox';
import { TabMenu } from 'primereact/tabmenu';
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Router from 'next/router';

const Product = ({ brands, categories, products, query }) => {
    const items = [
        { label: 'SẢN PHẨM MỚI', icon: 'pi pi-fw pi-home' },
        { label: 'GIÁ CAO', icon: 'pi pi-arrow-up' },
        { label: 'GIÁ THẤP', icon: 'pi pi-arrow-down' },
        { label: 'TÊN (A - Z)', icon: 'pi pi-arrow-up' },
        { label: 'TÊN (Z - A)', icon: 'pi pi-arrow-down' }
    ];
    const router = useRouter();
    const [activeItem, setActiveItem] = useState(items[1]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const onChangeTabMenu = (e) => {
        setActiveItem({ ...e.value });
    }

    const CategoryCard = (props) => {
        const { id, name, image, onClick } = props;
        return (
            <a className="filter-category-row" onClick={() => onClick(id)}>
                <div className="d-flex align-items-center justify-content-start w-100">
                    <div className="d-flex align-items-center">
                        <div className="img-box">
                            <img src={image} alt="Image" />
                        </div>
                        <div className="category-name">
                            {name}
                        </div>
                    </div>
                    <i className="pi pi-angle-right" aria-hidden></i>
                </div>
            </a>
        )
    }

    const BrandCard = (props) => {
        const { id, name, image, onClick } = props;
        return (
            <a className="filter-category-row" onClick={() => onClick(id)}>
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="d-flex align-items-center">
                        <div className="img-box">
                            <img src={image} alt="Image" />
                        </div>
                        <div className="category-name">
                            {name}
                        </div>
                    </div>
                    <i className="pi pi-angle-right" aria-hidden></i>
                </div>
            </a >
        )
    }

    const FilterPriceCard = (props) => {
        const { from, to, gt, lt, checked, onChange} = props;

        if (gt) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => onChange(e)} checked={checked} />
                    <div className="price-value">
                        Trên {from}
                    </div>
                </div>
            )
        } else if (lt) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => onChange(e)} checked={checked} />
                    <div className="price-value">
                        Dưới {from}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => onChange(e)} checked={checked} />
                    <div className="price-value">
                        Từ {from} đến {to}
                    </div>
                </div>
            )
        }
    }

    const filterCategory = (categoryId) => {
        let queryTemp = query;
        queryTemp = { ...queryTemp, categoryId: categoryId }
        router.push({
            pathname: '/product',
            query: queryTemp
        })
    }

    const filterBrand = (brandId) => {
        let queryTemp = query;
        queryTemp = { ...queryTemp, brand: brandId }
        router.push({
            pathname: '/product',
            query: queryTemp
        })
    }

    const size = 10;

    const brand = brands.map((x, index) =>
        <BrandCard key={x.id} name={x.name} image={x.image} id={x.id} onClick={filterBrand} />
    );

    const product = products.map((x, index) =>
        <div className="col-md-4 d-flex align-items-center flex-column mb-4" key={x.id}>
            <ProductCard name={x.name} image={x.image} onClick={() => navigateToDetail(x)}
                price={x.price} brand={x.brand.name} sku={x.sku} oldPrice={x.oldPrice} warrantyStatus={true} />
        </div>
    );

    const category = categories.map((x, index) => (
        <CategoryCard key={x.id} id={x.id} name={x.name} image={x.image} onClick={filterCategory} />
    ));

    const navigateToDetail = (product) => {
        Router.push({
            pathname: '/product-detail',
            query: { id: product.id },
        })
    }

    const onChangeFilterPrice = (e) => {
        console.log(e);
    }

    return (
        <>
            <Head>
                <title>
                    Danh sách sản phẩm
                </title>
            </Head>
            <div className="product">
                <div className="container">
                    <div className="product-content">
                        <div className="content-filter">
                            <div className="filter-row">
                                <div className="filter-row-title">
                                    Danh mục sản phẩm
                                </div>
                                <div className="filter-row-content">
                                    {category}
                                </div>
                            </div>
                            <div className="filter-row">
                                <div className="filter-row-title">
                                    Giá tiền
                                </div>
                                <div className="filter-row-content">
                                    <FilterPriceCard from="1000000" to="" gt={false} lt={true} onChange={onChangeFilterPrice} value={true} />
                                    <FilterPriceCard from="1000000" to="5000000" gt={false} lt={false} value="2" />
                                    <FilterPriceCard from="5000000" to="15000000" gt={false} lt={false} value="3" />
                                    <FilterPriceCard from="15000000" to="" gt={true} lt={false} value="4" />
                                </div>
                            </div>
                            <div className="filter-row">
                                <div className="filter-row-title">
                                    Thương hiệu sản phẩm
                                </div>
                                <div className="filter-row-content">
                                    {brand}
                                </div>
                            </div>
                        </div>
                        <div className="content-list">
                            <div className="list-order">
                                <div>Sắp xếp: </div>
                                <TabMenu model={items} activeItem={activeItem} style={{ width: '100%' }} />
                            </div>
                            <div className="list-container">
                                <div className="row justify-content-start">
                                    {product}
                                </div>
                            </div>

                            {
                                products.length > 9 &&
                                <Paginator first={first} rows={rows} totalRecords={120} onPageChange={onPageChange}></Paginator>
                            }
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
    const query = ctx.query;

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

        const res2 = await api.buyer.getListProduct(query);
        if (res2.status === 200) {
            if (res2.data.code === 200) {
                console.log(res2.data.message);
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
    } catch (error) {
        console.log(error);
    }
    return {
        props: { brands: brands, categories: categories, products: products, query },
    }
}

export default Product;
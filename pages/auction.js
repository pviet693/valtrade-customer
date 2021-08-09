import Link from 'next/link';
import Head from 'next/head';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import { useRouter } from 'next/router';
import { Checkbox } from 'primereact/checkbox';
import { TabMenu } from 'primereact/tabmenu';
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';
import Router from 'next/router';
import { useEffect, useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import AuctionCard from "../components/AuctionCard";

const Auction = ({ brands, categories, products, query, total }) => {
    const items = [
        { label: 'SẢN PHẨM MỚI', icon: 'pi pi-fw pi-home' },
        { label: 'TÊN (A - Z)', icon: 'pi pi-arrow-up' },
        { label: 'TÊN (Z - A)', icon: 'pi pi-arrow-down' }
    ];
    const router = useRouter();
    const [listCountDown, setListCountDown] = useState({});
    const [listCountUser, setListCountUser] = useState({});
    const [listPrice, setListPrice] = useState({});
    const { state, dispatch, toast, socket } = useContext(DataContext);
    const [listProduct, setListProduct] = useState(products);
    const [totalRecord, setTotalRecord] = useState(total);
    const [count, setCount] = useState(0);
    const [filter, setFilter] = useState({
        ...query,
        page: 0,
        first: 0,
        rows: 12,
        categoryId: "",
        brand: "",
        keysOption: 0,
        activeItem: 0
    });

    function seconds2Time(number) {
        let hours = Math.floor(number / 3600);
        let minutes = Math.floor((number - (hours * 3600)) / 60);
        let seconds = number - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return hours + ':' + minutes + ':' + seconds;
    }

    const onPageChange = (event) => {
        setFilter((prevStates) => ({
            ...prevStates,
            ...event
        }));
    }

    const onChangeTabMenu = (e) => {
        setFilter((prevStates) => ({
            ...prevStates,
            activeItem: e.index
        }));
    }

    useEffect(() => {
        if (count) {
            filterListProduct();
        }
        let newCount = count;
        newCount += 1;
        setCount(newCount);
    }, [filter]);

    const filterListProduct = async () => {
        const res = await api.auction.getList(filter);
        let productList = [];
        if (res.status === 200) {
            if (res.data.code === 200) {
                const result = res.data.result;
                result.map(x => {
                    let product = {};
                    product.id = x._id || "";
                    product.name = x.name || "";
                    product.price = x.price || "";
                    product.oldPrice = x.oldPrice || "";
                    product.brand = x.brand || "";
                    product.sku = x.sku || "";
                    product.image = x.arrayImage[0].url || "";
                    product.imageId = x.arrayImage[0].id || "";
                    productList.push(product);
                });
                setTotalRecord(res.data.total);
                setListProduct(productList);
            }
            else {
                let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.ToastPrime('Lỗi', message, 'error', toast);
            }
        }
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

    const FilterStatus = (props) => {
        const { status, checked, onChange } = props;

        if (status === true) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={onChange} checked={checked} />
                    <div className="price-value">
                        Đang đấu giá
                    </div>
                </div>
            )
        } else if (status === false) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={onChange} checked={checked} />
                    <div className="price-value">
                        Đã đấu giá
                    </div>
                </div>
            )
        } else {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={onChange} checked={checked} />
                    <div className="price-value">
                        Tất cả
                    </div>
                </div>
            )
        }
    }

    const filterCategory = (categoryId) => {
        let queryTemp = query;
        queryTemp = { ...queryTemp, categoryId: categoryId }
        setFilter(queryTemp);
    }

    const filterBrand = (brandId) => {
        let queryTemp = query;
        queryTemp = { ...queryTemp, brand: brandId }
        setFilter(queryTemp);
    }

    const brand = brands.map((x, index) =>
        <BrandCard key={x.id} name={x.name} image={x.image} id={x.id} onClick={filterBrand} />
    );

    const product = listProduct.map((x, index) =>
        <div key={x.id} className="col-md-4 d-flex align-items-center flex-column mb-4">
            <AuctionCard name={x.name} image={x.image} time={seconds2Time(listCountDown[x.id] || 0)} winner={listPrice[x.id] ? listPrice[x.id].userName : ""} imageId={x.imageId}
                participantsNumber={listCountUser[x.id] || 0} currentPrice={listPrice[x.id] ? listPrice[x.id].price : x.price} onClick={() => navigateToDetail(x)} />
        </div>
    );

    const category = categories.map((x, index) => (
        <CategoryCard key={x.id} id={x.id} name={x.name} image={x.image} onClick={filterCategory} />
    ));

    const navigateToDetail = (product) => {
        Router.push({
            pathname: '/auction-detail',
            query: { id: product.id },
        }, null, { shallow: true });
    }

    const onChangeFilterPrice = (option) => {
        setFilter((prevStates) => ({
            ...prevStates,
            keysOption: option
        }))
    }

    useEffect(() => {
        if (socket) {
            socket.on("countListUser", (res) => {
                // console.log(res, "countListUser");
                setListCountUser(res);
            });
            socket.on("listPrice", (res) => {
                // console.log(res, "listPrice");
                setListPrice(res);
            });
            socket.on("listCountDown", (res) => {
                setListCountDown(res);
                // console.log(res);
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
                <title>
                    Danh sách sản phẩm đấu giá
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
                                    <FilterStatus  onChange={() => onChangeFilterPrice(0)} checked={filter.keysOption === 0} />
                                    <FilterStatus status={true} onChange={() => onChangeFilterPrice(1)} checked={filter.keysOption === 1} />
                                    <FilterStatus status={false} onChange={() => onChangeFilterPrice(2)} checked={filter.keysOption === 2} />
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
                                <TabMenu model={items} activeIndex={filter.activeItem} onTabChange={onChangeTabMenu} style={{ width: '100%' }} />
                            </div>
                            <div className="list-container">
                                <div className="row justify-content-start">
                                    {product}
                                </div>
                            </div>

                            {
                                totalRecord > 12 &&
                                <Paginator first={filter.first} rows={filter.rows} totalRecords={totalRecord} onPageChange={onPageChange}></Paginator>
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
    let total = 0;
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
                    brand.imageId = x.imageUrl.id || "";
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
                    category.imageId = x.imageUrl.id || "";
                    categories.push(category);
                });
            } else {
                let message = res1.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
        // call api list product
        let params = {
            ...query,
            page: 0,
            rows: 12
        }
        const res2 = await api.auction.getList(params);
        if (res2.status === 200) {
            if (res2.data.code === 200) {
                total = res2.data.total;
                const result = res2.data.result;
                result.map(x => {
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
                    products.push(product);
                });
            }
            else {
                let message = res2.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                common.Toast(message, 'error');
            }
        }
    } catch (error) {
        console.log(error.message);
    }
    return {
        props: { brands: brands, categories: categories, products: products, query, total },
    }
}

export default Auction;
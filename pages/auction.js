import Link from 'next/link';
import Head from 'next/head';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import { Checkbox } from 'primereact/checkbox';
import { TabMenu } from 'primereact/tabmenu';
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';
import AuctionCard from '../components/AuctionCard';
import Router from 'next/router';

const Auction = ({ brands, categories, auctions }) => {
    const items = [
        { label: 'SẢN PHẨM MỚI', icon: 'pi pi-fw pi-home' },
        { label: 'GIÁ CAO', icon: 'pi pi-arrow-up' },
        { label: 'GIÁ THẤP', icon: 'pi pi-arrow-down' },
        { label: 'TÊN (A - Z)', icon: 'pi pi-arrow-up' },
        { label: 'TÊN (Z - A)', icon: 'pi pi-arrow-down' }
    ];
    const [activeItem, setActiveItem] = useState({ label: 'GIÁ CAO', icon: 'pi pi-arrow-up' });
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
        const { name, image } = props;
        return (
            <Link href="/auction">
                <a className="filter-category-row">
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
                </a>
            </Link>
        )
    }

    const BrandCard = (props) => {
        const { name, image } = props;
        return (
            <Link href="/auction">
                <a className="filter-category-row">
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
                </a>
            </Link>
        )
    }

    const FilterPriceCard = (props) => {
        const { from, to, gt, lt, value } = props;

        if (gt) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => { }} checked={true} value={value}></Checkbox>
                    <div className="price-value">
                        Trên {from}
                    </div>
                </div>
            )
        } else if (lt) {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => { }} checked={true} value={value}></Checkbox>
                    <div className="price-value">
                        Dưới {from}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="filter-price-row">
                    <Checkbox onChange={(e) => { }} checked={true} value={value}></Checkbox>
                    <div className="price-value">
                        Từ {from} đến {to}
                    </div>
                </div>
            )
        }
    }

    const filterCategory = (categoryId) => {

    }

    const size = 10;

    const brand = brands.map((x, index) =>
        <BrandCard key={index.toString()} name={x.name} image={x.image} />
    );

    const auction = auctions.map((x, index) =>
        <div className="col-md-4 d-flex align-items-center flex-column mb-4">
            <AuctionCard key={index.toString()} name={x.name} image={x.image} time={10} winner={'abc'}
                participantsNumber={10} currentPrice={x.price} onClick={() => navigateToDetailAuction(x)} />
        </div>
    );

    const category = categories.map((x, index) => (
        <CategoryCard key={index.toString()} id={x.id} name={x.name} image={x.image} onClick={filterCategory} />
    ));

    const navigateToDetailAuction = (auction) => {
        Router.push({
            pathname: '/auction-detail',
            query: { id: auction.id },
        })
    }

    return (
        <>
            <Head>
                <title>
                    Danh sách đấu giá
                </title>
            </Head>
            <div className="auction">
                <div className="container">
                    <div className="auction-content">
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
                                    <FilterPriceCard from="1000000" to="" gt={false} lt={true} value="1" />
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
                                    {/* {auction} */}
                                    <div className="col-md-4 d-flex align-items-center flex-column mb-4">
                                        <AuctionCard name={'Adidas'} image={'static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                            participantsNumber={10} currentPrice={1000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center flex-column mb-4">
                                        <AuctionCard name={'Adidas'} image={'static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                            participantsNumber={10} currentPrice={1000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center flex-column mb-4">
                                        <AuctionCard name={'Adidas'} image={'static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                            participantsNumber={10} currentPrice={1000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center flex-column mb-4">
                                        <AuctionCard name={'Adidas'} image={'static/adidas-3-la.jpg'} time={10} winner={'abc'}
                                            participantsNumber={10} currentPrice={1000000} onClick={() => navigateToDetailAuction({ id: 123 })} />
                                    </div>
                                </div>
                            </div>

                            <Paginator first={first} rows={rows} totalRecords={120} onPageChange={onPageChange}></Paginator>
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
    let auctions = [];

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

        // call api list auction

    } catch (error) {
        console.log(error);
    }
    return {
        props: { brands: brands, categories: categories, auctions: auctions },
    }
}

export default Auction;
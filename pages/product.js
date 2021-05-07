import Link from 'next/link';
import Head from 'next/head';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import { useRouter } from 'next/router';
import { Checkbox } from 'primereact/checkbox';
import { TabMenu } from 'primereact/tabmenu';
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';

const Product = () => {
    const items = [
        { label: 'SẢN PHẨM MỚI', icon: 'pi pi-fw pi-home' },
        { label: 'GIÁ CAO', icon: 'pi pi-arrow-up' },
        { label: 'GIÁ THẤP', icon: 'pi pi-arrow-down' },
        { label: 'TÊN (A - Z)', icon: 'pi pi-arrow-up' },
        { label: 'TÊN (Z - A)', icon: 'pi pi-arrow-down' }
    ];
    const router = useRouter();
    const [activeItem, setActiveItem] = useState(items[0]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const CategoryCard = (props) => {
        const { name, src } = props;
        return (
            <Link href="/product">
                <a className="filter-category-row">
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                            <div className="img-box">
                                <img src={src} alt="Image" />
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
        const { name, src } = props;
        return (
            <Link href="/product">
                <a className="filter-category-row">
                    <div className="d-flex align-items-center justify-content-between w-100">
                        <div className="d-flex align-items-center">
                            <div className="img-box">
                                <img src={src} alt="Image" />
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
                    <Checkbox onChange={(e) => {}} checked={true} value={value}></Checkbox>
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

    const ProductCard = (props) => {
        const { src, name, price, brand, warrantyStatus, sku, primaryPrice } = props;
        return (
            <div className="col-md-4 d-flex align-items-center flex-column mb-4">
                <div className="product-card">
                    <div className="img-product-box">
                        <img src={src} />
                    </div>
                    <div className="product-info">
                        <div className="product-name">{name}</div>
                        <div className="product-price">{price} đ</div>
                        <div className="product-brand">Thương hiệu: {brand}</div>
                        <div className="product-warranty">Tình trạng bảo hành: <span>{warrantyStatus ? 'Vẫn còn' : 'Hết hạn'}</span></div>
                        <div className="product-sku">SKU: <span>{sku}</span></div>
                        <div className="product-primary-price">Giá gốc: <span>{primaryPrice} đ</span></div>
                    </div>
                    <div className="product-action">
                        <button className="btn button-add-to-cart">Thêm vào giỏ hàng</button>
                        <button className="btn button-buy-now">Mua ngay</button>
                        <button className="btn button-detail">Chi tiết</button>
                    </div>
                </div>
            </div>
        )
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
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
                                    <CategoryCard name="Điện thoại thông minh" src="/static/adidas-3-la.jpg" />
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
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                    <BrandCard name="Adidas" src="/static/adidas-3-la.jpg" />
                                </div>
                            </div>
                        </div>
                        <div className="content-list">
                            <div className="list-order">
                                <div>Sắp xếp: </div>
                                <TabMenu model={items} activeItem={activeItem}/>
                            </div>
                            <div className="list-container">
                                <div className="row px-3 justify-content-center">
                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />

                                    <ProductCard
                                        src="/static/adidas-3-la.jpg"
                                        name="Adidas 1242 anc def uiwew sdkj"
                                        warrantyStatus={true}
                                        brand="Adidas"
                                        price="4.400.000"
                                        primaryPrice="5.000.000"
                                        sku="SKU223344"
                                    />
                                </div>
                            </div>

                            <Paginator first={first} rows={rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange}></Paginator>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product;
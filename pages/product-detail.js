import Head from 'next/head';
import { Galleria } from 'primereact/galleria';
import { useContext, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { DataContext } from '../store/GlobalState';
import api from '../utils/backend-api.utils';
import * as common from './../utils/common';
import { Image } from 'cloudinary-react';
import { Rating } from '@material-ui/lab';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { InputTextarea } from 'primereact/inputtextarea';

const ProductDetail = ({ product, productRecommend }) => {

    const { state, dispatch, toast, swal } = useContext(DataContext);
    const { cart } = state;
    const [information] = useState(JSON.parse(product.information));
    console.log(information);
    const [bodyRate, setBodyRate] = useState({
        productRate: product.id,
        rate: 0,
        comment: ""
    });

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

    const getVersionImage = (linkImage) => {
        const arr = linkImage.split("/");
        return arr[6].replace("v", "");
    }

    const itemTemplate = (item) => {
        return (
            <Image
                publicId={item.id}
                version={getVersionImage(item.url)}
                cloud_name="ktant"
                secure="true"
                alt="Image Product"
                height="450"
                width="400"
                crop="fill"
                loading="lazy"
            >
            </Image>
        );
    }

    const thumbnailTemplate = (item) => {
        return (
            <Image
                publicId={item.id}
                version={getVersionImage(item.url)}
                cloud_name="ktant"
                secure="true"
                alt="Image Product"
                height="70"
                width="80"
                crop="fill"
                loading="lazy"
            >
            </Image>
        );
    }

    const addToCart = async () => {

        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

        try {
            let cartTemp = cart;
            if (cart.length > 0) {
                let sameProduct = cartTemp.filter(x => x.productId === product.id);
                if (sameProduct.length === 1) {
                    if (product.countProduct === sameProduct[0].quantity) {
                        swal.close();
                        common.ToastPrime('Lỗi', 'Sản phẩm không đủ số lượng.', 'error', toast);
                        return;
                    } else {
                        sameProduct[0].quantity++;
                        let body = {
                            cartItems: [
                                {
                                    inforProduct: sameProduct[0].productId,
                                    quantity: sameProduct[0].quantity
                                }
                            ]
                        }
                        const res = await api.cart.postCart(body);
                        swal.close();
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                                dispatch({
                                    type: 'ADD_CART', payload: cartTemp
                                });
                            } else {
                                let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                                common.ToastPrime('Lỗi', message, 'error', toast);
                            }
                        }
                    }
                } else {
                    let body = {
                        cartItems: [
                            {
                                inforProduct: product.id,
                                quantity: 1
                            }
                        ]
                    }
                    const res = await api.cart.postCart(body);
                    swal.close();
                    if (res.status === 200) {
                        if (res.data.code === 200) {
                            cartTemp.push({
                                productName: product.name,
                                productId: product.id,
                                productImage: product.image,
                                price: product.price,
                                quantity: 1
                            })
                            dispatch({
                                type: 'ADD_CART', payload: cartTemp
                            });
                            common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                        } else {
                            let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                            common.ToastPrime('Lỗi', message, 'error', toast);
                        }
                    }
                }
            } else {
                let body = {
                    cartItems: [
                        {
                            inforProduct: product.id,
                            quantity: 1
                        }
                    ]
                }
                const res = await api.cart.postCart(body);
                swal.close();
                if (res.status === 200) {
                    if (res.data.code === 200) {
                        cartTemp.push({
                            productName: product.name,
                            productId: product.id,
                            productImage: product.image,
                            price: product.price,
                            quantity: 1
                        })
                        dispatch({
                            type: 'ADD_CART', payload: cartTemp
                        });
                        common.ToastPrime('Thành công', 'Thêm vào giỏ hàng thành công.', 'success', toast);
                    } else {
                        let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                        common.ToastPrime('Lỗi', message, 'error', toast);
                    }
                }
            }
        } catch (e) {
            swal.close();
            common.ToastPrime('Lỗi', e.message || e, 'error', toast);
        }
    }

    const sendRateComment = () => {
        console.log(bodyRate);
    }

    return (
        <div className="product-detail-container">
            <Head>
                <title>Chi tiết sản phẩm</title>
            </Head>
            <div className="product-detail-content">
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
                    <div className="product-info-container">
                        <div className="product-info-image">
                            <Galleria id={product.id} value={product.arrayImage} responsiveOptions={responsiveOptions} numVisible={4} circular style={{ maxWidth: '640px' }}
                                showItemNavigators showItemNavigatorsOnHover item={itemTemplate} thumbnail={thumbnailTemplate} />
                        </div>
                        <div className="product-info-detail">
                            <div className="detail-name">
                                {product.name}
                            </div>
                            <div className="detail-price">
                                Giá:  {common.numberWithCommas(product.price)} VND
                            </div>
                            <h5>Thông tin chi tiết</h5>
                            <div className="detail-row">
                                Thương hiệu: <span><strong>{product.brand}</strong></span>
                            </div>
                            <div className="detail-row">
                                SKU: <span className="detail-sku">{product.sku}</span>
                            </div>
                            <div className="detail-row">
                                Tình trạng bảo hành: <span className="detail-warranty-status">{product.restWarrantyTime}</span>
                            </div>
                            <div className="detail-row">
                                Mô tả: <span>{product.description}</span>
                            </div>
                            <div className="detail-row">
                                Lưu ý: <span>{product.note}</span>
                            </div>

                            <div className="detail-action">
                                <button className="btn button-add-to-cart" onClick={addToCart}><i className="pi pi-shopping-cart"></i> Thêm vào giỏ hàng</button>
                                <button className="btn button-buy-now">Mua ngay</button>
                            </div>
                        </div>
                    </div>
                    <div className="comment-container">
                        <div className="title">
                            Đánh giá sản phẩm
                        </div>
                        <div className="comment-row">
                            {/* <div className="comment-row_img">
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
                            </div> */}

                            <div className="comment-row_img">
                                <img src={'/static/avatar2.png'} alt="Avatar" />
                            </div>
                            <div className="comment-row_content">
                                <div className="content_name">
                                    Name ABC
                                </div>
                                <Rating
                                    name="customized-empty"
                                    value={bodyRate.rate}
                                    onChange={(e) => {
                                        setBodyRate((prevStates) => ({
                                            ...prevStates,
                                            rate: Number(e.target.value)
                                        }))
                                    }}
                                    precision={0.5}
                                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                                    size="large"
                                />
                                <InputTextarea
                                    className="w-100"
                                    rows={5}
                                    value={bodyRate.comment}
                                    onChange={(e) => {
                                        setBodyRate((prevStates) => ({
                                            ...prevStates,
                                            comment: e.target.value
                                        }))
                                    }}
                                    placeholder="Nhập nhận xét..."
                                />
                                <div className="row justify-content-end w-100 mx-0">
                                    <button className="btn btn--send-comment" type="submit" onClick={sendRateComment}>
                                        Gửi đi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="product-recommend-container">
                        <div className="title">
                            Sản phẩm tương tự
                        </div>
                        <div className="row">
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
                            </div>
                            <div className="col-md-3 d-flex align-items-center flex-column mb-4">
                                <ProductCard name={"Điện thoại Samsung A12"} image={'/static/adidas-3-la.jpg'}
                                    price={7500000} brand={'Samsung'} sku={'SKU12345678'} oldPrice={10000000} />
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
        countProduct: 0
    };
    try {
        const res = await api.buyer.getDetailProduct(id);
        if (res.status === 200) {
            if (res.data.code === 200) {
                const data = res.data.result;
                productDetail.id = id;
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
            }
        }
    } catch (error) {
        common.Toast(error, 'error');
    }
    // call api get product have same brand

    return {
        props: {
            product: productDetail,
            productRecommend: []
        }
    }
}

export default ProductDetail;
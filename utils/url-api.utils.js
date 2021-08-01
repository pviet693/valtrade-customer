export const baseUrl = "https://valtrade-api.tech";

const url = {
    buyer: {
        postLogin: () => `${baseUrl}/api/buyer/login`,
        getLogout: () => `${baseUrl}/api/buyer/logout`,
        postRegister: () => `${baseUrl}/api/buyer/register`,
        getCheckAuth: () => `${baseUrl}/api/buyer/checkAuth`,
        getProfile: () => `${baseUrl}/api/buyer/profile`,
        postResetLink: () => `${baseUrl}/api/buyer/resetLink`,
        postResetPassword: () => `${baseUrl}/api/buyer/resetPassword`,
        postAuthFacebook: () => `${baseUrl}/api/buyer/facebook`,
        postAuthGoogle: () => `${baseUrl}/api/buyer/google`,
        postUpdateProfile: () => `${baseUrl}/api/buyer/updateProfile`,
        postChangePassword: () => `${baseUrl}/api/buyer/changePassword`,
        putUpdateAvatar: () => `${baseUrl}/api/buyer/update-image-profile`,
        getListBrand: () => `${baseUrl}/api/brand/get`,
        getListCategory: () => `${baseUrl}/api/category/list`,
        getListProduct: () => `${baseUrl}/api/product/get`,
        getListProductFilter: () => `${baseUrl}/api/product/get?categoryId=`,
        getDetailProduct: () => `${baseUrl}/api/product/detail/:id`,
        postCart: () => `${baseUrl}/api/cart/updateCart`,
        changePassword: () => `${baseUrl}/api/buyer/changePassword`
    },
    product: {
        postCreate: () => `${baseUrl}/api/product/create`,
        getDetail: () => `${baseUrl}/api/product/detail/:id`,
        delete: () => `${baseUrl}/api/product/remove/:id`,
        putUpdate: () => `${baseUrl}/api/product/update`,
        createComment: () => `${baseUrl}/api/comment/createComment`,
        getComment: () => `${baseUrl}/api/comment/getCommentProduct`
    },
    auction: {
        getList: () => `${baseUrl}/api/bid/get`,
        getDetail: () => `${baseUrl}/api/bid/detail/:id`
    },
    cart: {
        postCart: () => `${baseUrl}/api/cart/updateCart`,
        getCart: () => `${baseUrl}/api/cart/getCart`,
        deleteCart: () => `${baseUrl}/api/cart/removeItem/`,
    },
    filter: {
        search: () => `${baseUrl}/api/product/search`,
    },
    ghn: {
        getProvince: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        getWard: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward",
        getDistrict: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
        calculateShippingFee: () => "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee"
    },
    ghtk: {
        calculateShippingFee: () => `${baseUrl}/api/product/fee`
    },
    address: {
        getListAddress: () => `${baseUrl}/api/buyer/getListAddress`,
        postCreate: () => `${baseUrl}/api/buyer/createAddress`,
        delete: () => `${baseUrl}/api/buyer/deleteAddress/:id`,
        update: () => `${baseUrl}/api/buyer/updateAddress`,
    },
    order: {
        createOrder: () => `${baseUrl}/api/order/createOrder`,
        getOrder: () => `${baseUrl}/api/order/getByBuyer`,
    },
    category: {
        getDetails: () => `${baseUrl}/api/category/detail/:id`,
    },
    transfer: {
        postTransfer: () => `${baseUrl}/api/transfer/createTransfer`
    },
    notification: {
        getNotification: () => `${baseUrl}/api/notification/list`
    },
    chat: {
        sendMessage: () => `${baseUrl}/api/message/sendMessage`,
        getListMessage: () => `${baseUrl}/api/message/getListMessage`,
        updateMessage: () => `${baseUrl}/api/message/updateMessage`,
        getListConversation: () => `${baseUrl}/api/message/getListConversation`
    },
    report: {
        createReport: () => `${baseUrl}/api/report/createReport`,
    }
}

export default url;
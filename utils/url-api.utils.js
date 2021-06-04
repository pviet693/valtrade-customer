const baseUrl = "http://3.142.207.62:5000";

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
        putUpdateAvatar: () => `${baseUrl}/api/buyer/update-profile-image`,
        getListBrand: () => `${baseUrl}/api/brand/get`,
        getListCategory: () => `${baseUrl}/api/category/list`,
        getListProduct: () => `${baseUrl}/api/product/get`,
        getListProductFilter: () => `${baseUrl}/api/product/get?categoryId=`,
        getDetailProduct: () => `${baseUrl}/api/product/detail/:id`
    },
    product: {
        postCreate: () => `${baseUrl}/api/product/create`,
        getDetail: () => `${baseUrl}/api/product/detail/:id`,
        delete: () => `${baseUrl}/api/product/remove/:id`,
        putUpdate: () => `${baseUrl}/api/product/update`,
    },
    cart: {
        postCart: () => `${baseUrl}/api/cart/updateCart`,
        getCart: () => `${baseUrl}/api/cart/getCart`,
    },
    filter: {
        search: () => `${baseUrl}/api/product/get`,
    }
}

export default url;
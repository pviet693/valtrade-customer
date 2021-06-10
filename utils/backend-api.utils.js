import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';
import * as common from './common';

let token = Cookie.get('access_token');

let config = {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

const isEnable = (accessToken = '') => {
    token = accessToken || Cookie.get('access_token');
    if (!token) {
        return false;
    } else {
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        return true;
    }
}

const api = {
    buyer: {
        login: (body) => {
            return axios.post(url.buyer.postLogin(), body);
        },
        logout: () => {
            return axios.get(url.buyer.getLogout());
        },
        register: (body) => {
            return axios.post(url.buyer.postRegister(), body);
        },
        checkAuth: (body) => {
            return axios.get(url.buyer.getCheckAuth(), body);
        },
        getProfile: () => {
            if (isEnable()) {
                return axios.get(url.buyer.getProfile(), config);
            }
        },
        resetLink: () => {
            return axios.post(url.buyer.postResetLink());
        },
        resetPassword: (body) => {
            return axios.post(url.buyer.postResetPassword(), body);
        },
        authFacebook: (body) => {
            return axios.post(url.buyer.postAuthFacebook(), body);
        },
        authGoogle: (body) => {
            return axios.post(url.buyer.postAuthGoogle(), body);
        },
        updateProfile: (body) => {
            return axios.post(url.buyer.postUpdateProfile(), body, config);
        },
        changePassword: (body) => {
            return axios.post(url.buyer.postChangePassword(), body, config);
        },
        updateAvatar: (body) => {
            const newConfig = {
                ...config,
                'Content-Type': 'multipart/form-data'
            }
            return axios.put(url.buyer.putUpdateAvatar, body, newConfig);
        },
        getListBrand: () => {
            return axios.get(url.buyer.getListBrand());
        },
        getListCategory: () => {
            return axios.get(url.buyer.getListCategory());
        },
        getListProduct: () => {
            return axios.get(url.buyer.getListProduct());
        },
        getDetailProduct: (id) => {
            return axios.get(url.buyer.getDetailProduct().replace(':id', id));
        },
        postCart: (body) => {
            const newConfig = {
                ...config,
                'Content-Type': 'multipart/form-data'
            }
            return axios.post(url.buyer.postCart(), body, newConfig);
        },
        changePassword: (body) => {
            return axios.post(url.buyer.changePassword(), body, config);
        }
    },
    product: {
        create: (body) => {
            return axios.post(url.product.postCreate(), body, config);
        },
        getDetail: (id) => {
            const get_detail_url = url.product.getDetail().replace(':id', id);
            return axios.get(get_detail_url, config);
        },
        delete: (id) => {
            const delete_url = url.product.delete().replace(':id', id);
            return axios.delete(delete_url, config);
        },
        update: (body) => {
            return axios.put(url.product.putUpdate(), body, config);
        }
    },
    cart: {
        postCart: (body) => {
            const newConfig = {
                ...config,
                'Content-Type': 'multipart/form-data'
            }
            return axios.post(url.cart.postCart(), body, newConfig)
        },
        getCart: (accessToken) => {
            if (isEnable(accessToken)) {
                return axios.get(url.cart.getCart(), config);
            }
        }
    },
    filter: {
        search: (params) => {
            const newConfig = {
                ...config,
                params: {
                    params
                }
            }
            return axios.get(url.filter.search(), newConfig);
        }
    },
    ghn: {
        getProvince: () => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Token': `${common.tokenGHN}`,
                },
            }
            return axios.get(url.ghn.getProvince(), newConfig);
        },
        getDistrict: (provinceId) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${common.tokenGHN}`,
                },
                params: {
                    province_id: provinceId
                }
            }
            return axios.get(url.ghn.getDistrict(), newConfig);
        },
        getWard: (districtId) => {
            const newConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'token': `${common.tokenGHN}`
                },
                params: {
                    district_id: districtId
                }
            }
            return axios.get(url.ghn.getWard(), newConfig);
        },
    },
    address: {
        createAddress: (body) => {
            if (isEnable()) {
                return axios.post(url.address.postCreate(), body, config);
            }
        },
        getListAddress: (accessToken) => {
            if (isEnable(accessToken)) {
                return axios.get(url.address.getListAddress(), config);
            }
        },
        delete: (id) => {
            if (isEnable()) {
                let delete_url = url.address.delete().replace(":id", id)
                return axios.delete(delete_url, config);
            }
        },
        update: (body) => {
            if (isEnable()) {
                return axios.put(url.address.update(), body, config);
            }
        }
    }
};

export default api;
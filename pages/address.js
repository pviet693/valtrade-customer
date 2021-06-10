import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../store/GlobalState';
import * as common from './../utils/common';
import SlideNav from './../components/SlideNav';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Dropdown } from 'primereact/dropdown';
import api from './../utils/backend-api.utils';
import cookie from "cookie";

function Address({ provinces, listAddress }) {
    const { state, dispatch, toast } = useContext(DataContext);

    const [province, setProvince] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [district, setDistrict] = useState(null);
    const [wards, setWards] = useState([]);
    const [ward, setWard] = useState(null);
    const [street, setStreet] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [disableGHN, setDisableGHN] = useState(false);
    const [open, setOpen] = useState(false);

    const onChangeProvince = async (e) => {
        setProvince(e.value);
        setDistrict(null);
        setWard(null);

        try {
            const res = await api.ghn.getDistrict(e.value.ProvinceID);
            setDistricts(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const onChangeDistrict = async (e) => {
        setDistrict(e.value);
        setWard(null);

        try {
            const res = await api.ghn.getWard(e.value.DistrictID);
            setWards(res.data.data);
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const submitAddress = async () => {
        setOpen(false);
        try {
            let ghn = null;

            ghn =
            {
                province: {
                    province_id: province.ProvinceID,
                    name: province.ProvinceName
                },
                district: {
                    district_id: district.DistrictID,
                    name: district.DistrictName
                },
                ward: {
                    ward_code: ward.WardCode,
                    name: ward.WardName
                },
                full_address: `${street}, ${ward.WardName}, ${district.DistrictName}, ${province.ProvinceName}`
            }


            let body = {};

            if (ghn) { body["address"] = ghn; }
            body["name"] = name;
            body["phone"] = phone;
            body["isDefault"] = false;

            const res = await api.address.createAddress(body);
            if (res.status === 200) {
                common.Toast('Lưu thành công', 'success')

            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <Head>
                <title>
                    Sổ địa chỉ
                </title>
            </Head>
            <div className="address__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="address__content">
                            <div className="address__content__title">Sổ địa chỉ</div>
                            <hr />
                            {
                                listAddress.map(address => {
                                    return (
                                        <div className="address-item__container" key={address.id}>
                                            <div className="address-item__row">
                                                <div className="address-item__row__label">
                                                    Họ và tên:
                                                </div>
                                                <div className="address-item__row__value">
                                                    {address.name}
                                                </div>
                                                {
                                                    address.isDefault &&
                                                    <div className="address-item__row__default">
                                                        Địa chỉ mặc định
                                                    </div>
                                                }
                                            </div>
                                            <div className="address-item__row">
                                                <div className="address-item__row__label">
                                                    Số điện thoại:
                                                </div>
                                                <div className="address-item__row__value">
                                                    {address.phone}
                                                </div>
                                            </div>
                                            <div className="address-item__row">
                                                <div className="address-item__row__label">
                                                    Địa chỉ:
                                                </div>
                                                <div className="address-item__row__value">
                                                    {address.address.full_address}
                                                </div>
                                            </div>

                                            <button className="btn btn-success btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Sửa"><i className="fa fa-edit" aria-hidden></i></button>
                                            <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="Xóa"><i className="fa fa-trash" aria-hidden></i></button>
                                        </div>
                                    )
                                })
                            }

                            <Dialog open={open} onClose={submitAddress} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Thêm địa chỉ mới</DialogTitle>
                                <DialogContent>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghn">Tỉnh/Thành phố: </label>
                                        <Dropdown
                                            id="province-ghn"
                                            value={province}
                                            onChange={onChangeProvince}
                                            options={provinces}
                                            optionLabel="ProvinceName"
                                            filter showClear
                                            filterBy="ProvinceName"
                                            placeholder="Chọn tỉnh/thành phố"
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghn">Quận/Huyện: </label>
                                        <Dropdown
                                            id="district-ghn"
                                            value={district}
                                            onChange={onChangeDistrict}
                                            options={districts}
                                            optionLabel="DistrictName"
                                            filter showClear
                                            filterBy="DistrictName"
                                            placeholder="Chọn quận/huyện"
                                            disabled={!province || disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghn">Phường/Xã: </label>
                                        <Dropdown
                                            id="ward-ghn"
                                            value={ward}
                                            onChange={e => setWard(e.value)}
                                            options={wards}
                                            optionLabel="WardName"
                                            filter showClear
                                            filterBy="WardName"
                                            placeholder="Chọn phường/xã"
                                            disabled={!district || disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">Tòa nhà, tên đường: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street" name="street_name"
                                            placeholder="Tòa nhà, Tên đường..."
                                            value={street} onChange={e => setStreet(e.target.value)}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">Họ và tên: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="phone" name="name"
                                            placeholder="Họ và tên"
                                            value={name} onChange={e => setName(e.target.value)}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">Số điện thoại: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="phone" name="phone"
                                            placeholder="Số điện thoại"
                                            value={phone} onChange={e => setPhone(e.target.value)}
                                            disabled={disableGHN}
                                        />
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={submitAddress} color="primary">
                                        Hủy
                                    </Button>
                                    <Button onClick={submitAddress} color="primary">
                                        Tạo mới
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {

    let provinces = [];
    let listAddress = [];
    let token;
    const cookies = ctx.req.headers.cookie;
    token = cookies ? cookie.parse(cookies).access_token : "";

    try {
        const getProvince = await api.ghn.getProvince();
        provinces = getProvince.data.data;

        const getListAddress = await api.address.getListAddress(token);
        if (getListAddress.data.code === 200) {
            getListAddress.data.result.forEach(element => {
                let address = {
                    id: "",
                    name: "",
                    phone: "",
                    address: {},
                    isDefault: false
                }
                address.id = element._id || "";
                address.name = element.name || "";
                address.phone = element.phone || "";
                address.address = element.address || {};
                address.isDefault = element.isDefault;

                listAddress.push(address);
            });
        }
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            provinces,
            listAddress
        }
    }
}

export default Address;
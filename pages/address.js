import Head from 'next/head';
import { useContext, useState } from 'react';
import { DataContext } from '../store/GlobalState';
import * as common from './../utils/common';
import SlideNav from './../components/SlideNav';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Dropdown } from 'primereact/dropdown';
import Checkbox from '@material-ui/core/Checkbox';
import api from './../utils/backend-api.utils';
import cookie from "cookie";

function Address(props) {
    const { state, dispatch, toast, swal } = useContext(DataContext);

    const [provinces, setProvinces] = useState(props.provinces);
    const [listAddress, setListAddress] = useState(props.listAddress);
    const [addressId, setAddressId] = useState("");
    const [province, setProvince] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [district, setDistrict] = useState(null);
    const [wards, setWards] = useState([]);
    const [ward, setWard] = useState(null);
    const [street, setStreet] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isDefault, setIsDefault] = useState(false);
    const [open, setOpen] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);

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

        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

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
            body["isDefault"] = isDefault;

            const res = await api.address.createAddress(body);
            if (res.status === 200) {
                common.ToastPrime("Th??nh c??ng", "L??u th??nh c??ng.", "success", toast);

                getListAddress();

                swal.close();
            } else {
                swal.close();
            }
        } catch (error) {
            swal.close();
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const setValue = async (id) => {
        try {
            const address = listAddress.find(x => x.id === id);
            setAddressId(id);
            setName(address.name);
            setPhone(address.phone);
            setIsDefault(address.isDefault);

            const prov = provinces.find(x => x.ProvinceID === address.address.province.province_id);
            setProvince(prov);

            const res = await api.ghn.getDistrict(address.address.province.province_id);
            setDistricts(res.data.data);

            const dist = res.data.data.find(x => x.DistrictID === address.address.district.district_id);
            setDistrict(dist);

            const res1 = await api.ghn.getWard(address.address.district.district_id);
            setWards(res1.data.data);

            const w = res1.data.data.find(x => x.WardCode === address.address.ward.ward_code);
            setWard(w);

            let str = address.address.full_address.split(',');
            str.splice(str.length - 3).join(', ');
            setStreet(str);
        } catch (error) {
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const editAddress = (id) => {
        setValue(id);
        setOpenUpdate(true);
    }

    const updateAddress = async () => {
        setOpenUpdate(false);

        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

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
            body["idAddress"] = addressId;
            body["name"] = name;
            body["phone"] = phone;
            body["isDefault"] = isDefault;

            const res = await api.address.update(body);
            if (res.status === 200) {
                common.ToastPrime("Th??nh c??ng", "L??u th??nh c??ng.", "success", toast);

                getListAddress();

                swal.close();
            } else {
                swal.close();
            }
        } catch (error) {
            swal.close();
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const removeAddress = async (id) => {
        swal.fire({
            onBeforeOpen: () => {
                swal.showLoading();
            },
        })

        try {
            const res = await api.address.delete(id);
            if (res.status === 200) {
                common.ToastPrime("Th??nh c??ng", "X??a th??nh c??ng.", "success", toast);

                getListAddress();

                swal.close();
            } else {
                swal.close();
            }
        } catch (error) {
            swal.close();
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const addNewAddress = () => {
        setProvince(null);
        setDistrict(null);
        setWard(null);
        setStreet("");
        setName("");
        setPhone("");
        setIsDefault(false);

        setOpen(true);
    }

    const getListAddress = async () => {
        const res = await api.address.getListAddress();
        let listAddressTemp = [];
        if (res.data.code === 200) {
            res.data.result.forEach(element => {
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

                listAddressTemp.push(address);
            });
        }
        setListAddress([...listAddressTemp]);
    }

    return (
        <>
            <Head>
                <title>
                    S??? ?????a ch???
                </title>
            </Head>
            <div className="address__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="address__content">
                            <div className="address__content__title">S??? ?????a ch???</div>
                            <hr />
                            {
                                listAddress.map(address => {
                                    return (
                                        <div className="address-item__container" key={address.id}>
                                            <div className="address-item__content">
                                                <div className="address-item__row">
                                                    <div className="address-item__row__label">
                                                        H??? v?? t??n:
                                                    </div>
                                                    <div className="address-item__row__value">
                                                        {address.name}
                                                    </div>
                                                    {
                                                        address.isDefault &&
                                                        <div className="address-item__row__default">
                                                            ?????a ch??? m???c ?????nh
                                                        </div>
                                                    }
                                                </div>
                                                <div className="address-item__row">
                                                    <div className="address-item__row__label">
                                                        S??? ??i???n tho???i:
                                                    </div>
                                                    <div className="address-item__row__value">
                                                        {address.phone}
                                                    </div>
                                                </div>
                                                <div className="address-item__row">
                                                    <div className="address-item__row__label">
                                                        ?????a ch???:
                                                    </div>
                                                    <div className="address-item__row__value">
                                                        {address.address.full_address}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="address-item__actions">
                                                <button className="btn btn-primary btn-sm rounded-0 mr-2" type="button" data-toggle="tooltip" data-placement="top" title="S???a" onClick={() => editAddress(address.id)}><EditIcon /></button>
                                                <button className="btn btn-danger btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="X??a" onClick={() => removeAddress(address.id)}><DeleteIcon /></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            <div className="text-center">
                                <button className="btn add-new-address" type="button" onClick={() => addNewAddress()}>Th??m ?????a ch??? m???i</button>
                            </div>

                            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Th??m ?????a ch??? m???i</DialogTitle>
                                <DialogContent>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">H??? v?? t??n: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="name" name="name"
                                            placeholder="H??? v?? t??n"
                                            value={name} onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">S??? ??i???n tho???i: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="phone" name="phone"
                                            placeholder="S??? ??i???n tho???i"
                                            value={phone} onChange={e => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghn">T???nh/Th??nh ph???: </label>
                                        <Dropdown
                                            id="province-ghn"
                                            value={province}
                                            onChange={onChangeProvince}
                                            options={provinces}
                                            optionLabel="ProvinceName"
                                            filter showClear
                                            filterBy="ProvinceName"
                                            placeholder="Ch???n t???nh/th??nh ph???"
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghn">Qu???n/Huy???n: </label>
                                        <Dropdown
                                            id="district-ghn"
                                            value={district}
                                            onChange={onChangeDistrict}
                                            options={districts}
                                            optionLabel="DistrictName"
                                            filter showClear
                                            filterBy="DistrictName"
                                            placeholder="Ch???n qu???n/huy???n"
                                            disabled={!province}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghn">Ph?????ng/X??: </label>
                                        <Dropdown
                                            id="ward-ghn"
                                            value={ward}
                                            onChange={e => setWard(e.value)}
                                            options={wards}
                                            optionLabel="WardName"
                                            filter showClear
                                            filterBy="WardName"
                                            placeholder="Ch???n ph?????ng/x??"
                                            disabled={!district}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">T??a nh??, t??n ???????ng: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street" name="street_name"
                                            placeholder="T??a nh??, T??n ???????ng..."
                                            value={street} onChange={e => setStreet(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row--checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isDefault}
                                            onChange={() => setIsDefault(!isDefault)}
                                        />
                                        <label>?????t l??m m???c ?????nh</label>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} className="btn btn--cancel">
                                        H???y
                                    </Button>
                                    <Button onClick={submitAddress} className="btn btn--confirm">
                                        T???o m???i
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">C???p nh???t ?????a ch???</DialogTitle>
                                <DialogContent>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">H??? v?? t??n: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="name-update" name="name"
                                            placeholder="H??? v?? t??n"
                                            value={name} onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">S??? ??i???n tho???i: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="phone-update" name="phone"
                                            placeholder="S??? ??i???n tho???i"
                                            value={phone} onChange={e => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="province-ghn">T???nh/Th??nh ph???: </label>
                                        <Dropdown
                                            id="province-ghn"
                                            value={province}
                                            onChange={onChangeProvince}
                                            options={provinces}
                                            optionLabel="ProvinceName"
                                            filter showClear
                                            filterBy="ProvinceName"
                                            placeholder="Ch???n t???nh/th??nh ph???"
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="district-ghn">Qu???n/Huy???n: </label>
                                        <Dropdown
                                            id="district-ghn"
                                            value={district}
                                            onChange={onChangeDistrict}
                                            options={districts}
                                            optionLabel="DistrictName"
                                            filter showClear
                                            filterBy="DistrictName"
                                            placeholder="Ch???n qu???n/huy???n"
                                            disabled={!province}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="ward-ghn">Ph?????ng/X??: </label>
                                        <Dropdown
                                            id="ward-ghn"
                                            value={ward}
                                            onChange={e => setWard(e.value)}
                                            options={wards}
                                            optionLabel="WardName"
                                            filter showClear
                                            filterBy="WardName"
                                            placeholder="Ch???n ph?????ng/x??"
                                            disabled={!district}
                                        />
                                    </div>
                                    <div className="setting-row">
                                        <label className="row-title" htmlFor="street">T??a nh??, t??n ???????ng: </label>
                                        <input
                                            type="text" className="form-control"
                                            id="street" name="street_name"
                                            placeholder="T??a nh??, T??n ???????ng..."
                                            value={street} onChange={e => setStreet(e.target.value)}
                                        />
                                    </div>
                                    <div className="setting-row--checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isDefault}
                                            onChange={() => setIsDefault(!isDefault)}
                                        />
                                        <label>?????t l??m m???c ?????nh</label>
                                    </div>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpenUpdate(false)} className="btn btn--cancel">
                                        H???y
                                    </Button>
                                    <Button onClick={updateAddress} className="btn btn--confirm">
                                        C???p nh???t
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

    if (token) {
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
    } else {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }
}

export default Address;
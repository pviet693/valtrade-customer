import SlideNav from "../components/SlideNav";
import { useContext, useState } from "react";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Calendar } from 'primereact/calendar';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import api from "../utils/backend-api.utils";
import cookie from "cookie";
import { DataContext } from "../store/GlobalState";
import * as common from './../utils/common';

const Profile = (props) => {
    const { state, dispatch, toast, swal } = useContext(DataContext);
    const { auth } = state;
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
        defaultValues: {
            name: props.profile.name,
            phone: props.profile.phone,
            email: props.profile.email,
            gender: props.profile.gender,
            birthday: props.profile.birthday ? new Date(props.profile.birthday) : null,
        }
    });

    const [avatar, setAvatar] = useState(props.profile.avatar.url || "");
    const [editEmail, setEditEmail] = useState(getValues('email') ? false : true);
    const [editPhone, setEditPhone] = useState(getValues('phone') ? false : true);

    const currentYear = (new Date()).getFullYear();
    const pastYear = currentYear - 100;

    const updateProfile = async (data) => {
        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })

        try {
            let body;
            if (editEmail && editPhone) {
                body = {
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    gender: data.gender,
                    birthday: new Date(data.birthday).toISOString()
                }
            } else if (editEmail) {
                body = {
                    name: data.name,
                    email: data.email,
                    gender: data.gender,
                    birthday: new Date(data.birthday).toISOString()
                }
            } else if (editPhone) {
                body = {
                    name: data.name,
                    phone: data.phone,
                    gender: data.gender,
                    birthday: new Date(data.birthday).toISOString()
                }
            } else {
                body = {
                    name: data.name,
                    gender: data.gender,
                    birthday: new Date(data.birthday).toISOString()
                }
            }

            const res = await api.buyer.updateProfile(body);

            if (res.data.code === 200) {
                swal.close();
                common.ToastPrime("Th??nh c??ng", "C???p nh???t th??nh c??ng.", "success", toast);

                getProfile();
            } else {
                swal.close();
                common.ToastPrime("L???i", res.data.message, "error", toast);
            }
        } catch (error) {
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const uploadFile = async (event) => {
        event.preventDefault();

        swal.fire({
            willOpen: () => {
                swal.showLoading();
            },
        })

        try {
            const file = event.target.files[0];
            let formData = new FormData();
            formData.append("image", file);

            const res = await api.buyer.updateAvatar(formData);
            if (res.data.code === 200) {
                const result = res.data.result;
                dispatch({
                    type: 'AUTH', payload: {
                        token: auth.token,
                        user: {
                            ...auth.user,
                            imageUrl: result
                        }
                    }
                });

                getProfile();

                swal.close();
                common.ToastPrime("Th??nh c??ng", "C???p nh???t th??nh c??ng.", "success", toast);
            } else {
                swal.close();
                common.ToastPrime("L???i", res.data.message, "error", toast);
            }
        } catch (error) {
            swal.close();
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    const getProfile = async () => {
        try {
            const res = await api.buyer.getProfile();
            if (res.data.code === 200) {
                const information = res.data.information;
                dispatch({
                    type: 'AUTH', payload: {
                        user: res.data.information
                    }
                });

                setValue("name", information.name || "");
                setValue("phone", information.phone || "");
                setValue("email", information.email || "");
                setValue("gender", information.gender || "");
                setValue("birthday", new Date(information.birthday) || "");

                setAvatar(information.imageUrl.url || "");
                setEditEmail(information.email ? false : true);
                setEditPhone(information.phone ? false : true);
            } else {
                common.ToastPrime("L???i", res.data.message, "error", toast);
            }
        } catch (error) {
            common.ToastPrime("L???i", error, "error", toast);
        }
    }

    return (
        <>
            <Head>
                <title>H??? s?? c???a t??i</title>
            </Head>
            <div className="profile">
                <div className="container">
                    <div className="d-flex">
                        <SlideNav />
                        <div className="profile-edit">
                            <div className="profile-edit-title">Th??ng tin c?? nh??n</div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-8">
                                    <form onSubmit={handleSubmit(updateProfile)}>
                                        <div className="form-group row my-3">
                                            <label htmlFor="name" className="col-sm-3 col-form-label">H??? v?? t??n</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="name"
                                                    className="form-control"
                                                    id="name"
                                                    placeholder="Nh???p h??? v?? t??n"
                                                    {...register('name', { required: "T??n kh??ng ???????c tr???ng." })}
                                                />
                                                {errors && errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="phone" className="col-sm-3 col-form-label">S??? ??i???n tho???i</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="phone"
                                                    className="form-control" id="phone"
                                                    placeholder="Nh???p s??? ??i???n tho???i"
                                                    disabled={!editPhone}
                                                    {...register('phone', { required: "S??? ??i???n tho???i kh??ng ???????c tr???ng." })}
                                                />
                                                {errors && errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="email"
                                                    className="form-control" id="email"
                                                    placeholder="Nh???p ?????a ch??? email"
                                                    disabled={!editEmail}
                                                    {...register('email', { required: "Email kh??ng ???????c tr???ng." })}
                                                />
                                                {errors && errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row my-4 align-items-center">
                                            <label htmlFor="gender" className="col-sm-3 col-form-label">Gi???i t??nh</label>
                                            <div className="col-sm-9">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio"
                                                        name="gender" id="male" value="male"
                                                        {...register('gender', { required: "Gi???i t??nh kh??ng ???????c tr???ng." })}
                                                    />
                                                    <label className="form-check-label" htmlFor="male">Nam</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio"
                                                        name="gender" id="female" value="female"
                                                        {...register('gender', { required: "Gi???i t??nh kh??ng ???????c tr???ng." })}
                                                    />
                                                    <label className="form-check-label" htmlFor="female">N???</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio"
                                                        name="gender" id="gay" value="gay"
                                                        {...register('gender', { required: "Gi???i t??nh kh??ng ???????c tr???ng." })}
                                                    />
                                                    <label className="form-check-label" htmlFor="gay">Kh??c</label>
                                                </div>
                                                {errors && errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="birthday" className="col-sm-3 col-form-label">Ng??y sinh</label>
                                            <div className="col-sm-9">
                                                <Calendar id="icon"
                                                    name="birthday"
                                                    {...register('birthday', { required: "Ng??y sinh kh??ng ???????c tr???ng." })}
                                                    showIcon
                                                    dateFormat="dd/mm/yy" mask="99/99/9999"
                                                    placeholder="Ng??y sinh"
                                                    value={getValues('birthday')}
                                                    monthNavigator yearNavigator
                                                    yearRange={`${pastYear}:${currentYear}`}
                                                />
                                                {errors && errors.birthday && <div className="invalid-feedback">{errors.birthday.message}</div>}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-3"></div>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                className="button-save"
                                                startIcon={<SaveIcon />}
                                            >
                                                L??u l???i
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-sm-4 profile-edit-avatar">
                                    <img src={avatar || '/static/avatar2.png'} {...register('avatar')} alt="avatar" />
                                    <input
                                        accept=".png, .jpeg"
                                        id="avatar"
                                        multiple
                                        type="file"
                                        name="avatar"
                                        onChange={uploadFile}
                                    />
                                    <label htmlFor="avatar">
                                        <Button variant="contained" color="primary" component="span" startIcon={<PhotoCamera />} className="button-upload">
                                            Upload
                                        </Button>
                                    </label>
                                    <div>
                                        <div>Dung l?????ng file t???i ??a 1 MB</div>
                                        <div>?????nh d???ng: .JPEG, .PNG</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom" />
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    let token;
    const cookies = ctx.req.headers.cookie;
    token = cookies ? cookie.parse(cookies).access_token : "";
    let profile;

    try {
        const res = await api.buyer.getProfile(token);
        if (res.data.code === 200) {
            const information = res.data.information;
            profile = {
                name: information.name || "",
                phone: information.phone || "",
                email: information.email || "",
                gender: information.gender || "",
                birthday: information.birthday || "",
                avatar: information.imageUrl
            }
        }
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            profile
        }
    }
};

export default Profile;
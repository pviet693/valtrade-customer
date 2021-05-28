import SlideNav from "../components/SlideNav";
import { useState, useContext, useEffect } from "react";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { DataContext } from "../store/GlobalState";
import cookie from "cookie";
import { useRouter } from "next/router";
import Head from 'next/head';
import Moment from 'moment';
import api from './../utils/backend-api.utils';

const Profile = (props) => {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const router = useRouter();
    const [user, setUser] = useState(props.user || {});
    const [hasEmail, setHasEmail] = useState(user.email ? true : false);
    const [hasPhone, setHasPhone] = useState(user.phone ? true : false);

    // useEffect(() => {
    //     if (auth.user) {
    //         const arr = auth.user.birthday ? auth.user.birthday.split("T") : "";
    //         const birthday = arr[0];
    //         setDataUpdate({
    //             name: auth.user.name || "",
    //             phone: auth.user.phone || "",
    //             email: auth.user.email || "",
    //             gender: auth.user.gender || "",
    //             birthday: birthday
    //         });
    //         console.log(dataUpdate);
    //     } else {
    //         const arr = auth.user.birthday ? user.birthday.split("T") : "";
    //         const birthday = arr[0];
    //         setDataUpdate({
    //             name: user.name || "",
    //             phone: user.phone || "",
    //             email: user.email || "",
    //             gender: user.gender || "",
    //             birthday: birthday
    //         });
    //         dispatch({
    //             type: 'AUTH', payload: {
    //                 token: token,
    //                 user: user
    //             }
    //         });
    //     }
    // }, [auth])

    const changeInput = (event) => {
        const { name, value } = event.target;
        setUser({ ...dataUpdate, [name]: value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

    }

    const uploadFile = async (event) => {
        event.preventDefault();
        // const file = event.target.files[0];
        // let formData = new FormData();
        // formData.append("image", file);
        // dispatch({ type: 'LOADING', payload: { loading: true } });
        // const res = await axios.put('https://valtrade-api.herokuapp.com/api/buyer/update-image-profile', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //         'Authorization': `Bearer ${Cookie.get('access_token')}`
        //     }
        // });
        // const result = res.data.result;
        // console.log(result);
        // dispatch({
        //     type: 'AUTH', payload: {
        //         token: auth.token,
        //         user: {
        //             ...auth.user,
        //             imageUrl: result
        //         }
        //     }
        // });
        // dispatch({ type: 'LOADING', payload: {} });
    }

    return (
        <>
            <Head>
                <title>Hồ sơ của tôi</title>
            </Head>
            <div className="profile">
                <div className="container">
                    <div className="d-flex">
                        <SlideNav />
                        <div className="profile-edit">
                            <div className="profile-edit-title">Thông tin cá nhân</div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-8">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group row my-3">
                                            <label htmlFor="name" className="col-sm-3 col-form-label">Họ và tên</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="name" className="form-control" id="name" value={user.name || ""} onChange={changeInput} placeholder="Nhập họ và tên" />
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="phone" className="col-sm-3 col-form-label">Số điện thoại</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="phone" className="form-control" id="phone" value={user.phone} onChange={changeInput} placeholder="Nhập số điện thoại" disabled={true} />
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                                            <div className="col-sm-9">
                                                <input type="text" name="email" className="form-control" id="email" value={user.email} onChange={changeInput} placeholder="Nhập địa chỉ email" disabled={true} />
                                            </div>
                                        </div>
                                        <div className="form-group row my-4 align-items-center">
                                            <label htmlFor="gender" className="col-sm-3 col-form-label">Giới tính</label>
                                            <div className="col-sm-9">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="male" value="male" checked={user.gender === 'male'} onChange={changeInput} />
                                                    <label className="form-check-label" htmlFor="male">Nam</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="female" value="female" checked={user.gender === 'female'} onChange={changeInput} />
                                                    <label className="form-check-label" htmlFor="female">Nữ</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="gender" id="gay" value="gay" checked={'male' === 'gay'} onChange={changeInput} />
                                                    <label className="form-check-label" htmlFor="gay">Khác</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row my-4">
                                            <label htmlFor="birthday" className="col-sm-3 col-form-label">Date</label>
                                            <div className="col-sm-9">
                                                <input className="form-control" type="date" id="birthday" placeholder="Nhập ngày sinh" value={new Date()} onChange={changeInput} name="birthday" id="birthday" />
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
                                                Lưu lại
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-sm-4 profile-edit-avatar">
                                    <img src={'/static/avatar2.png'} alt="avatar" />
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
                                        <div>Dung lượng file tối đa 1 MB</div>
                                        <div>Định dạng: .JPEG, .PNG</div>
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
    let isSignin = false;
    let user = {
        name: "",
        phone: "",
        email: "",
        gender: "",
        birthday: (new Date()).toISOString()
    };
    // check token
    const cookies = ctx.req.headers.cookie;
    let token;
    if (cookies) {
        token = cookie.parse(cookies).access_token;
        isSignin = token ? true : false;
    }

    if (isSignin) {
        try {
            const res = await api.buyer.getProfile(token);
            if (res.data.code === 200) {
                const info = res.data.information;
                user.name = info.name || "";
                user.phone = info.phone || "";
                user.email = info.email || "";
                user.gender = info.gender || "";
                user.birthday = info.birthday ? (new Date(info.birthday)).toISOString() : (new Date()).toISOString();
            }
        } catch (error) {
            console.log(error.message);
        }

        return {
            props: { user }
        }
    } else {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }
};

export default Profile;
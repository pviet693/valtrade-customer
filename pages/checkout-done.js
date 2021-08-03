import Head from 'next/head';
import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import { useRouter } from 'next/router';
import api from './../utils/backend-api.utils';
import * as common from './../utils/common';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from "lodash";
import axios from "axios";

const CheckoutDone = ({ query }) => {
    const router = useRouter();
    const { state, toast } = useContext(DataContext);
    const { auth } = state;
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState(null);
    const [success, setSuccess] = useState(true);

    const verifyReturnUrl = async () => {
        try {
            const response = await axios.post("/api/vnpay_ipn", query);
            if (response.status === 200) {
                if (response.data.RspCode === "00") {
                    setSuccess(true);
                    const responseTransaction = await api.transfer.postTransfer(states);

                    if (response.status !== 200) {
                        common.ToastPrime(
                            "Lỗi",
                            responseTransaction.data.message,
                            "error",
                            toast
                        );
                    }
                } else {
                    setSuccess(false);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            common.ToastPrime(
                "Lỗi",
                error.response ? error.response.data.message : error.message,
                "error",
                toast
            );
        }
    };

    useEffect(() => {
        if (!_.isEmpty(auth)) {
            const { arrayProduct, balance } = query;
            const { user } = auth;
            const { userId } = user;
            setStates({
                onUser: userId,
                onModel: "Buyer",
                typePay: "vnpay",
                arrayProduct: arrayProduct ? JSON.parse(arrayProduct) : [],
                isPay: true,
                balance: Number(balance)
            });

            if (!_.isEmpty(query)) {
                verifyReturnUrl();
            } else {
                setLoading(false);
            }
        }
    }, [auth]);

    useEffect(() => {
        if (!_.isEmpty(query)) {
            if (states) {
                verifyReturnUrl();
            }
        } else {
            setLoading(false);
        }
    }, [states]);

    return (
        <div>
            <Head>
                <title>Kết quả đặt hàng</title>
            </Head>
            <div
                className="register"
                style={{
                    paddingTop: 20
                }}
            >
                <div className="container">
                    <div
                        className="register-content"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            minHeight: 445
                        }}
                    >
                        {loading && <CircularProgress size={24} className='loading' />}
                        {
                            !loading
                            && (
                                <>
                                    <div
                                        style={{
                                            marginBottom: !success ? 0 : -40,
                                            marginTop: 20
                                        }}
                                    >
                                        {success ? "Đặt hàng thành công." : "Đặt hàng thất bại."}
                                    </div>
                                    {
                                        success
                                            ? (
                                                <img src="/static/successful-purchase-bro.svg" width="400" height="400" alt="success" />
                                            ) : (
                                                <img src="/static/feeling-sorry-bro.svg" width="400" height="400" alt="success" />
                                            )
                                    }
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => router.push("/", null, { shallow: true })}
                                    >
                                        Về trang chủ
                                    </button>
                                </>
                            )
                        }
                    </div>
                    <div className="register-footer">
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    const { query } = ctx;

    return {
        props: {
            query
        }
    }
}

export default CheckoutDone;
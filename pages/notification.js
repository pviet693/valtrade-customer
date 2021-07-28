import Head from "next/head";
import SlideNav from "./../components/SlideNav";
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import Router from 'next/router';
import React, { useContext, useEffect, useState } from "react";
import NotificationCard from '../components/Notification'
import Moment from 'moment';
import { DataContext } from "../store/GlobalState";
import _ from "lodash"

function Notification(params) {
    const [lstNotification, setLstNotification] = useState([]);
    const { dispatch, state, socket} = useContext(DataContext);
    const { auth } = state;

    useEffect(async() => {
        try{
            const res = await api.notification.getNotification();
            let notifications = [];
            if (res.status === 200){
                if (res.data.code === 200){
                    res.data.information.map(x=>{
                        let notification = {
                            content: "",
                            time: "",
                        };
                        notification.content = x.content || "";
                        notification.time = Moment(new Date(x.time)).format("DD/MM/yyyy HH:mm:ss A") || "";
                        notifications.push(notification);
                    });
                    setLstNotification(notifications);
                }
            }
        } catch(err){
            console.log(err);
        }
    },[]);

    useEffect(() => {
        if (socket && !_.isEmpty(auth)){
            const {user} = auth
            const { userId } = user;
            socket.on("notification", (res) => {
                if (res.id === userId){
                    const newListNotifiction = [...lstNotification, { content: res.content, time: res.time}];
                    setLstNotification(newListNotifiction);
                } 
            });
        }
    },[socket, auth]);

    return (
        <>
            <Head>
                <title>Thông báo</title>
            </Head>
            <div className="notification__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="notification__content">
                            <div className="notification__content__title">Thông báo</div>
                            <hr />

                            {
                                lstNotification.map(x=>(
                                    <div className="notification-item__container">
                                        <div className="notification-item__content">
                                            <div className="notification-item__row">
                                                <img src="/static/adidas-3-la.jpg" width="60" height="60" />
                                                <div className="notification-content">
                                                    <div className="content">
                                                        {x.content}
                                                    </div>
                                                    <div className="time">
                                                        {x.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>   
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Notification;

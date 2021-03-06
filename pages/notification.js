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
import { v4 as uuidv4 } from "uuid";

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
                        notification.time = common.formatTime(x.time);
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
                if (res.id === userId) {
                    setLstNotification((prevStates) =>
                        prevStates.concat([
                            {
                                content: res.content,
                                time: common.formatTime(res.time)
                            }
                        ])
                    );
                } 
            });
        }
    },[socket, auth]);

    return (
        <>
            <Head>
                <title>Th??ng b??o</title>
            </Head>
            <div className="notification__container">
                <div className="container">
                    <div className="d-flex pb-3">
                        <SlideNav />
                        <div className="notification__content">
                            <div className="notification__content__title">Th??ng ba??o</div>
                            <hr />

                            {
                                lstNotification.map(x=>(
                                    <div className="notification-item__container" key={uuidv4()}>
                                        <div className="notification-item__content">
                                            <div className="notification-item__row">
                                                <img src="/static/bell_notification.svg" width="60" height="60" />
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

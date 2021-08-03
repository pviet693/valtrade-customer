import Link from 'next/link';
import Head from 'next/head';
import * as common from './../utils/common';
import api from './../utils/backend-api.utils';
import { useRouter } from 'next/router';
import { Checkbox } from 'primereact/checkbox';
import { TabMenu } from 'primereact/tabmenu';
import { Paginator } from 'primereact/paginator';
import { useState } from 'react';
import Router from 'next/router';
import { useEffect, useContext } from 'react';
import { DataContext } from '../store/GlobalState';
import { Image } from 'cloudinary-react';
import ArticleCard from '../components/Article';
import parse from 'html-react-parser';
import Moment from 'moment';
Moment.locale('en');

const Article = () => {
    const items = [
        { label: 'MỚI ĐĂNG', icon: 'pi pi-fw pi-home' },
        { label: 'NHIỀU LƯỢT XEM', icon: 'pi pi-arrow-up' },
    ];
    const router = useRouter();
    const { state, dispatch, toast } = useContext(DataContext);
    const [listArticle, setListArticle] = useState([]);

    useEffect(async() =>{
        try{
            const res = await api.article.getList();
            if (res.status ===200){
                if (res.data.code === 200) {
                    let articles = [];
                    let parser = new DOMParser();
                    res.data.result.map(x => {
                        let article = {}; 
                        article.id = x._id || "";
                        article.imageUrl = x.imageUrl.url || "";
                        article.content = parse(x.content, "text/xml") || "";
                        article.title = x.title || "";
                        article.timeCreate = Moment(x.timeCreate).format("DD/MM/yyyy");
                        articles.push(article);
                    });
                    setListArticle(articles);
                }
            }
        } catch(err){
            console.log(err);
        }
    },[]);


    return (
        <>
            <Head>
                <title>
                    Danh sách bài viết
                </title>
            </Head>
            <div className="article">
                <div className="container">
                    <div className="article-content">
                        <div className="content-list">
                            {
                                listArticle.map(article => (
                                    <ArticleCard title={article.title} content={article.content} image={article.imageUrl} timeCreate={article.timeCreate}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Article;
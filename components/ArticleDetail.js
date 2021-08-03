import { useEffect, useState } from "react"
import api from "../utils/backend-api.utils";
import Router from "next/router";
import { v4 as uuid } from "uuid";

const ArticleDetail = ({title, content, timeCreate, id}) => {
    const [lstArticle, setLstArticle] = useState([]);
    useEffect(async() => {
        try{
            const res = await api.article.getList();
            if (res.status === 200){
                let articles = [];
                if (res.data.code === 200){
                    res.data.result.map(x => {
                    let article = {};
                    article.id = id;
                    article.title = x.title || "",
                    article.image = x.imageUrl.url || "";
                    articles.push(article);
                    });
                }
                setLstArticle(articles);
            }
        }catch(err){
            console.log(err);
        }
    },[]);

    return (
        <div className="d-flex"> 
            <div className="article-detail col-md-8">
                <div className="article-detail-title">
                    <h3>{title}</h3>
                </div>
                <div className="article-detail-content">
                    {content}
                </div>
                <div className="article-detail-time">{timeCreate}</div>
            </div>
            <div className="article-list col-md-4">
                <div className="head-article">
                    <h3>Danh sách bài đăng</h3>
                </div>
                {
                    lstArticle.map(article => (
                        <div className="row container-article"
                            onClick={() => {
                                Router.push({
                                    pathname: '/article-detail',
                                    query: { id: article.id },
                                })
                            }}
                            key={uuid()}
                        >
                            <div className="article-image col-md-3">
                                <img src={article.image} alt="" style={{width: '80px', height: '50px'}} />
                            </div>
                            <div className="image-title col-md-9">
                                {article.title}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default ArticleDetail



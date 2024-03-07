// INDEX
let scrollDown = $('.scrollDown');
let articles = $('.articles'), items = $('.items');
let showProducts = 5, showArticles = 3; // 顯示的最新筆數 產品 || 文章
$().ready(function () {
    // Screen Down
    scrollDown.on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: $('.abouts').offset().top - 80 }, 500);
    });
    // Latest Articles
    let artObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `ArticleContent`,
        "QUERYs": `ArticleContent?article_category_id=&count=${showArticles}&page=${current}`,
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(artObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            for (let i = 0; i < res.length; i++) {
                html += `
                <div class="article_card">
                    <a href="./article_page.html?actId=${res[i].id}">
                        <div class="card_img"><img src="${res[i].image_name}"></div>
                        <div class="card_body">
                            <h4>${res[i].title}</h4>
                            <p>${res[i].brief}</p>
                            <h6>${res[i].creation_date}</h6>
                        </div>
                    </a>
                </div>
            `;
            };
            articles.html(html);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });

    // Latest Items
    let itemObj = {
        "Methods": "POST",
        "APIs": URL,
        "CONNECTs": `Product/GetProducts`,
        "QUERYs": "",
        "Counts": "",
        "Sends": {
            "cid1": "",
            "cid2": "",
            "cid3": "",
            "count": showProducts,
            "page": current
        },
    };
    getPageDatas(itemObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            for (let i = 0; i < res.length; i++) {
                html += `
                    <div data-num="${res[i].Id}" class="p_item col-xxl-2 col-xl-3 col-lg-4 col-6">                
                        <div class="p_img">
                            <div class="p-hover"><a class="more" href="./product_detail.html?pdtId=${res[i].Id}">產品細節</a></div>
                            <a href="./product_detail.html?pdtId=${res[i].Id}">
                                <img src="${IMGURL}products/${res[i].Id}/${res[i].Product_Cover}" alt="">
                            </a>
                        </div>
                        <h3>${res[i].Title}</h3>
                        <p class="pice">NTD$ <span>${res[i].Price}</span> </p>
                    </div>
                `;
            };
            items.html(html);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });

});
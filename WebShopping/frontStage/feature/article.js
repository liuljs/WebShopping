// ARTICLES
let articles = $('.articles'), tabs = $('.clsTabs');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
        <div class="article_card">
            <a href="./article_page.html?actId=${data[i].id}">
                <div class="card_img"><img src="${data[i].image_name}"></div>
                <div class="card_body">
                    <h4>${data[i].title}</h4>
                    <p>${data[i].brief}</p>
                    <h6>${data[i].creation_date}</h6>
                </div>
            </a>
        </div>
        `;
    };
    articles.addClass('card_row').html(html);
};
// NOTFOUND
function fails() {
    clsRcd = "notFound", pageRcd = "notFound"; // 設定為 notFound 
    html = "";
    html = `
        <div class="no_result">
            <i class="bi bi-clipboard-x"></i>
            <p>尚未有任何內容</p>
        </div>        
    `;
    articles.removeClass('card_row').html(html);
};
$().ready(function () {
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `ArticleCategory`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    // Classification
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        html = `<li><a href="#" data-num="all">所有文章</a></li>`;
        if (res !== null) {
            for (let i = 0; i < res.length; i++) {
                html += `
                    <li><a href="#" data-num="${res[i].id}">${res[i].name}</a></li>
                `;
            };
        };
        tabs.html(html);
        tabs.find('li').on('click', function (e) {
            e.preventDefault(), e.stopImmediatePropagation();
            $(this).addClass('active').siblings().removeClass('active');
            let clsNum = $(this).find('a').data('num');
            if (clsNum == 'all') {
                clsNum = "";
            };
            // 判斷點擊
            if (clsNum !== clsRcd) {
                pageRcd = ""; // 重置頁碼紀錄
                dataObj = {
                    "Methods": "GET",
                    "APIs": URL,
                    "CONNECTs": `ArticleContent?article_category_id=${clsNum}`,
                    "QUERYs": `ArticleContent?article_category_id=${clsNum}&count=${listSize}&page=${current}`,
                    "Counts": listSize,
                    "Sends": "",
                };
                // 產生第一次的分頁器 (產生以此分類為主的所有筆數)
                getTotalPages(dataObj).then(res => {
                    pageLens = res; // 目前總頁數
                    paginations.find('ul').html(curPage(current, pageLens, pageCount));
                    // 點擊頁碼
                    paginations.unbind('click').on('click', 'li', function (e) {
                        e.preventDefault(), e.stopImmediatePropagation();
                        let num = $(this).find('a').data('num');
                        if (isNaN(num)) {
                            if (!$(this).hasClass("disabled")) {
                                if (num == "prev") {
                                    pageRcd--;
                                } else if (num == "next") {
                                    pageRcd++;
                                };
                                // 1. 產生分頁器
                                paginations.find('ul').html(curPage(pageRcd, pageLens, pageCount));
                                pageRcd = pageRcd // 紀錄當下頁碼
                                // 2. 取得點擊頁碼後要呈現的內容
                                dataObj.QUERYs = `ArticleContent?article_category_id=${clsRcd}&count=${listSize}&page=${pageRcd}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                getPageDatas(dataObj).then(res => {
                                    // DOSOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        fails();
                                    };
                                    $('html,body').scrollTop(0);
                                }, rej => {
                                    if (rej == "NOTFOUND") { };
                                });
                            };
                        } else {
                            if (clsNum !== clsRcd) {
                                paginations.find('ul').html(curPage(current, pageLens, pageCount));
                                clsRcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                dataObj.QUERYs = `ArticleContent?article_category_id=${clsRcd}&count=${listSize}&page=${current}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                getPageDatas(dataObj).then(res => {
                                    // DOSOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        fails();
                                    };
                                }, rej => {
                                    if (rej == "NOTFOUND") {
                                        fails();
                                    };
                                });
                            } else {
                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                    // 1. 產生分頁器
                                    paginations.find('ul').html(curPage(num, pageLens, pageCount));
                                    pageRcd = num // 記錄當下頁碼
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    dataObj.QUERYs = `ArticleContent?article_category_id=${clsNum}&count=${listSize}&page=${num}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                    getPageDatas(dataObj).then(res => {
                                        // DOSOMETHING
                                        if (res !== null) {
                                            process(res);
                                        } else {
                                            fails();
                                        };
                                        $('html,body').scrollTop(0);
                                    }, rej => {
                                        if (rej == "NOTFOUND") {
                                            fails();
                                        };
                                    });
                                } else { };
                            }
                        };
                    });
                    paginations.find('ul li:first-child').trigger('click');
                }, rej => {
                    if (rej == "NOTFOUND") {
                        fails();
                    };
                });
            } else { };
        });
        tabs.find('li').eq(0).trigger('click');
    });
});
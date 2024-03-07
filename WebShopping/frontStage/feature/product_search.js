// ALBUMS
let products = $('.products'), resultTitles = $('.resultTitles');
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="p_item">
                <div class="p_img">
                    <div class="p-hover"><a class="more" href="./product_detail.html?pdtId=${data[i].Id}">產品細節</a></div>
                    <a href="./product_detail.html?pdtId=${data[i].Id}"><img src="${IMGURL}products/${data[i].Id}/${data[i].Product_Cover}" alt=""></a>
                </div>
                <h3>${data[i].Title}</h3>
                <p class="pice">NTD$ <span>${data[i].Price}</span> </p>
            </div>
        `;
    };
    products.addClass('products_index').html(html);
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
    products.removeClass('products_index').html(html);
};
$().ready(function () {
    //
    if (request('search')) {
        clsRcd = "", clsNum = "", pageRcd = "";
        // 呈現搜尋結果
        let key = decodeURI(request('search'));
        resultTitles.html(key)
        dataObj = {
            "Methods": "POST",
            "APIs": URL,
            "CONNECTs": `Product/GetProducts`,
            "QUERYs": "",
            "Counts": listSize,
            "Sends": {
                "keyword": key,
                "cid1": "",
                "cid2": "",
                "cid3": "",
                "count": "",
                "page": current
            },
        };
        // 產生第一次的分頁器 (產生以此分類為主的所有筆數)
        getTotalPages(dataObj).then(res => {
            pageLens = res; // 目前總頁數
            paginations.find('ul').html(curPage(current, pageLens, 3));
            // 點擊頁碼
            paginations.unbind('click').on('click', 'li', function (e) {
                e.preventDefault(), e.stopImmediatePropagation();
                let num = $(this).find('a').data('num');
                let clsNum = key; // 紀錄 KEY 值
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
                        dataObj.Sends.page = pageRcd, dataObj.Sends.count = dataObj.Counts; // 每筆呈現數
                        getPageDatas(dataObj).then(res => {
                            // DO SOMETHING
                            if (res != null) {
                                process(res);
                            } else {
                                fails();
                            };
                            $('html,body').scrollTop(0);
                        });
                    };
                } else {
                    if (clsNum !== clsRcd) {
                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                        clsRcd = clsNum, pageRcd = num; // 紀錄目前分類 || 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.Sends.page = pageRcd, dataObj.Sends.count = dataObj.Counts; // 每筆呈現數
                        getPageDatas(dataObj).then(res => {
                            // DO SOMETHING
                            if (res != null) {
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
                            dataObj.Sends.page = pageRcd, dataObj.Sends.count = dataObj.Counts; // 每筆呈現數
                            getPageDatas(dataObj).then(res => {
                                // DO SOMETHING
                                if (res != null) {
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
    };
});
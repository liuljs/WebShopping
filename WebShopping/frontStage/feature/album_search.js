// ALBUMS
let albums = $('.albums'), resultTitles = $('.resultTitles');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="albumn_item">
                <a href="./album_page.html?abmId=${data[i].id}">
                    <div class="a_img">
                        <img src="${data[i].image_name}" alt="">
                    </div>
                    <h4>${data[i].title}</h4>
                    <p>${data[i].brief}</p>
                    <h6>${data[i].creation_date.split(' ')[0]}</h6>
                </a>
            </div>        
        `;
    };
    albums.addClass('albumn_item_out').html(html);
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
    albums.removeClass('albumn_item_out').html(html);
};
$().ready(function () {
    //
    if (request('search')) {
        clsRcd = "", clsNum = "", pageRcd = "";
        // 呈現搜尋結果
        let key = decodeURI(request('search'));
        resultTitles.html(key)
        dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `LightingContent?Lighting_category_id=${clsNum}`,
            "QUERYs": `LightingContent?Lighting_category_id=${clsNum}&keyword=${key}&count=${listSize}&page=${current}`,
            "Counts": listSize,
            "Sends": "",
        };
        // 產生第一次的分頁器 (產生以此分類為主的所有筆數)
        getTotalPages(dataObj).then(res => {
            pageLens = res; // 目前總頁數
            paginations.find('ul').html(curPage(current, pageLens, 3));
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
                        dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsRcd}&count=${listSize}&page=${pageRcd}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                        getPageDatas(dataObj).then(res => {
                            // DO SOMETHING
                            process(res);
                            $('html,body').scrollTop(0);
                        });
                    };
                } else {
                    if (clsNum !== clsRcd) {
                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                        clsRcd = clsNum, pageRcd = num; // 紀錄目前分類 || 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsRcd}&keyword=${key}&count=${listSize}&page=${num}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                        getPageDatas(dataObj).then(res => {
                            // DO SOMETHING
                            process(res);
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
                            dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsNum}&keyword=${key}&count=${listSize}&page=${num}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                            getPageDatas(dataObj).then(res => {
                                // DO SOMETHING
                                process(res);
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
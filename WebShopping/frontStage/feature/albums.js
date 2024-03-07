// ALBUMS
let albums = $('.albums'), tabs = $('.clsTabs');
let btnSearchName = $('.btnSearchName'), keyNames = $('.keyNames'), resultTitles = $('.resultTitles');
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
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `LightingCategory`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(dataObj).then(res => {
        //
        html = `<li><a href="#" data-num="all">所有點燈資訊</a></li>`;
        if (res !== null) {
            for (let i = 0; i < res.length; i++) {
                html += `
                    <li><a href="#" data-num="${res[i].id}">${res[i].name}</a></li>
                `;
            };
        };
        tabs.html(html);
        //
        tabs.find('li').on('click', function (e) {
            e.preventDefault();
            $(this).addClass('active'), $(this).siblings().removeClass('active');
            // 搜尋結果
            if (resultTitles.html() !== "") {
                resultTitles.html(""), keyNames.val('');
            };
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
                    "CONNECTs": `LightingContent?Lighting_category_id=${clsNum}`,
                    "QUERYs": `LightingContent?Lighting_category_id=${clsNum}&count=${listSize}&page=${current}`,
                    "Counts": listSize,
                    "Sends": "",
                };
                // 產生第一次的分頁器 (產生以此分類為主的所有筆數)
                getTotalPages(dataObj).then(res => {
                    if (res !== 0) {
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
                                    dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsRcd}&count=${listSize}&page=${pageRcd}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
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
                                    clsRcd = clsNum, pageRcd = current; // 紀錄目前分類 || 記錄當下頁碼
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsRcd}&count=${listSize}&page=${current}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
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
                                        dataObj.QUERYs = `LightingContent?Lighting_category_id=${clsNum}&count=${listSize}&page=${num}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                        getPageDatas(dataObj).then(res => {
                                            // DO SOMETHING
                                            if (res !== null) {
                                                process(res);
                                            } else {
                                                fails();
                                            }
                                            $('html,body').scrollTop(0);
                                        }, rej => {
                                            if (rej == "NOTFOUND") {
                                                fails();
                                            };
                                        });
                                    } else { };
                                };
                            };
                        });
                        paginations.find('ul li:first-child').trigger('click');
                    } else {
                        fails();
                    }
                }, rej => {
                    if (rej == "NOTFOUND") {
                        fails();
                    };
                });
            } else { };
        });
        tabs.find('li').eq(0).trigger('click');
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
    // SEARCH
    btnSearchName.on('click', function () {
        if (keyNames.val() !== "") {
            // 搜尋 Title
            let key = decodeURI(keyNames.val());
            // 搜尋結果
            resultTitles.html(`搜尋結果：<span>${key}</span>`);
            clsRcd = "", pageRcd = ""; // 使用搜尋，清空目前記錄的篩選
            dataObj = {
                "Methods": "GET",
                "APIs": URL,
                "CONNECTs": `LightingContent?keyword=${key}`,
                "QUERYs": `LightingContent?keyword=${key}&count=${listSize}&page=${current}`,
                "Counts": listSize,
                "Sends": "",
            };
            // 清除點擊痕跡
            $('.clsTabs').find('li').removeClass('active');
            //
            getTotalPages(dataObj).then(res => {
                if (res !== 0) {
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
                                dataObj.QUERYs = `LightingContent?keyword=${key}&count=${listSize}&page=${pageRcd}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
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
                            if (key !== clsRcd) {
                                paginations.find('ul').html(curPage(current, pageLens, pageCount));
                                clsRcd = key, pageRcd = current; // 紀錄目前分類 || 記錄當下頁碼
                                // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                dataObj.QUERYs = `LightingContent?keyword=${key}&count=${listSize}&page=${current}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                getPageDatas(dataObj).then(res => {
                                    // DOSOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        fails();
                                    }
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
                                    dataObj.QUERYs = `LightingContent?keyword=${key}&count=${listSize}&page=${num}`; // 條件：以此分類為主且目前點擊的頁碼要呈現的內容
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
                                        if (res !== null) {
                                            process(res);
                                        } else {
                                            fails();
                                        }
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
                } else {
                    clsRcd = key;
                    fails();
                };
            }, rej => {
                if (rej == "NOTFOUND") {
                    fails();
                };
            });
        } else {
            alert("請輸入正確名稱或關鍵字！");
        };
    });
    keyNames.on('change', function (e) {
        e.preventDefault();
        if ($(this).val() == "") {
            // 搜尋結果
            resultTitles.html("");
            // 當使用搜尋功能值為空時，會顯示全部
            $('.clsTabs').find('li').eq(0).trigger('click');
        };
    });
});
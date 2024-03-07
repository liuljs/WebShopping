// PRODUCTS
let products = $('.products');
// 分類
let firstCls = $('.firstCls');// Category 宣告第一層分類層
let secondItems, secondItem, thirdItems, thirdItem, arrow;
// 
let clsFirstRcd, clsSecondRcd, clsThirdRcd;
// 
let dataObj = {
    "Methods": "POST",
    "APIs": URL,
    "CONNECTs": `Product/GetProducts`,
    "QUERYs": "",
    "Counts": listSize,
    "Sends": {
        "keyword": "",
        "cid1": "",
        "cid2": "",
        "cid3": "",
        "count": "",
        "page": ""
    },
};
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="p_item">
                <div class="p_img">
                    <div class="p-hover"><a class="more" href="./product_detail.html?pdtId=${data[i].Id}">產品細節</a></div>
                    <a href="./product_detail.html?pdtId=${data[i].Id}"><img src="${IMGURL}products/${data[i].Id}/${data[i].Product_Cover}" alt=""></a>
                </div>
                <h3>${data[i].Title}</h3>
                <p class="pice">NTD$ <span>${thousands(data[i].Price)}</span> </p>
            </div>
        `;
    };
    products.addClass('products_index').html(html);
};
// NOTFOUND
function fails() {
    // clsRcd = "notFound", pageRcd = "notFound"; // 設定為 notFound 
    html = "";
    html = `
        <div class="no_result">
            <i class="bi bi-clipboard-x"></i>
            <p>尚未有任何內容</p>
        </div>        
    `;
    products.removeClass('products_index').html(html);
    paginations.find('ul').html('').html(curPage(current, pageLens, pageCount));
};

$().ready(function () {
    //
    let clsObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `Category`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    // Classification
    getPageDatas(clsObj).then(res => {
        // 全部
        html = `
            <div class="accordion-item side_menu_out">
                <h2 class="accordion-header">
                    <button data-num="all" class="accordion-button collapsed first_item" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAll" aria-expanded="true" aria-controls="collapseAll">
                        所有聖物
                    </button>
                </h2>
            </div>
            <div id="collapseAll" class="accordion-collapse collapse" data-bs-parent="#accordionExample" style=""></div>        
        `;
        for (let i = 0; i < res.length; i++) {
            //
            if (res[i].SubCategories.length !== 0) {
                secondItem = "";
                for (let j = 0; j < res[i].SubCategories.length; j++) {
                    if (res[i].SubCategories[j].SubCategories.length !== 0) {
                        thirdItem = "";
                        for (let k = 0; k < res[i].SubCategories[j].SubCategories.length; k++) {
                            thirdItem += `
                                <li data-num="${res[i].SubCategories[j].SubCategories[k].Id}" class="third_item"><a href="#">${res[i].SubCategories[j].SubCategories[k].Name}</a></li>
                            `;
                        };
                        thirdItems = `
                            <ul data-second="${res[i].SubCategories[j].Id}" id="${res[i].SubCategories[j].Id}" class="sub_menu thirdCls accordion-collapse collapse" data-bs-parent="#accordionExample">
                               ${thirdItem}
                            </ul>
                        `;

                    } else {
                        thirdItems = "";
                    };
                    secondItem += `
                        <li data-num="${res[i].SubCategories[j].Id}" class="second_item"><a href="#">${res[i].SubCategories[j].Name}</a></li>
                        ${thirdItems}
                    `;
                };
                secondItems = `
                    <div id="collapse${res[i].Id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <ul data-first="${res[i].Id}" class="secondCls">
                                ${secondItem}
                            </ul> 
                        </div>
                    </div>
                `;
            } else {
                secondItems = `<div id="collapse${res[i].Id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample"></div>`;
            }
            html += `
                <div class="accordion-item side_menu_out">
                    <h2 class="accordion-header">
                        <button data-num="${res[i].Id}" class="accordion-button collapsed first_item" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${res[i].Id}" aria-expanded="true" aria-controls="collapse${res[i].Id}">
                            ${res[i].Name}
                        </button>
                    </h2>
                    ${secondItems}
                </div>
            `;
        };
        firstCls.html(html);
        // FIRST
        $('.first_item').on('click', function (e) {
            e.preventDefault();
            // 取得第一層（當前）
            let clsNum = $(this).data('num');
            $('.first_item').removeClass('active'), $(this).addClass('active');
            // 依點擊的第一層分類下去做篩選，並取得總筆數 (清除第二、第三層的取值)
            if (clsNum == "all") {
                clsFirstRcd = "", clsSecondRcd = "", clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            } else {
                clsFirstRcd = clsNum, clsSecondRcd = "", clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls1Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                pageRcd = ""; // 重置頁碼紀錄
                getTotalPages(dataObj).then(res => {
                    if (res !== 0) {
                        pageLens = res; // 目前總頁數
                        paginations.find('ul').html(curPage(current, pageLens, pageCount));
                        // 點擊頁碼
                        paginations.unbind('click').on('click', 'li', function (e) {
                            e.preventDefault(), e.stopImmediatePropagation();
                            let num = $(this).find('a').data('num');
                            dataObj.Sends.count = dataObj.Counts; // 每次列出筆數
                            if (isNaN(num)) {
                                if (!$(this).hasClass("disabled")) {
                                    if (num == "prev") {
                                        pageRcd--;
                                    } else if (num == "next") {
                                        pageRcd++;
                                    };
                                    // 1. 產生分頁器
                                    paginations.find('ul').html(curPage(pageRcd, pageLens, pageCount));
                                    // 2. 取得點擊頁碼後要呈現的內容
                                    pageRcd = pageRcd, dataObj.Sends.page = pageRcd; // 紀錄當下頁碼 || 上下頁：以記錄的頁碼來做拋接值
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
                                if (clsNum !== cls1Rcd) {
                                    paginations.find('ul').html(curPage(current, pageLens, pageCount));
                                    cls1Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                    cls2Rcd = "", cls3Rcd = "" // 重設已記錄第二層、第三層
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    dataObj.Sends.page = current; // 傳送的頁碼
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
                                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                        pageRcd = num, dataObj.Sends.page = num // 記錄當下頁碼 || 傳送的頁碼
                                        getPageDatas(dataObj).then(res => {
                                            // DO SOMETHING
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
                    } else {
                        cls1Rcd = clsNum; // 紀錄主分類
                        fails();
                    }
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
                // 清除第二層分類的點選狀態
                $('.second_item').removeClass('active');
                // 清除第三層分類的點選狀態
                $('.third_item').removeClass('active');
            } else { };
        });
        // SECOND
        $('.second_item').on('click', function (e) {
            e.preventDefault();
            // 取得第二層（當前）
            let clsNum = $(this).data('num');
            // 取隸屬的第一層
            let clsFirst = Number($(this).parents('.secondCls').data('first'));
            if (!$(`.first_item[data-num="${clsFirst}"]`).hasClass('active')) {
                // 隸屬的第一層必須為點擊狀態 (active)
                $('.first_item').removeClass('active'), $(`.first_item[data-num="${clsFirst}"]`).addClass('active');
                // 須將記錄記為隸屬的第一層
                cls1Rcd = clsFirst;
            };
            // 是否展開第三層分類
            if ($(`.thirdCls[data-second="${clsNum}"] li`).length !== 0) {
                if ($(this).hasClass('active')) {
                    $(`.thirdCls[data-second="${clsNum}"]`).slideToggle('normal')
                } else {
                    $(`.thirdCls[data-second="${clsNum}"]`).slideDown('normal');
                };
            };
            // 清除其餘第二層的選擇狀態
            $('.secondCls').find('.second_item').removeClass('active'), $(this).addClass('active');
            if (clsNum) {
                clsFirstRcd = cls1Rcd, clsSecondRcd = clsNum, clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls2Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                pageRcd = ""; // 重置頁碼紀錄
                getTotalPages(dataObj).then(res => {
                    if (res !== 0) {
                        console.log(res)
                        pageLens = res; // 目前總頁數
                        paginations.find('ul').html(curPage(current, pageLens, pageCount));
                        // 點擊頁碼
                        paginations.unbind('click').on('click', 'li', function (e) {
                            e.preventDefault(), e.stopImmediatePropagation();
                            let num = $(this).find('a').data('num');
                            dataObj.Sends.count = dataObj.Counts; // 每次列出筆數
                            if (isNaN(num)) {
                                if (!$(this).hasClass("disabled")) {
                                    if (num == "prev") {
                                        pageRcd--;
                                    } else if (num == "next") {
                                        pageRcd++;
                                    };
                                    // 1. 產生分頁器
                                    paginations.find('ul').html(curPage(pageRcd, pageLens, pageCount));
                                    // 2. 取得點擊頁碼後要呈現的內容
                                    pageRcd = pageRcd, dataObj.Sends.page = pageRcd; // 紀錄當下頁碼 || 上下頁：以記錄的頁碼來做拋接值
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
                                if (clsNum !== cls2Rcd) {
                                    paginations.find('ul').html(curPage(current, pageLens, pageCount));
                                    cls2Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                    cls3Rcd = "" // 重設已記錄第三層
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    dataObj.Sends.page = current; // 傳送的頁碼
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
                                        if (res !== null) {
                                            process(res);
                                        } else {
                                            fails();
                                        };
                                    }, rej => {
                                        if (rej == "NOTFOUND") { };
                                    });
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        // 1. 產生分頁器
                                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                        pageRcd = num, dataObj.Sends.page = num  // 記錄當下頁碼 || 傳送的頁碼
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
                                    } else { };
                                }
                            };
                        });
                        paginations.find('ul li:first-child').trigger('click');
                    } else {
                        cls2Rcd = clsNum; // 紀錄次分類
                        fails();
                    };
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
            } else { };
        });
        // THIRD
        $('.third_item').on('click', function (e) {
            e.preventDefault();
            // 取得第三層（當前）
            let clsNum = $(this).data('num');
            // 取隸屬的第一層
            let clsFirst = Number($(this).parents('.secondCls').data('first'));
            // 取隸屬的第二層
            let clsSecond = Number($(this).parents('.thirdCls').data('second'));
            if (!$(`.first_item[data-num="${clsFirst}"]`).hasClass('active')) {
                // 隸屬的第一層 必須為點擊狀態 (active)
                $('.first_item').removeClass('active'), $(`.first_item[data-num="${clsFirst}"]`).addClass('active');
                // 須將記錄記為隸屬的第一層
                cls1Rcd = clsFirst;
                // 隸屬的第二層 必須為點擊狀態 (active)
                $('.second_item').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                $(`.second_item[data-num="${clsSecond}"]`).addClass('active');
                // 須將記錄記為隸屬的第二層
                cls2Rcd = clsSecond;
            } else {
                // 隸屬的第二層的 Id　必須為點擊狀態 (active)
                $('.second_item').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                $(`.second_item[data-num="${clsSecond}"]`).addClass('active');
                // 須將記錄記為隸屬的第二層 Id
                cls2Rcd = clsSecond;
            };
            // 清除其餘第三層的選擇狀態
            $('.third_item').removeClass('active'), $(this).addClass('active');
            if (clsNum) {
                clsFirstRcd = cls1Rcd, clsSecondRcd = cls2Rcd, clsThirdRcd = clsNum;
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls3Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                pageRcd = ""; // 重置頁碼紀錄
                getTotalPages(dataObj).then(res => {
                    if (res !== 0) {
                        pageLens = res; // 目前總頁數
                        paginations.find('ul').html(curPage(current, pageLens, 3));
                        // 點擊頁碼
                        paginations.unbind('click').on('click', 'li', function (e) {
                            e.preventDefault(), e.stopImmediatePropagation();
                            let num = $(this).find('a').data('num');
                            dataObj.Sends.count = dataObj.Counts; // 每次列出筆數
                            if (isNaN(num)) {
                                if (!$(this).hasClass("disabled")) {
                                    if (num == "prev") {
                                        pageRcd--;
                                    } else if (num == "next") {
                                        pageRcd++;
                                    };
                                    // 1. 產生分頁器
                                    paginations.find('ul').html(curPage(pageRcd, pageLens, pageCount));
                                    // 2. 取得點擊頁碼後要呈現的內容
                                    pageRcd = pageRcd, dataObj.Sends.page = pageRcd; // 紀錄當下頁碼 || 上下頁：以記錄的頁碼來做拋接值
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
                                if (clsNum !== cls3Rcd) {
                                    paginations.find('ul').html(curPage(current, pageLens, pageCount));
                                    cls3Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    dataObj.Sends.page = current; // 傳送的頁碼
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
                                        if (res !== null) {
                                            process(res);
                                        } else {
                                            fails();
                                        };
                                    }, rej => {
                                        if (rej == "NOTFOUND") { };
                                    });
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        // 1. 產生分頁器
                                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                        pageRcd = num, dataObj.Sends.page = num  // 記錄當下頁碼 || 傳送的頁碼
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
                                    } else { };
                                }
                            };
                        });
                        paginations.find('ul li:first-child').trigger('click');
                    } else {
                        cls3Rcd = clsNum; // 記錄子分類
                        fails();
                    };
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
            } else { };
        });
        // 預設點擊全部商品 || 點擊紀錄的第一層分類
        firstCls.find(`.first_item`).eq(0).trigger('click');
    });
});
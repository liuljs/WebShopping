// 宣告要帶入的欄位
let subOrderNav = $('.subOrderNav');
let orderLiz = subOrderNav.find('ul li a'), clsNum, pdtSearchs = $('.pdtSearchs'), btnSearch = $('.btnSearch');
let lists = $('.lists'), edits = $('.edits');
let stockName = $('.stockName'), stocks = $('.stocks');
let spec, status, sells, price;
let dataArr = new Array(), orgArr = new Array();

CONNECT = "ProductAdmin/GetProducts";
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        // 停售
        if (data[i].Sell_Stop == 0) {
            sells = `
                <div class="btnThirds">
                <span class="item_sell">${data[i].stock_qty}</span>
                <a class="btnThird btnStock" href="#" data-toggle="modal" data-target="#stockdrop">［庫存］</a>
            </div>
        `;
        } else {
            sells = `<span class="text-danger">停售</span>`;
        }
        // 狀態
        if (data[i].Enabled == 0) {
            status = `<span class="text-gray">未上架</span>`;
        } else {
            status = `<span class="text-success">已上架</span>`;
        }
        html += `
            <tr data-num="${data[i].Id}">
                <td data-title="商品編號">${data[i].Id}</td>
                <td data-title="商品名稱" class="item_name"><span class="abridged2">${data[i].Title}</span></td>
                <td data-title="商品定價" class="text-right pr-4"><span class="priceMark">${thousands(data[i].Price)}</span></td>
                <td data-title="商品總數量" class="text-right pr-4">${thousands(sells)}</td>
                <td data-title="售出總數量" class="text-right pr-4">${thousands(data[i].sell_qty)}</td>
                <td data-title="狀態" class="text-center">${status}</td>
                <td data-title="功能"><div class="setupBlock"></div></td>
            </tr>   
        `;
    };
    lists.html(html);
    // 顯示新增、編輯功能
    if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
        lists.find('.setupBlock').append(`
            <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a> 
        `);
        // edits.find('.setupBlock').append(`
        //     <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        // `);
        // // 編輯庫存狀態
        // $(document).on('click', '.btnEditStock', function (e) {
        //     e.preventDefault(), e.stopPropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件
        //     let trz = $(this).parents('.modal-content'); // 宣告當下欄位
        //     if ($(this)) {
        //         trz.find('.inputStatus').prop('disabled', false); // 啟用欄位的編輯
        //         // 1.新增一個判斷更動與否的class 2.動態產生 儲存、刪除
        //         trz.find('.modal-footer .setupBlock').html('').append(`
        //             <a class="btn btn-success btnSave" href="#"><i class="far fa-edit"></i> 儲存</a>
        //             <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
        //         `);
        //     };
        //     // Save 當點擊編輯按鈕後，動態產生儲存按鈕
        //     trz.find('.btnSave').on('click', function (e) {
        //         let num = trz.find('.stocks');
        //         e.preventDefault(), e.stopImmediatePropagation();  // 取消捕獲 Capture 事件、取消 a 預設事件
        //         if (confirm("您確定要進行庫存規格的狀態修改嗎？")) {
        //             dataArr = [];
        //             for (let i = 0; i < orgArr.length; i++) {
        //                 let dataObj = {
        //                     "Id": orgArr[i].Id,
        //                     "Spu_Id": orgArr[i].Spu_Id,
        //                     "Title": orgArr[i].Title,
        //                     "Sell_Price": orgArr[i].Sell_Price,
        //                     "Enabled": num.find('.edit_status').eq(i).val(),
        //                     "Safety_Stock_Qty": orgArr[i].Safety_Stock_Qty,
        //                     "Discount_Percent": orgArr[i].Discount_Percent,
        //                     "Discount_Price": orgArr[i].Discount_Price
        //                 }
        //                 dataArr.push(dataObj);
        //             };
        //             let xhr = new XMLHttpRequest();
        //             xhr.onload = function () {
        //                 if (xhr.status == 200 || xhr.status == 204) {
        //                     if ($(this)) {
        //                         alert('修改狀態成功！');
        //                         location.reload();
        //                         // 轉為編輯按鈕
        //                         trz.find('.modal-footer .setupBlock').html('').append(`
        //                             <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        //                         `);
        //                         // 權限欄位的禁用、啟用
        //                         trz.find('.inputStatus').prop('disabled', true);
        //                     };
        //                 } else {
        //                     alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
        //                     // getLogout();
        //                 };
        //             };
        //             xhr.open('PUT', `${URL}SpecAdmin/${num}`, true);
        //             xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        //             xhr.send(JSON.stringify(dataArr));
        //         };
        //     });
        //     // cancel 
        //     trz.find('.btnCancel').on('click', function (e) {
        //         e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件

        //         if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
        //             // 還原欄位原本資料
        //             for (let i = 0; i < trz.find('tr .edit_status').length; i++) {
        //                 trz.find('tr .edit_status').eq(i).val(orgArr[i].Enabled);
        //                 if (trz.find('tr .edit_status').eq(i).val() == "1") {
        //                     trz.find('tr .edit_status').eq(i).prop('checked', true);
        //                 } else {
        //                     trz.find('tr .edit_status').eq(i).prop('checked', false);
        //                 };
        //             };
        //             // 轉為編輯按鈕
        //             trz.find('.modal-footer .setupBlock').html('').append(`
        //                 <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        //             `);
        //             // 權限欄位的禁用、啟用
        //             trz.find('.inputStatus').prop('disabled', true);

        //             // Close
        //             trz.find('.close').unbind('click').on('click', function (e) {
        //                 e.preventDefault(), e.stopImmediatePropagation(); // 取消 a 預設事件 // 取消捕獲 Capture 事件
        //                 // 轉為編輯按鈕
        //                 trz.find('.modal-footer .setupBlock').html('').append(`
        //                     <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        //                 `);
        //                 // 權限欄位的禁用、啟用
        //                 trz.find('.inputStatus').prop('disabled', true);

        //                 trz.find('.closez').trigger('click');
        //             });
        //         };
        //     });
        //     trz.find('.close').unbind('click').on('click', function (e) {
        //         e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件
        //         if (confirm("尚未儲存更改的內容，確定要關閉嗎？")) {
        //             // 轉為編輯按鈕
        //             trz.find('.modal-footer .setupBlock').html('').append(`
        //                 <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        //             `);
        //             // 權限欄位的禁用、啟用
        //             trz.find('.inputStatus').prop('disabled', true);

        //             trz.find('.closez').trigger('click');
        //         };
        //     });
        // });
    };
    // 顯示刪除功能
    if (menuAuth[authParent.indexOf("PM")].ACT_DEL == "Y") {
        lists.find('.setupBlock').append(`
            <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
        `);
        // Delete 刪除
        $('.btnDel').on('click', function (e) {
            e.preventDefault(); // 取消 a 預設事件
            let num = $(this).parents('tr').data('num');
            console.log(num)
            let dataObj = {
                "id": num
            };
            if (confirm("您確定要刪除這項商品嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert('刪除商品成功！');
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    };
                };
                xhr.open('DELETE', `${URL}ProductAdmin/${num}`, true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        });
    };
    // Stock 庫存
    $(document).on('click', '.btnStock', function () {
        let trz = $(this).parents('tr');
        let num = trz.data('num');
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                    let callBackData = JSON.parse(xhr.responseText);
                    console.log(callBackData)
                    // 商品名稱
                    stockName.html(trz.find('.item_name span').text());
                    stocks.attr('data-num', callBackData[0].Spu_Id);
                    //
                    html = '';
                    for (let i = 0; i < callBackData.length; i++) {
                        // Orig
                        // let dataObj = {
                        //     "Id": callBackData[i].Id,
                        //     "Spu_Id": callBackData[i].Spu_Id,
                        //     "Title": callBackData[i].Title,
                        //     "Sell_Price": callBackData[i].Sell_Price,
                        //     "Enabled": callBackData[i].Enabled,
                        //     "Safety_Stock_Qty": callBackData[i].Safety_Stock_Qty,
                        //     "Discount_Percent": callBackData[i].Discount_Percent,
                        //     "Discount_Price": callBackData[i].Discount_Price
                        // };
                        // orgArr.push(dataObj);
                        // Price
                        if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== 0) {
                            price = `
                                <div class="prices">
                                    <span class="orig priceMark"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                    <span class="disc priceMark">${thousands(callBackData[i].Discount_Price)}</span>
                                </div>
                            `;
                        } else {
                            price = `
                                <div class="prices">
                                    <span class="disc priceMark">${thousands(callBackData[i].Sell_Price)}</span>
                                </div>
                            `;
                        };
                        html += `
                            <tr data-num="${callBackData[i].Id}">
                                <td data-title="規格名稱" class="specName"><span class="abridged1">${callBackData[i].Title}</span></td>
                                <td data-title="商品售價" class="text-right">${price}</td>
                                <td data-title="商品數量" class="text-right">
                                    <span>${thousands(callBackData[i].Start_Stock_Qty)}</span>
                                </td>
                                <td data-title="售出數量" class="text-right">
                                    <span>${thousands(callBackData[i].Sell_Qty)}</span>
                                </td>
                                <td data-title="庫存數量" class="text-right">
                                    <span>${thousands(callBackData[i].Stock_Qty)}</span>
                                </td>
                            </tr>
                        `;
                    };
                    stocks.html(html);
                    // 各個規格的狀態
                    let chk = $('.edit_status');
                    for (let i = 0; i < chk.length; i++) {
                        if (chk.eq(i).val() == "1") {
                            chk.eq(i).prop('checked', true);
                        } else {
                            chk.eq(i).prop('checked', false);
                        };
                    };
                    // 各個規格的狀態控制
                    chk.on('change', function () {
                        if ($(this).prop('checked') == true) {
                            $(this).val("1");
                        } else {
                            $(this).val("0");
                        }
                    });
                } else { };
            } else {
                // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                getLogout();
            };
        };
        xhr.open('GET', `${URL}SpecAdmin/GetAll/${num}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);

        // Close
        edits.find('.close').unbind('click').on('click', function (e) {
            e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件、取消 a 預設事件
            let trz = $(this).parents('.modal-content');
            // 轉為編輯按鈕
            // trz.find('.modal-footer .setupBlock').html('').append(`
            //     <a class="btn btn-warning btnEditStock" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
            // `);
            // 權限欄位的禁用、啟用
            trz.find('.inputStatus').prop('disabled', true);

            trz.find('.closez').trigger('click');
        });
    });
    // Edit 編輯
    $(document).on('click', '.btnEdit', function (e) {
        e.preventDefault();
        if (idz) {
            // 點擊編輯後，將要編輯的商品編號儲存於瀏覽器（LocalStorage 或 SessionStorage）
            let itemNum = $(this).parents('tr').data('num');
            localStorage.setItem("itemNum", itemNum);
            let numz = localStorage.getItem("itemNum");
            if (numz) { // 確認有將商品編號存入 Storage
                location.href = "./itemsedit.html"; // 跳轉至編輯頁面
            };
        };
    });
};
// NOTFOUND
function fails() {
    // 分頁數
    mainLens = 1;
    pageLens = Math.ceil(mainLens / listSize);
    html = "";
    html = `
        <tr class="none">
            <td colspan="7" class="none">
                <span>目前沒有任何的商品。</span>
            </td>
        </tr> 
    `;
    lists.html(html);
    clsRcd = clsNum;
    paginations.find('div').html(curPage(current, pageLens, pageCount));
};
function notSearchs() {
    pageLens = 1; // 沒有搜尋到訂單，頁數呈現為 1 頁
    html = "";
    html = `
        <tr class="none">
            <td colspan="7" class="none">
                <span>沒有搜尋到此商品<a href="#" class="text-primary mx-1 btnBack">( 返回 )</a>！</span>
            </td>
        </tr> 
    `;
    lists.html(html);
    paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
    $('html,body').scrollTop(0);
    // 返回
    $('.btnBack').on('click', function (e) {
        e.preventDefault();
        pdtSearchs.val(''); // 清除搜尋的欄位
        orderLiz.eq(0).trigger('click'); // 回到全部
    });
};
// 驗證
$().ready(function () {
    // 顯示新增、編輯功能
    if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
        $('.pdtAdd').html('').append(`
            <a class="btn btn-primary" href="./itemsshow.html" role="button"><i class="far fa-plus-circle"></i> 新增商品</a>
        `);
    };
    // MainFilter
    let dataObj = {
        "Methods": "POST",
        "APIs": URL,
        "CONNECTs": CONNECT,
        "QUERYs": "",
        "Counts": listSize,
        "Sends": {
            // "keyword": "",
            // "cond": "1",
            // "count": "",
            "page": current
        },
    };
    orderLiz.on('click', function (e) {
        e.preventDefault();
        orderLiz.removeClass('active'), $(this).addClass('active');
        let clsNum = $(this).data("num");
        // 如果搜尋BAR有值
        if (pdtSearchs.val() !== "") {
            pdtSearchs.val('');
        };
        if (clsNum == "all") {
            dataObj.Sends = { "page": current };
        } else {
            dataObj.Sends = {
                // "keyword": "",
                "cond": clsNum,
                // "count": "",
                "page": current
            };
        };
        // 判斷點擊時
        if (clsNum !== clsRcd) {
            pageRcd = ""; // 重置頁碼紀錄
            getTotalPages(dataObj).then(res => {
                pageLens = res; // 目前總頁數
                paginations.find('div').html(curPage(current, pageLens, 3));
                // 點擊頁碼
                paginations.unbind('click').on('click', 'li', function (e) {
                    e.preventDefault(), e.stopImmediatePropagation();
                    let num = $(this).find('a').data('num');
                    dataObj.Sends["count"] = dataObj.Counts; // 每次列出筆數
                    if (isNaN(num)) {
                        if (!$(this).hasClass("disabled")) {
                            if (num == "prev") {
                                pageRcd--;
                            } else if (num == "next") {
                                pageRcd++;
                            };
                            // 1. 產生分頁器
                            paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
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
                                if (rej == "NOTFOUND") {
                                    getLogout();
                                };
                            });
                        };
                    } else {
                        if (clsNum !== clsRcd) {
                            paginations.find('ul').html(curPage(current, pageLens, pageCount));
                            clsRcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                            // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                            getPageDatas(dataObj).then(res => {
                                // DO SOMETHING
                                if (res !== null) {
                                    process(res);
                                } else {
                                    fails();
                                };
                            }, rej => {
                                if (rej == "NOTFOUND") {
                                    getLogout();
                                };
                            });
                        } else {
                            if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                // 1. 產生分頁器
                                paginations.find('div').html(curPage(num, pageLens, pageCount));
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
                                        getLogout();
                                    };
                                });
                            } else { };
                        }
                    };
                });
                paginations.find('div li:first-child').trigger('click');
            }, rej => {
                if (rej == "NOTFOUND") {
                    // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            });
        } else { };
    });
    orderLiz.eq(0).trigger('click');
    // Searchs
    btnSearch.on('click', function (e) {
        e.preventDefault();
        if (pdtSearchs.val() !== "") { // 檢查是不是數字，如果 true 的話，則為編號查詢
            if (NumberRegExp.test(pdtSearchs.val())) {
                dataObj.Sends = {
                    "id": pdtSearchs.val(),
                    // "cond": "1",
                    // "count": listSize,
                    "page": current
                };
            } else {
                dataObj.Sends = {
                    "keyword": pdtSearchs.val(),
                    // "cond": "1",
                    // "count": listSize,
                    "page": current
                };
            };
            clsRcd = "", pageRcd = ""; // 使用搜尋，清空目前記錄的篩選 && 每次使用都要清除頁碼紀錄
            getTotalPages(dataObj).then(res => {
                console.log(res)
                pageLens = res; // 目前總頁數
                paginations.find('div').html(curPage(current, pageLens, 3));
                // 點擊頁碼
                paginations.unbind('click').on('click', 'li', function (e) {
                    e.preventDefault(), e.stopImmediatePropagation();
                    let num = $(this).find('a').data('num');
                    dataObj.Sends["count"] = dataObj.Counts; // 每次列出筆數
                    if (isNaN(num)) {
                        if (!$(this).hasClass("disabled")) {
                            if (num == "prev") {
                                pageRcd--;
                            } else if (num == "next") {
                                pageRcd++;
                            };
                            // 1. 產生分頁器
                            paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                            // 2. 取得點擊頁碼後要呈現的內容
                            pageRcd = pageRcd, dataObj.Sends.page = pageRcd; // 紀錄當下頁碼 || 上下頁：以記錄的頁碼來做拋接值
                            getPageDatas(dataObj).then(res => {
                                // DO SOMETHING
                                if (res !== null) {
                                    process(res);
                                } else {
                                    notSearchs();
                                };
                                $('html,body').scrollTop(0);
                            }, rej => {
                                if (rej == "NOTFOUND") {
                                    getLogout();
                                };
                            });
                        };
                    } else {
                        if (clsNum !== clsRcd) {
                            paginations.find('ul').html(curPage(current, pageLens, pageCount));
                            clsRcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                            // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                            getPageDatas(dataObj).then(res => {
                                // DO SOMETHING
                                if (res !== null) {
                                    process(res);
                                } else {
                                    notSearchs();
                                };
                            }, rej => {
                                if (rej == "NOTFOUND") {
                                    getLogout();
                                };
                            });
                        } else {
                            if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                // 1. 產生分頁器
                                paginations.find('div').html(curPage(num, pageLens, pageCount));
                                // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                pageRcd = num, dataObj.Sends.page = num // 記錄當下頁碼 || 傳送的頁碼
                                getPageDatas(dataObj).then(res => {
                                    // DO SOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        notSearchs();
                                    };
                                    $('html,body').scrollTop(0);
                                }, rej => {
                                    if (rej == "NOTFOUND") {
                                        getLogout();
                                    };
                                });
                            } else { };
                        }
                    };
                });
                paginations.find('div li:first-child').trigger('click');
            }, rej => {
                if (rej == "NOTFOUND") {
                    // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            });

        } else {
            alert("請輸入商品名稱或編號！");
        };
    });
    pdtSearchs.on('change', function (e) {
        e.preventDefault();
        if ($(this).val() == "") {
            // 當使用搜尋功能值為空時，會顯示全部
            clsRcd == "";
            orderLiz.eq(0).trigger('click');
        }
    });
});
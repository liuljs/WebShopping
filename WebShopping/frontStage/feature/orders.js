// ORDERS
let lists = $('.lists');
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <tr>
                <td>
                    <div class="main" data-title="訂單號碼">
                        <p class="">${data[i].Id}</p>
                    </div>
                </td>
                <td>
                    <span class="date" data-title="日期時間">
                    ${data[i].Purchase_Date}
                    </span>
                </td>
                <td>
                    <div class="state" data-title="訂單狀態">
                        <p data-num="${data[i].Order_Status_Id}">${data[i].Order_Status}</p>
                    </div>
                </td>
                <td>
                    <span class="sub_total" data-title="訂單金額">${thousands(parseInt(Number(data[i].Order_Total) + Number(data[i].Delivery_Fee)))}</span>
                </td>
                <td>
                    <a class="more" data-title="功能" href="./oder_history.html?odrId=${data[i].Id}">查看訂單</a>
                </td>
            </tr>
        `;
    }
    lists.html(html);
};
// NOTFOUND
function fails() {
    pageRcd = "notFound"; // 設定為 notFound
    html = "";
    html = `
        <div class="no_result">
            <i class="bi bi-clipboard-x"></i>
            <p>您尚未有任何購買紀錄</p>
        </div>
    `;
    lists.html(html);
};
$().ready(function () {
    //
    let dataObj = {
        "Methods": "POST",
        "APIs": URL,
        "CONNECTs": `Orders/GetOrders`,
        "QUERYs": "",
        "Counts": listSize,
        "Sends": {
            // "id": "",
            // "order_status_id": "",
            // "startDate": "",
            // "endDate": "",
            "count": "",
            "page": current
        },
    };
    getTotalPages(dataObj).then(res => {
        if (res !== 0) {
            pageLens = res;
            paginations.find('ul').html(curPage(current, res, pageCount));

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
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.Sends.page = pageRcd, dataObj.Sends.count = dataObj.Counts;
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
                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                        // 1. 產生分頁器
                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                        pageRcd = num // 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.Sends.page = num, dataObj.Sends.count = dataObj.Counts;
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
                };
            });
            paginations.find('ul li:first-child').trigger('click');
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    });
});
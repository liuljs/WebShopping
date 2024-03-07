// 宣告要帶入的欄位
let articles = $('.articles');
CONNECT = "ArticleContent";
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <tr>
                <td data-title="編號" class="edit_num" data-num="${data[i].id}">${i + 1}</td>
                <td data-title="日期">${data[i].creation_date.split(' ')[0]}</td>
                <td data-title="標題"><p class="mb-0 abridged1">${data[i].title}</p></td>
                <td data-title="類別" class="text-center"><p class="mb-0 classify">${data[i].article_category_id}</p></td>
                <td data-title="狀態" class="text-center"><span class="news_status" data-status="${data[i].Enabled}">${data[i].Enabled}</span></td>
                <td data-title="設定">
                    <div class="setupBlock">
                        <a class="btn btn-warning btn-sm btnEdit" href="#"><i class="far fa-edit"></i> 編輯</a> 
                        <a class="btn btn-danger btn-sm btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
                    </div>
                </td>
            </tr>
        `;
    };
    articles.html(html);
    // 顯示狀態
    let chk = $('.news_status');
    for (let i = 0; i < chk.length; i++) {
        if (chk.eq(i).html() == "1") {
            chk.eq(i).html('<span class="text-success">開啟</span>');
        } else {
            chk.eq(i).html('<span class="text-danger">關閉</span>');
        };
    };
    // Edit
    $('.btnEdit').on('click', function (e) {
        e.preventDefault();
        if (idz) {
            // 點擊編輯後，將要編輯的編號儲存於瀏覽器（LocalStorage 或 SessionStorage）
            let atsNum = $(this).parents('tr').find('.edit_num').data('num');
            localStorage.setItem("atsNum", atsNum);
            let numz = localStorage.getItem("atsNum");
            if (numz) { // 確認有將消息編號存入 Storage
                location.href = "./articleedit.html"; // 跳轉至編輯頁面
            };
        };
    });
    // Delete
    $('.btnDel').on('click', function (e) {
        e.preventDefault(); // 取消 a 預設事件
        let num = $(this).parents('tr').find('.edit_num').data('num'); // 取得要刪除的
        if (confirm("您確定要刪除這則文章嗎？")) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200 || xhr.status == 204) {
                    alert('刪除文章成功！');
                    location.reload();
                } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                };
            };
            xhr.open('DELETE', `${URL}${CONNECT}/${num}`, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(null);
        };
    });
};
// NOTFOUND
function fails() {
    html = "";
    html = `
        <tr class="none">
            <td colspan="6" class="txt-left none">
                <span>目前沒有任何的文章。</span>
            </td>
        </tr>
    `;
    articles.html(html);
    paginations.find('div').html(curPage(current, pageLens, pageCount));
};
$().ready(function () {
    // 清除 localStorag 中可能留著的 atsNum
    if (localStorage.getItem('atsNum')) {
        localStorage.removeItem('atsNum');
    };
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": CONNECT,
        "QUERYs": `${CONNECT}?count=${listSize}&page=${pageRcd}`,
        "Counts": listSize,
        "Sends": "",
    };
    // 產生第一次的分頁器
    getTotalPages(dataObj).then(res => {
        pageLens = res;
        paginations.find('div').html(curPage(current, res, 3));
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
                    paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                    pageRcd = pageRcd // 紀錄當下頁碼
                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                    dataObj.QUERYs = `${CONNECT}?count=${listSize}&page=${pageRcd}`;
                    getPageDatas(dataObj).then(res => {
                        // DO SOMETHING
                        if (res !== null) {
                            process(res);
                        } else {
                            fails();
                        };
                        $('html,body').scrollTop(0);
                    });
                };
            } else {
                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                    // 1. 產生分頁器
                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                    pageRcd = num // 記錄當下頁碼
                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                    dataObj.QUERYs = `${CONNECT}?count=${listSize}&page=${num}`;
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
        paginations.find('div li:first-child').trigger('click');
    }, rej => {
        if (rej == "NOTFOUND") {
            pageLens = 0; // 資料筆數為 0 頁數為 0
            fails();
        };
    });
});
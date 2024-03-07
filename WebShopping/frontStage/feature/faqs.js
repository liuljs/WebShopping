// FAQS
let faqs = $('.faqs');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="article_card">
                <a href="./faq_page.html?faqId=${data[i].id}">
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
    faqs.html(html);
};
// NOTFOUND
function fails() { };
$().ready(function () {
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `KnowledgeContent`,
        "QUERYs": `KnowledgeContent?count=${listSize}&page=${pageRcd}`,
        "Counts": listSize,
        "Sends": "",
    };
    // 產生第一次的分頁器
    getTotalPages(dataObj).then(res => {
        if (res !== null) {
            pageLens = res;
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
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `KnowledgeContent?count=${listSize}&page=${pageRcd}`;
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
                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                        // 1. 產生分頁器
                        paginations.find('ul').html(curPage(num, pageLens, pageCount));
                        pageRcd = num // 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `KnowledgeContent?count=${listSize}&page=${num}`;
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
                    } else { };
                };
            });
            paginations.find('ul li:first-child').trigger('click');
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});
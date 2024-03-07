// FAQ
let faqs = $('.faqs');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="accordion-item side_menu_out">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#One${data[i].id}" aria-expanded="true" aria-controls="One">
                        ${data[i].Question}
                    </button>
                </h2>
                <div id="One${data[i].id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <p>${data[i].Answer}</p>
                    </div>
                </div>
            </div>          
        `;
    };
    faqs.html(html);
    // 預設開啟第一個 FAQ
    // $('.faqs .accordion-button').eq(0).trigger('click');
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // FAQ
    let dataObj = {
        "Methods": "GET", // 方法
        "APIs": URL, // API
        "CONNECTs": "QA", // CONNECT
        "QUERYs": "",
        "Sends": "", // 傳送篩選的條件物件(1. 預設傳送條件為顯示第一頁 2. GET 方法可 Null)
        "Counts": "" // 頁面顯示筆數
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});
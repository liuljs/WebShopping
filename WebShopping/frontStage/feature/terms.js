// Terms
let terms = $('#editorz');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    // TATTOO
    html = quill.setContents(JSON.parse(data[0].Content).ops);
    terms.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };

$().ready(function () {
    // Terms
    let dataObj = {
        "Methods": "GET", // 方法
        "APIs": URL, // API
        "CONNECTs": "Terms", // CONNECT
        "QUERYs": "",
        "Sends": "", // 傳送篩選的條件物件(1. 預設傳送條件為顯示第一頁 2. GET 方法可 Null)
        "Counts": "" // 頁面顯示筆數
    };
    getPageDatas(dataObj).then(res => {
        console.log(res)
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
// FAQS DETAIL
let fas = $('#editorz');
let titles = $('.titles'), dates = $('.dates');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    // FAQS DETAIL
    titles.html('').html(data.title);
    dates.html('').html(data.creation_date);
    html = quill.setContents(JSON.parse(data.content).ops);
    fas.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // 從 localStorage 取編號，用於呼叫資訊
    // let num = localStorage.getItem('productNum');
    let num = request('faqId');
    if (num) {
        // FAQS DETAIL
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `KnowledgeContent/${num}`,
            "QUERYs": "",
            "Sends": "",
            "Counts": "",
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
    };
});
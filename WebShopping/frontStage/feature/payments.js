// PAYMENTS
let totalPayment = $('.payments'), paymentEndDate = $('.paymentEndDate');
let bankName = $('.bankName'), bankCode = $('.bankCode'), bankAcc = $('.bankAcc'), payType = $('.payType');
// 倒數計時器 EndDate Timer
let dateInfo = $('.date_info');
let endDateTimer = $('.paymentTiming'), dayz = $('.dayz'), hourz = $('.hourz'), minutez = $('.minutez'), secondz = $('.secondz');
// 
function GetTimeRemaining(timez) {
    const Total = Date.parse(timez) - Date.parse(new Date());
    const Seconds = Math.floor((Total / 1000) % 60);
    const Minutes = Math.floor((Total / 1000 / 60) % 60);
    const Hours = Math.floor((Total / (1000 * 60 * 60)) % 24);
    const Days = Math.floor(Total / (1000 * 60 * 60 * 24));
    return {
        Total,
        Seconds,
        Minutes,
        Hours,
        Days
    };
};
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    totalPayment.html(thousands(parseInt(Number(data.Delivery_Fee) + Number(data.Order_Total))));
    if (data.Pay_End_Date !== "") {
        paymentEndDate.html(` 
            <span>${data.Pay_End_Date.split(' ')[0]}</span>
        `);
        // DeadLine
        const DeadLine = data.Pay_End_Date;
        // UpdateClock
        function UpdateClock() {
            const Times = GetTimeRemaining(DeadLine);
            dayz.html(Times.Days);
            hourz.html(('0' + Times.Hours).slice(-2));
            minutez.html(('0' + Times.Minutes).slice(-2));
            secondz.html(('0' + Times.Seconds).slice(-2));
            if (Times.Total <= 0) {
                // clearInterval(timeInterval);
                endDateTimer.html('').html('已到期');
            };
        };
        UpdateClock();
        let timeInterval = setInterval(UpdateClock, 1000);
        // Info
        if (data.Pay_Type_Id == 7) { // 如果是超商代碼，顯示對應的超商圖片
            bankName.find(`.images[data-num="${data.Bank_Name}"]`).addClass('active')
            bankCode.html('-');
        } else {
            bankName.find('.names').html(data.Bank_Name);
            bankCode.html(data.Bank_No);
        };
        bankAcc.html(data.Payment_No.replace(/(\s)/g, '').replace(/(.{4})/g, '$1 ').replace(/\s*$/, ''));
        payType.html(data.Pay_Type);
    } else {
        dateInfo.html('').html('<span>付款失敗</span>');
    };
};
// NOTFOUND
function fails() { };
$().ready(function () {
    if (request('id')) {
        let num = request('id');
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Orders/GetOrder/${num}`,
            "QUERYs": "",
            "Counts": "",
            "Sends": "",
        };
        getPageDatas(dataObj).then(res => {
            // DO SOMETHING
            if (res !== null) {
                process(res);
            } else {
                fails();
            };
        }, rej => {
            if (rej == "NOTFOUND") {
                if (rej == "NOTFOUND") {
                    // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            }
        });
    } else { };
});
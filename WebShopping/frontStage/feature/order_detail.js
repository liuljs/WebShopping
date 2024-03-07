// ORDER DETAIL
let odrAddress = $('.odrAddress'), odrStatus = $('.odrStatus'), odrDevDate = $('.odrDevDate'), odrCell = $('.odrCell'), odrName = $('.odrName'), odrType = $('.odrType'), odrMemo = $('.odrMemo');
let odrControls = $('.odrControls');
let lists = $('.lists');
let subAmts = $('.subAmts'), freeSet = $('.freeSet'), odrFees = $('.odrFees'), odrAmts = $('.odrAmts');
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)

    odrAddress.html(data.Receiver_Address);
    odrStatus.html(data.Order_Status);
    odrDevDate.html(data.Delivery_Date);
    odrCell.html(data.Receiver_Phone);
    odrName.html(data.Receiver_Name);
    odrMemo.html(data.Memo_Customer);
    odrType.html(data.Pay_Type), odrType.data('num', data.Pay_Type_sId);
    // 依訂單狀態決定控制項
    if (data.Order_Status_Id == 11 && data.Pay_Type_sId != "01") {
        // 尚未付款（顯示付款期限、付款訊息、取消訂單）
        odrControls.html('').html(`
            <a href="#" class="more btnCancelOdr">取消訂單</a>
            <a href="#" class="more btnPayInfo">付款資訊</a>
        `);
    }
    else if (data.Order_Status_Id == 11 && data.Pay_Type_sId == "01") {
        // 尚未付款（顯示付款期限、付款訊息、取消訂單）
        odrControls.html('').html(`
            <a href="#" class="more btnCancelOdr">取消訂單</a>
            <a href="#" class="more btnPayments">直接付款</a>
        `);
    }
    else if (data.Order_Status_Id == 13) {
        // 付款失敗（重新付款）
        drControls.html('').html(`
            <a href="#" class="more btnCancelOdr">取消訂單</a>
            <a href="#" class="more btnRePay">重新付款</a>
        `);
    }
    else if (data.Order_Status_Id == 16 || data.Order_Status_Id == 21 || data.Order_Status_Id == 22) {
        // 出貨前（取消訂單，需賣家同意）
        odrControls.html('').append(`<a href="#" class="more btnCancelOdr">取消訂單</a>`);
    }
    else if (data.Order_Status_Id == 23 || data.Order_Status_Id == 31 || data.Order_Status_Id == 32) {
        // 帶出貨-已出貨、運送中-未送達、運送中-已送達、（不會有控制項）
        odrControls.html('');
    }
    else if (data.Order_Status_Id == 41) {
        // 商品送達（申請退貨、完成訂單）
        odrControls.html('').html(`
            <a href="#" class="more btnReturn">申請退貨</a>
            <a href="#" class="more btnComplete">完成訂單</a>
        `);
    }
    else if (data.Order_Status_Id == 12 || data.Order_Status_Id == 14 || data.Order_Status_Id == 15 || data.Order_Status_Id == 42 || data.Order_Status_Id == 52) {
        // 訂單完成、訂單失敗、訂單取消-賣家取消、訂單取消-買家取消（再次購買）
        odrControls.html('');
        // odrControls.html('').html(`
        //     <a href="" class="button-style first btnBuyAgain">再次購買</a>
        // `);
    }
    else if (data.Order_Status_Id == 51) {
        // 取消-待回應
        odrControls.html('');
    }
    else {
        odrControls.html('');
    };

    html = "";
    for (let i = 0; i < data.Items.length; i++) {
        html += `
            <tr>
                <td>
                    <div class="cart_item">
                        <a href="./product_detail.html?pdtId=${data.Items[i].Spu_Id}" class="cart_link">
                            <div class="images">
                                <img src="${IMGURL}products/${data.Items[i].Spu_Id}/${data.Items[i].product_cover}" alt="">
                            </div>
                            <div class="main">
                                <p class="title">${data.Items[i].Sku}</p>
                            </div>
                        </a>
                    </div>
                </td>
                <td>
                    <span class="cart_price" data-title="單價">${thousands(data.Items[i].Price)}</span>
                </td>
                <td>
                    <div class="add" data-title="數量">
                        <input type="text" value="${data.Items[i].quantity}" disabled="disabled">
                    </div>
                </td>
                <td>
                    <span class="sub_total" data-title="小計">${thousands(parseInt(Number(data.Items[i].Price) * Number(data.Items[i].quantity)))}</span>
                </td>
            </tr>
        `;
    };
    lists.html(html);

    if (data.Delivery_Fee !== 0) {
        odrFees.html(data.Delivery_Fee)
    } else {
        freeSet.html('<span>運費</span><span class="notes">免運費</span>');
    }
    subAmts.html(thousands(data.Order_Total)), odrAmts.html(thousands(parseInt(Number(data.Order_Total) + Number(data.Delivery_Fee))));
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // 從 localStorage 取編號，用於呼叫資訊
    // let num = localStorage.getItem('productNum');
    let num = request('odrId');
    if (num) {
        // ORDER DETAIL
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Orders/GetOrder/${num}`,
            "QUERYs": "",
            "Sends": "",
            "Counts": "",
        };
        getPageDatas(dataObj).then(res => {
            // DOSOMETHING
            if (res !== null) {
                process(res);
                // 直接付款
                $('.btnPayments').on('click', function (e) {
                    e.preventDefault();
                    // let num = $(this).parents('tr').data('num');
                    console.log(num)
                    if (confirm("您確定要支付此筆訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    console.log(callBackData)
                                    let invoArr = callBackData.Invoice.split(",");
                                    let invoName = invoArr[1].split(":")[1], invoCode = invoArr[2].split(":")[1];
                                    let total = parseInt(Number(callBackData.Order_Total) + Number(callBackData.Delivery_Fee));
                                    sendOrder(flowObj.MerchantId, flowObj.TerminalId, flowObj.MerchantName, flowObj.RequestUrl, flowObj.ReturnURL, callBackData.Pay_Type_sId, callBackData.Id, total, "商品", callBackData.Memo_Customer, flowObj.Encoding, callBackData.Receiver_Phone, "", callBackData.Receiver_Address, callBackData.Receiver_Email, idz, flowObj.GoBackURL, flowObj.ReceiveURL, flowObj.DeadlineDate, flowObj.RequiredConfirm, flowObj.deferred, invoCode, invoName, flowObj.validateKey);
                                } else { };
                            };
                        };
                        xhr.open('GET', `${URL}Orders/GetOrder/${num}`, true);
                        // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                        xhr.send(null);
                    };
                });
                // 付款訊息
                $('.btnPayInfo').on('click', function (e) {
                    e.preventDefault();
                    // let num = $(this).parents('tr').data('num');
                    if (num) {
                        location.href = `./flow_payments.html?id=${num}`;
                    };
                });
                // 取消訂單
                $('.btnCancelOdr').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要取消訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/CancelOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
                // 重新付款
                $('.btnRePay').on('click', function (e) {
                    e.preventDefault();
                    // let num = $(this).parents('tr').data('num');
                    console.log(num)
                    if (confirm("您要重新支付此筆訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    console.log(callBackData)
                                    let invoArr = callBackData.Invoice.split(",");
                                    let invoName = invoArr[1].split(":")[1], invoCode = invoArr[2].split(":")[1];
                                    let total = parseInt(Number(callBackData.Order_Total) + Number(callBackData.Delivery_Fee));
                                    sendOrder(flowObj.MerchantId, flowObj.TerminalId, flowObj.MerchantName, flowObj.RequestUrl, flowObj.ReturnURL, callBackData.Pay_Type_sId, callBackData.Id, total, "商品", callBackData.Memo_Customer, flowObj.Encoding, callBackData.Receiver_Phone, "", callBackData.Receiver_Address, callBackData.Receiver_Email, idz, flowObj.GoBackURL, flowObj.ReceiveURL, flowObj.DeadlineDate, flowObj.RequiredConfirm, flowObj.deferred, invoCode, invoName, flowObj.validateKey);
                                } else { };
                            };
                        };
                        xhr.open('GET', `${URL}Orders/GetOrder/${num}`, true);
                        // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                        xhr.send(null);
                    };
                });
                // 申請退貨
                $('.btnReturn').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要申請退貨嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/ReturnOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
                // 完成訂單
                $('.btnComplete').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要完成訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/FinishOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
            } else {
                fails();
            };
        }, rej => {
            if (rej == "NOTFOUND") {
                // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                getLogout();
            };
        });
    };
});
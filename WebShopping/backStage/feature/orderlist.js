// 宣告要帶入的欄位
let subOrderNav = $('.subOrderNav');
let orderLiv = subOrderNav.find('ul li a');
let odrSearchs = $('.odrSearchs'), btnSearch = $('.btnSearch'), dateSearch = $('.dateSearch'), startDate = "", endDate = ""; // Condition
let subOrderStatus = $('.subOrderStatus');
let orderLis = subOrderStatus.find('ul li a');
let orders = $('.orders');
let status, endDates, statusId, warms, infos, prices, memoCustomer, memoStore;
// Modal
let ordersDetail = $('#ordersDetail');
let edit_odrName = $('.edit_odrName'), edit_odrCell = $('.edit_odrCell'), edit_twZipCode = $('.edit_twZipCode'), edit_odrAddr = $('.edit_odrAddr'), edit_odrMail = $('.edit_odrMail');
let createDate = $('.createDate'), pay_type = $('.pay_type'), payEndDate = $('.payEndDate'), devEstDate = $('.devEstDate'), edit_recName = $('.edit_recName'), edit_recPhone = $('.edit_recPhone'), delivery_select = $('.delivery_select'), edit_recAddr = $('.edit_recAddr');
let custom_memo = $('.custom_memo'), stores_memo = $('.stores_memo');
let odrStatus_select = $('.odrStatus_select'), statusContent = $('.status-content');
let payment = $('.payment'), subTotal = $('.subTotal'), fee = $('.fee'), totals = $('.totals');

let connect = "OrdersAdmin/GetOrders";
let clsObj = {
    // "id": "",
    // "order_status_id": "",
    // "startDate": "",
    // "endDate": "",
    // "count": "",
    // "page": "1"
};
function init() {
    // Details
    $('.btnOrder').on('click', function () {
        // 顯示編輯功能
        if (menuAuth[authParent.indexOf("OM")].ACT_EDT == "Y") {

        };
        // 
        let num = $(this).parents('tr').data("num");
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                if (xhr.responseText !== "") {
                    let callBackData = JSON.parse(xhr.responseText);
                    // Order Info
                    ordersDetail.find('.odr-num').text(callBackData.Id);
                    edit_odrName.val(callBackData.Name);
                    edit_odrCell.val(callBackData.Phone);
                    // 購買人地址 // 台灣地址 下拉式選單
                    $(".twZipCode").twzipcode({
                        zipcodeIntoDistrict: true, // 郵遞區號自動顯示在地區
                        css: ["addReceiptCity odrEdit custom-select", "addReceiptTown odrEdit custom-select"], // 自訂 "城市"、"地區" class 名稱 
                        countyName: "city", // 自訂城市 select 標籤的 name 值
                        districtName: "town" // 自訂地區 select 標籤的 name 值
                    });
                    // Set Address
                    if (callBackData.Address !== "") {
                        let addrArr = JSON.parse(callBackData.Address);
                        $('.twZipCode').twzipcode('set', {
                            'zipcode': addrArr[0],
                            'county': addrArr[1],
                            'district': addrArr[2]
                        });
                        $('.edit_odrAddr').val(addrArr[3]);
                    };
                    $('.addReceiptCity,.addReceiptTown').prop('disabled', true); // 鎖定
                    edit_odrMail.val(callBackData.Account);
                    createDate.val(callBackData.Purchase_Date);
                    pay_type.val(callBackData.Pay_Type);
                    if (callBackData.Pay_Type_Id !== 1) {
                        payEndDate.val(callBackData.Pay_End_Date);
                    } else {
                        payEndDate.val('即時付款');
                    };
                    devEstDate.val(callBackData.Delivery_Date.split(' ')[0]);
                    edit_recName.val(callBackData.Receiver_Name);
                    edit_recPhone.val(callBackData.Receiver_Phone);
                    delivery_select.val(callBackData.Delivery_Type_Id);
                    edit_recAddr.val(callBackData.Receiver_Address);
                    // Memo
                    if (callBackData.Memo_Customer !== "" && callBackData.Memo_Customer !== null) {
                        custom_memo.html(callBackData.Memo_Customer);
                    } else {
                        custom_memo.html(`<span> - </span>`);
                    };
                    // Order Status
                    odrStatus_select.val(callBackData.Order_Status_Id);
                    // 訂單狀態顯示
                    if (callBackData.Order_Status_Id == 11) {
                        if (callBackData.Pay_Type_sId == "01") {
                            warms = `<span class="active">買家尚未付款（即時付款）。</span>`;
                        } else {
                            warms = `<span class="active">買家尚未付款（需在 <span>${callBackData.Pay_End_Date}</span> 前）。</span>`;
                            endDates = callBackData.Pay_End_Date.split(' ')[0]; // 付款期限
                        };
                        status = "";
                        status = `
                            <div class="d-flex">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="toBeShip" id="inlineRadio1" value="11" disabled>
                                    <label class="form-check-label" for="inlineRadio1">未付款</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="toBeShip" id="inlineRadio2" value="16" disabled>
                                    <label class="form-check-label" for="inlineRadio2">已付款</label>
                                </div>
                            </div>
                            <div class="warm-content">
                                ${warms}
                            </div>
                        `;
                        statusContent.html(status);
                    } else if (callBackData.Order_Status_Id == 21 || callBackData.Order_Status_Id == 22 || callBackData.Order_Status_Id == 23) {
                        status = "";
                        status = `
                            <div class="d-flex">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="toBeShip" id="inlineRadio3" value="21" disabled>
                                    <label class="form-check-label" for="inlineRadio3">未出貨</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="toBeShip" id="inlineRadio4" value="22" disabled>
                                    <label class="form-check-label" for="inlineRadio4">備貨中</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="toBeShip" id="inlineRadio5" value="23" disabled>
                                    <label class="form-check-label" for="inlineRadio5">已出貨</label>
                                </div>
                            </div>
                            <div class="warm-content">
                                <span class="active">為了避免延遲出貨，請在備貨時程內（通常為下訂後 3 天內）出貨。</span>
                            </div>
                        `;
                        statusContent.html(status);
                        // 預設選取狀態為當前狀態
                        $(`input[name="toBeShip"][value="${callBackData.Order_Status_Id}"]`).prop('checked', true);
                    } else if (callBackData.Order_Status_Id == 31 || callBackData.Order_Status_Id == 32) {
                        status = "";
                        status = `
                            <div class="d-flex">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="shipment" id="inlineRadio6" value="31" disabled>
                                    <label class="form-check-label" for="inlineRadio6">未送達</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="shipment" id="inlineRadio7" value="32" disabled>
                                    <label class="form-check-label" for="inlineRadio7">已送達</label>
                                </div>
                            </div>
                            <div class="warm-content">
                                <span class="active">
                                    預估送達時間：<span>${callBackData.Arrival_Date.split('T')[0]}</span>
                                    <div class="check-content">
                                        <span>實際送達時間：依使用的配送方式及實際情況而決定（可通過物流追蹤運送狀況）。</span>
                                    </div>
                                </span>
                            </div>
                        `;
                        statusContent.html(status);
                        // 預設選取狀態為當前狀態
                        $(`input[name="shipment"][value="${callBackData.Order_Status_Id}"]`).prop('checked', true);
                    } else if (callBackData.Order_Status_Id == 41) {
                        status = "";
                        status = `
                            <div class="d-flex">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderCompleted" id="inlineRadio8" value="41" disabled>
                                    <label class="form-check-label" for="inlineRadio8">未取貨</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderCompleted" id="inlineRadio9" value="42" disabled>
                                    <label class="form-check-label" for="inlineRadio9">已取貨</label>
                                </div>
                            </div>
                            <div class="warm-content">
                                <span class="active">
                                    <div class="check-content">
                                        <span>實際取貨時間：依買家回饋情況決定。</span>
                                    </div>
                                </span>
                            </div>
                        `;
                        statusContent.html(status);
                        // 預設選取狀態為當前狀態
                        $(`input[name="orderCompleted"][value="${callBackData.Order_Status_Id}"]`).prop('checked', true);
                    } else if (callBackData.Order_Status_Id == 42) {
                        status = "";
                        status = `
                            <div class="d-flex"></div>
                            <div class="warm-content">
                                <span class="active">消費者已成功收到商品。</span>
                            </div>
                        `;
                        statusContent.html(status);
                    } else if (callBackData.Order_Status_Id == 51) {
                        status = "";
                        status = `
                            <div class="d-flex">
                            <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderCancel" id="inlineRadio11" value="51" disabled>
                                    <label class="form-check-label" for="inlineRadio11">待回應</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderCancel" id="inlineRadio12" value="52" disabled>
                                    <label class="form-check-label" for="inlineRadio12">已回應</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderCancel" id="inlineRadio13" value="16" disabled>
                                    <label class="form-check-label" for="inlineRadio13">訂單已出貨</label>
                                </div>
                            </div>
                            <div class="warm-content"></div>
                        `;
                        statusContent.html(status);
                        // 預設選取狀態為當前狀態
                        $(`input[name="orderCancel"][value="${callBackData.Order_Status_Id}"]`).prop('checked', true);
                        // 如果在備貨中買家取消的話
                        let warmContent = $('.warm-content');
                        warms = "";
                        warms = `
                            <span class="active">
                                買家取消，賣家尚未確認。
                                <div class="check-content">
                                    <span>您可以與買家聯絡，確認訂單的出貨狀態，以決定後續的處理。</span>
                                </div>
                            </span>
                        `;
                        warmContent.html(warms);
                    } else if (callBackData.Order_Status_Id == 52) {
                        status = "";
                        status = `
                            <div class="d-flex"></div>
                            <div class="warm-content">
                                <span class="active">
                                    賣家已確認，此筆訂單已成功取消。
                                </span>
                            </div>
                        `;
                        statusContent.html(status);
                    } else if (callBackData.Order_Status_Id == 61) {
                        status = "";
                        status = `
                            <div class="d-flex">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderReturn" id="inlineRadio14" value="61" disabled>
                                    <label class="form-check-label" for="inlineRadio14">未退款</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input inputStatus odrStatus" type="radio" name="orderReturn" id="inlineRadio15" value="62" disabled>
                                    <label class="form-check-label" for="inlineRadio15">已退款</label>
                                </div>
                            </div>
                        `;
                        statusContent.html(status);
                        // 預設選取狀態為當前狀態
                        $(`input[name="orderReturn"][value="${callBackData.Order_Status_Id}"]`).prop('checked', true);
                    } else if (callBackData.Order_Status_Id == 62) {
                        status = "";
                        status = `
                            <div class="d-flex"></div>
                            <div class="warm-content">
                                <span class="active">
                                    賣家已退款，此筆訂單已成功退貨。
                                </span>
                            </div>
                        `;
                        statusContent.html(status);
                    };
                    // 訂單狀態修改
                    statusId = odrStatus_select.val(); // 訂單狀態預設為原本從資料庫渲染的狀態
                    $('.odrStatus').on('change', function () {
                        statusId = $(this).val(); // 如果有做狀態修改的話，會改動原記錄的狀態
                    });
                    if (callBackData.Memo_Store !== "" && callBackData.Memo_Store !== null) {
                        stores_memo.val(callBackData.Memo_Store);
                    } else {
                        stores_memo.val("");
                    };
                    // Items Info
                    html = "";
                    for (let i = 0; i < callBackData.Order_Detail.length; i++) {
                        prices = "";
                        if (callBackData.Order_Detail[i].Discount !== undefined && callBackData.Order_Detail[i].Discount !== null && callBackData.Order_Detail[i].Discount !== "" && callBackData.Order_Detail[i].Discount !== 0) {
                            prices = `
                                <div class="prices">
                                    <span class="priceMark orig"><s>${callBackData.Order_Detail[i].Price}</s></span>
                                    <span class="priceMark disc">${callBackData.Order_Detail[i].Discount}</span>
                                </div>
                            `;
                        } else {
                            prices = `
                                <div class="prices">
                                    <span class="priceMark disc">${callBackData.Order_Detail[i].Price}</span>
                                </div>
                            `;
                        };
                        html += `
                            <tr>
                                <td data-title="商品名稱">
                                    <div class="order-title">
                                        <span class="title abridged1" data-num="${callBackData.Order_Detail[i].Id}">${callBackData.Order_Detail[i].Spu}</span>
                                        <span class="subTitle abridged1" data-num="${callBackData.Order_Detail[i].Sku_Id}">${callBackData.Order_Detail[i].Sku}</span>
                                    </div>
                                </td>
                                <td width="15%" data-title="數量" class="text-right">${thousands(callBackData.Order_Detail[i].Quantity)}</td>
                                <td width="15%" data-title="商品金額" class="text-right">
                            `+
                            prices
                            + `
                                </td>
                            </tr>
                        `;
                    };
                    payment.html(html);
                    subTotal.html(callBackData.Order_Total);
                    if (callBackData.Delivery_Fee == 0) {
                        fee.html(`<span class="text-danger"> 免運費 </span>`);
                    } else {
                        fee.html(`<span class="priceMark">${callBackData.Delivery_Fee}</span>`);
                    };
                    totals.html(parseInt(Number(callBackData.Order_Total) + Number(callBackData.Delivery_Fee)));
                } else { };
            } else {
                alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            };
        };
        xhr.open('GET', `${URL}OrdersAdmin/${num}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);
    });
    // Edit 編輯
    $(document).on('click', '.btnEdit', function (e) {
        e.preventDefault();
        let trz = $(this).parents('.edits');
        let num = trz.find('.odr-num').html();
        let memo = trz.find('.stores_memo');
        // 顯示刪除（取消）功能
        if (menuAuth[authParent.indexOf("OM")].ACT_DEL == "Y") {
            // 訂單尚未付款，時間到期
            if (statusId == "11") {
                let thisDate = new Date(); // 現在時間
                if (thisDate > new Date(dateChange(endDates))) {
                    alert("此筆訂單的付款期限已到期，建議直接取消訂單。")
                };
            };
            if (statusId == "11" || statusId == "16" || statusId == "21" || statusId == "22" || statusId == "23") {
                $(this).parent().html('').append(`
                    <a class="btn btn-success btnSave" href="#"><i class="fal fa-save"></i> 儲存修改</a>
                    <a class="btn btn-danger btnCancelOrder"><i class="fad fa-window-close"></i> 取消訂單</a>
                    <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                `);
            } else {
                $(this).parent().html('').append(`
                    <a class="btn btn-success btnSave" href="#"><i class="fal fa-save"></i> 儲存修改</a>
                    <a class="btn btnCancel ml-2" href="#"><i class="far fa-window-close"></i> 取消</a>
                `);
            };
            // Order Cancel 取消訂單
            $('.btnCancelOrder').on('click', function (e) {
                e.preventDefault(), e.stopPropagation();
                if (confirm("確定要取消此筆訂單嗎")) {
                    let dataObj = {
                        "id": num,
                        "Order_Status_Id": 52
                    };
                    console.log(dataObj)
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            if (xhr.responseText !== "") {
                                let callBackData = JSON.parse(xhr.responseText);
                                alert(`訂單編號 ${num} 已取消。`);
                                location.reload();
                            };
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        };
                    };
                    xhr.open('PUT', `${URL}OrdersAdmin/UpdateOrderStatus`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(dataObj));
                };
            });
        } else {
            $(this).parent().html('').append(`
                <a class="btn btn-success btnSave" href="#"><i class="fal fa-save"></i> 儲存修改</a>
                <a class="btn btnCancel" href="#"><i class="far fa-window-close"></i> 取消</a>
            `);
        };
        // 開啟可修改欄位
        trz.find('.order-contents .inputStatus').prop('disabled', false);
        // Save 儲存
        trz.find('.btnSave').on('click', function (e) {
            e.preventDefault();
            if (statusId == odrStatus_select.val()) {
                if (confirm("您確定要修改這筆訂單的備註嗎？")) {
                    let dataObj = {
                        "id": num,
                        "memo": memo.val()
                    };
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            alert(`訂單編號 ${num} 備註修改成功。`);
                            // 關閉可修改欄位
                            trz.find('.order-contents .inputStatus').prop('disabled', true);
                            location.reload();
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        };
                    };
                    xhr.open('PUT', `${URL}OrdersAdmin/UpdateOrderMemo`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(dataObj));
                };
            } else {
                if (confirm("您確定要修改這筆訂單的狀態嗎？")) {
                    let dataObj = {
                        "id": num,
                        "Order_Status_Id": statusId,
                        "memo": memo.val()
                    };
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            if (xhr.responseText !== "") {
                                let callBackData = JSON.parse(xhr.responseText);
                                alert(`訂單編號 ${num} 狀態修改成功。`);
                                // 關閉可修改欄位
                                trz.find('.order-contents .inputStatus').prop('disabled', true);
                                location.reload();
                            };
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        };
                    };
                    xhr.open('PUT', `${URL}OrdersAdmin/UpdateOrderStatus`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(dataObj));
                };
            }
        });
        // Cancel 取消
        trz.find('.btnCancel').unbind('click').on('click', function (e) {
            e.preventDefault();
            let trz = $(this).parents('.edits');
            if (confirm("尚未儲存內容，確定要取消嗎？")) {
                // 鎖定可修改欄位
                trz.find('.order-contents .inputStatus').prop('disabled', true);
                // 回復預設選項
                $(this).parent().html('').append(`
                    <a class="btn btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
                `);
            };
        });
    });
    // Cancel 取消
    $('.close').unbind('click').on('click', function () {
        let trz = $(this).parents('.modal-content');
        // 鎖定可修改欄位
        trz.find('.order-contents .inputStatus').prop('disabled', true);
        // 回復預設選項
        trz.find('.setupBlock').html('').append(`
            <a class="btn btn-warning btnEdit" href="#"><i class="far fa-edit"></i> 編輯狀態</a>
        `);
        trz.find('.closez').trigger('click');
    });
};
// 驗證
function dataUpdateCheck(aId, name, phone, county, address, mail, dTime, dAddress) {
    // if (aId.trim() === '') {
    //     return check = false, errorText = '請確認必填欄位皆有填寫！';
    // }
    // if (name.val().trim() === '') {
    //     name.focus();
    //     return check = false, errorText = '請確認姓名是否確實填寫！';
    // }
    // if (phone.val().trim() === '' || CellRegExp.test(phone.val()) === false) {
    //     phone.focus();
    //     return check = false, errorText = '請確認手機是否確實填寫，或格式是否正確！';
    // }
    // if (county.val().trim() === '') {
    //     county.focus();
    //     return check = false, errorText = '請確認地址是否確實填寫！';
    // }
    // if (address.val().trim() === '') {
    //     address.focus();
    //     return check = false, errorText = '請確認地址是否確實填寫！';
    // }
    // if (mail.val().trim() === '' || EmailRegExp.test(mail.val()) === false) {
    //     mail.focus();
    //     return check = false, errorText = '請確認信箱是否確實填寫，或格式是否正確！';
    // }
    // if (dTime.val().trim() === '') {
    //     dTime.focus();
    //     return check = false, errorText = '請確認實際出貨時間是否確實填寫！'
    // }
    // if (dAddress.val().trim() === '') {
    //     dAddress.focus();
    //     return check = false, errorText = '請確認配送地址是否確實填寫！';
    // }
    // else {
    //     return check = true, errorText = "";
    // }

};
$().ready(function () {
    // MainFilter
    orderLiv.on('click', function (e) {
        e.preventDefault();
        orderLiv.removeClass('active'), $(this).addClass('active');
        let clsNum = $(this).data('num');
        odrSearchs.val(''), dateSearch.val('');  // 點擊時，清空搜尋欄位
        if (clsNum == "all") {
            clsObj = {
                // "id": "",
                // "order_status_id": "",
                // "startDate": "",
                // "endDate": "",
                // "count": "",
                "page": current
            };
        } else {
            if (clsNum.toString() == "21,22,23") {
                subOrderStatus.html(`
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" data-num="[21,22,23]">全部</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[21,22]">待處理</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[23]">已處理</a>
                        </li>
                    </ul>
                `);
            } else if (clsNum.toString() == "51,52") {
                subOrderStatus.html(`
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" data-num="[51,52]">全部</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[51]">待處理</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[52]">已處理</a>
                        </li>
                    </ul>
                `);

            } else if (clsNum.toString() == "61,62") {
                subOrderStatus.html(`
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="#" data-num="[61,62]">全部</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[61]">待處理</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-num="[62]">已處理</a>
                        </li>
                    </ul>
                `);

            } else {
                subOrderStatus.html('');
            };
            clsObj = {
                // "id": "",
                "order_status_id": clsNum,
                // "startDate": "",
                // "endDate": "",
                // "count": listSize,
                "page": current
            };
        };
        if (clsNum !== clsRcd) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
                        // 分頁數
                        mainLens = callBackData.length;
                        pageLens = Math.ceil(mainLens / listSize);
                        paginations.find('div').html(curPage(current, pageLens, pageCount));
                        paginations.unbind('click').on('click', 'li', function (e) {
                            e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                            let num = $(this).find('a').data("num");
                            let clsNow = $('.subOrderNav .nav-item').find('.nav-link.active').data('num'); // 當前點擊的分類
                            clsObj.count = listSize; // 筆數限制
                            if (isNaN(num)) {
                                if (!$(this).hasClass('disabled')) {
                                    if (num == "prev") {
                                        pageRcd--;
                                    } else if (num == "next") {
                                        pageRcd++;
                                    }
                                    // 上下頁，以記錄的頁碼來做拋接值
                                    clsObj.page = pageRcd;
                                    paginations.find('div').html(curPage(pageRcd, pageLens, pageCount))
                                    let xhr = new XMLHttpRequest()
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                let callBackData = JSON.parse(xhr.responseText);
                                                html = "";
                                                pageRcd = pageRcd; // 更新頁碼的紀錄
                                                for (let i = 0; i < callBackData.length; i++) {
                                                    // 商品狀態
                                                    if (callBackData[i].Order_Status_Id == "11") {
                                                        status = "";
                                                        if (callBackData[i].Pay_Type_sId == "01") {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（即時付款）</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                </div>
                                                            `;
                                                        };
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note"></span>
                                                            </div>
                                                        `;
                                                    }
                                                    html += `
                                                        <tr data-num="${callBackData[i].Id}">
                                                            <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                            <td data-title="訂單日期" class="text-left">
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                </div>
                                                            </td>
                                                            <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                            <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                            <td data-title="狀態" class="order-status">${status}</td>
                                                            <td data-title="預估出貨時間" class="text-left">
                                                                <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                            </td>
                                                            <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                            <td data-title="設定" class="setup">
                                                                <div class="setupBlock">
                                                                    <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `;
                                                };
                                                orders.html(html);
                                                init();
                                                $('html,body').scrollTop(0);
                                            };
                                        };
                                    };
                                    xhr.open('POST', `${URL}${connect}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(clsObj));
                                }
                            } else {
                                if (clsNow !== clsRcd) {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                    let xhr = new XMLHttpRequest()
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                let callBackData = JSON.parse(xhr.responseText);
                                                html = "";
                                                pageRcd = num, clsRcd = clsNow;
                                                for (let i = 0; i < callBackData.length; i++) {
                                                    // 商品狀態
                                                    if (callBackData[i].Order_Status_Id == "11") {
                                                        status = "";
                                                        if (callBackData[i].Pay_Type_sId == "01") {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（即時付款）</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                </div>
                                                            `;
                                                        };
                                                    } else {
                                                        status = `
                                                    <div>
                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                        <span class="status-note"></span>
                                                    </div>
                                                `;
                                                    }
                                                    html += `
                                                        <tr data-num="${callBackData[i].Id}">
                                                            <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                            <td data-title="訂單日期" class="text-left">
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                </div>
                                                            </td>
                                                            <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                            <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                            <td data-title="狀態" class="order-status">${status}</td>
                                                            <td data-title="預估出貨時間" class="text-left">
                                                                <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                            </td>
                                                            <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                            <td data-title="設定" class="setup">
                                                                <div class="setupBlock">
                                                                    <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `;
                                                };
                                                orders.html(html);
                                                init();
                                                $('html,body').scrollTop(0);
                                            };
                                        };
                                    };
                                    xhr.open('POST', `${URL}${connect}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(clsObj));
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        $(this).addClass('active').siblings().removeClass('active');
                                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                                        clsObj.page = num // 傳送的頁碼
                                        let xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            if (xhr.status == 200) {
                                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                    let callBackData = JSON.parse(xhr.responseText);
                                                    html = "";
                                                    pageRcd = num;
                                                    for (let i = 0; i < callBackData.length; i++) {
                                                        // 商品狀態
                                                        if (callBackData[i].Order_Status_Id == "11") {
                                                            status = "";
                                                            if (callBackData[i].Pay_Type_sId == "01") {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note">買家尚未付款（即時付款）</span>
                                                                    </div>
                                                                `;
                                                            } else {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                    </div>
                                                                `;
                                                            };
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note"></span>
                                                                </div>
                                                            `;
                                                        }
                                                        html += `
                                                            <tr data-num="${callBackData[i].Id}">
                                                                <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                                <td data-title="訂單日期" class="text-left">
                                                                    <div>
                                                                        <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                        <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                    </div>
                                                                </td>
                                                                <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                                <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                                <td data-title="狀態" class="order-status">${status}</td>
                                                                <td data-title="預估出貨時間" class="text-left">
                                                                    <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                                </td>
                                                                <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                                <td data-title="設定" class="setup">
                                                                    <div class="setupBlock">
                                                                        <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        `;
                                                    };
                                                    orders.html(html);
                                                    init();
                                                    $('html,body').scrollTop(0);
                                                }
                                            }
                                        }
                                        xhr.open('POST', `${URL}${connect}`, true);
                                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                        xhr.send($.param(clsObj));
                                    } else {

                                    };
                                };
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        // 分頁數
                        mainLens = 1;
                        pageLens = Math.ceil(mainLens / listSize);
                        html = "";
                        html = `
                            <tr class="none">
                                <td colspan="8" class="none">
                                    <span>目前沒有任何此類的訂單。</span>
                                </td>
                            </tr> 
                        `;
                        orders.html(html);
                        clsRcd = clsNum;
                        paginations.find('div').html(curPage(current, pageLens, pageCount));
                    };
                } else {
                    // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            };
            xhr.open('POST', `${URL}${connect}`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send($.param(clsObj));
        } else { };

        // 判斷是否有第二層分類
        if (subOrderStatus.html() !== "") {
            // SubFilter
            subOrderStatus.find('ul li a').on('click', function (e) {
                e.preventDefault();
                subOrderStatus.find('ul li a').removeClass('active'), $(this).addClass('active');
                let clsNum = $(this).data('num');
                clsObj = {
                    // "id": "",
                    "order_status_id": clsNum,
                    // "startDate": "",
                    // "endDate": "",
                    // "count": listSize,
                    "page": current
                };
                if (clsNum !== cls1Rcd) {
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                let callBackData = JSON.parse(xhr.responseText);
                                // 分頁數
                                mainLens = callBackData.length;
                                pageLens = Math.ceil(mainLens / listSize);
                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                paginations.unbind('click').on('click', 'li', function (e) {
                                    e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                    let num = $(this).find('a').data("num");
                                    let clsNow = $('.subOrderStatus .nav-item').find('.nav-link.active').data('num');
                                    clsObj.count = listSize;
                                    if (isNaN(num)) {
                                        if (!$(this).hasClass('disabled')) {
                                            if (num == "prev") {
                                                pageRcd--;
                                            } else if (num == "next") {
                                                pageRcd++;
                                            };
                                            // 上下頁，以記錄的頁碼來做拋接值
                                            clsObj.page = pageRcd;
                                            paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                            let xhr = new XMLHttpRequest()
                                            xhr.onload = function () {
                                                if (xhr.status == 200) {
                                                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                        let callBackData = JSON.parse(xhr.responseText);
                                                        html = "";
                                                        pageRcd = pageRcd;
                                                        for (let i = 0; i < callBackData.length; i++) {
                                                            // 商品狀態
                                                            if (callBackData[i].Order_Status_Id == "11") {
                                                                status = "";
                                                                if (callBackData[i].Pay_Type_sId == "01") {
                                                                    status = `
                                                                        <div>
                                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                            <span class="status-note">買家尚未付款（即時付款）</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    status = `
                                                                        <div>
                                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                            <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                        </div>
                                                                    `;
                                                                };
                                                            } else {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note"></span>
                                                                    </div>
                                                                `;
                                                            };
                                                            html += `
                                                                <tr data-num="${callBackData[i].Id}">
                                                                    <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                                    <td data-title="訂單日期" class="text-left">
                                                                        <div>
                                                                            <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                            <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                                    <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                                    <td data-title="狀態" class="order-status">${status}</td>
                                                                    <td data-title="預估出貨時間" class="text-left">
                                                                        <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                                    </td>
                                                                    <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                                    <td data-title="設定" class="setup">
                                                                        <div class="setupBlock">
                                                                            <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            `;
                                                        };
                                                        orders.html(html);
                                                        init();
                                                        $('html,body').scrollTop(0);
                                                    };
                                                };
                                            };
                                            xhr.open('POST', `${URL}${connect}`, true);
                                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                            xhr.send($.param(clsObj));
                                        };
                                    } else {
                                        if (clsNow !== cls1Rcd) {
                                            $(this).addClass('active').siblings().removeClass('active');
                                            paginations.find('div').html(curPage(num, pageLens, pageCount));
                                            let xhr = new XMLHttpRequest()
                                            xhr.onload = function () {
                                                if (xhr.status == 200) {
                                                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                        let callBackData = JSON.parse(xhr.responseText);
                                                        html = "";
                                                        pageRcd = num, cls1Rcd = clsNum;
                                                        for (let i = 0; i < callBackData.length; i++) {
                                                            // 商品狀態
                                                            if (callBackData[i].Order_Status_Id == "11") {
                                                                status = "";
                                                                if (callBackData[i].Pay_Type_sId == "01") {
                                                                    status = `
                                                                        <div>
                                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                            <span class="status-note">買家尚未付款（即時付款）</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    status = `
                                                                        <div>
                                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                            <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                        </div>
                                                                    `;
                                                                };
                                                            } else {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note"></span>
                                                                    </div>
                                                                `;
                                                            };
                                                            html += `
                                                                <tr data-num="${callBackData[i].Id}">
                                                                    <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                                    <td data-title="訂單日期" class="text-left">
                                                                        <div>
                                                                            <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                            <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                                    <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                                    <td data-title="狀態" class="order-status">${status}</td>
                                                                    <td data-title="預估出貨時間" class="text-left">
                                                                        <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                                    </td>
                                                                    <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                                    <td data-title="設定" class="setup">
                                                                        <div class="setupBlock">
                                                                            <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            `;
                                                        };
                                                        orders.html(html);
                                                        init();
                                                        $('html,body').scrollTop(0);
                                                    };
                                                };
                                            };
                                            xhr.open('POST', `${URL}${connect}`, true);
                                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                            xhr.send($.param(clsObj));
                                        } else {
                                            if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                clsObj.page = num // 傳送的頁碼
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = num;
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                // 商品狀態
                                                                if (callBackData[i].Order_Status_Id == "11") {
                                                                    status = "";
                                                                    if (callBackData[i].Pay_Type_sId == "01") {
                                                                        status = `
                                                                            <div>
                                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                                <span class="status-note">買家尚未付款（即時付款）</span>
                                                                            </div>
                                                                        `;
                                                                    } else {
                                                                        status = `
                                                                            <div>
                                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                                <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                            </div>
                                                                        `;
                                                                    };
                                                                } else {
                                                                    status = `
                                                                        <div>
                                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                            <span class="status-note"></span>
                                                                        </div>
                                                                    `;
                                                                }
                                                                html += `
                                                                    <tr data-num="${callBackData[i].Id}">
                                                                        <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                                        <td data-title="訂單日期" class="text-left">
                                                                            <div>
                                                                                <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                                <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                                        <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                                        <td data-title="狀態" class="order-status">${status}</td>
                                                                        <td data-title="預估出貨時間" class="text-left">
                                                                            <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                                        </td>
                                                                        <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                                        <td data-title="設定" class="setup">
                                                                            <div class="setupBlock">
                                                                                <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                    `;
                                                            };
                                                            orders.html(html);
                                                            init();
                                                            $('html,body').scrollTop(0);
                                                        }
                                                    };
                                                };
                                                xhr.open('POST', `${URL}${connect}`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else { };
                                        };
                                    };
                                });
                                paginations.find('div li:first-child').trigger('click');
                            } else {
                                // 分頁數
                                mainLens = 1;
                                pageLens = Math.ceil(mainLens / listSize);
                                html = "";
                                html = `
                                    <tr class="none">
                                        <td colspan="8" class="none">
                                            <span>目前沒有任何此類的訂單。</span>
                                        </td>
                                    </tr> 
                                `;
                                orders.html(html);
                                cls1Rcd = clsNum;
                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                            };
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        };
                    };
                    xhr.open('POST', `${URL}${connect}`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(clsObj));
                } else { };
            });
        } else { };
    });
    orderLiv.eq(0).trigger('click');

    // Searchs
    btnSearch.on('click', function (e) {
        e.preventDefault();
        if (odrSearchs.val() !== "") {
            clsObj = {
                "id": odrSearchs.val(),
                // "order_status_id": "",
                // "startDate": "",
                // "endDate": "",
                // "count": "",
                "page": current
            };
            clsRcd = "", pageRcd = ""; // 使用搜尋，清空目前記錄的篩選 && 每次使用都要清除頁碼紀錄
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
                        // 分頁數
                        mainLens = callBackData.length;
                        pageLens = Math.ceil(mainLens / listSize);
                        paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
                        paginations.unbind('click').on('click', 'li', function (e) {
                            e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                            let num = $(this).find('a').data("num");
                            let clsNow = "";// 當前點擊的分類設為空值
                            clsObj.count = listSize; // 筆數限制
                            if (isNaN(num)) {
                                if (!$(this).hasClass('disabled')) {
                                    if (num == "prev") {
                                        pageRcd--;
                                    } else if (num == "next") {
                                        pageRcd++;
                                    };
                                    // 上下頁，以記錄的頁碼來做拋接值
                                    clsObj.page = pageRcd;
                                    paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                    let xhr = new XMLHttpRequest()
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                let callBackData = JSON.parse(xhr.responseText);
                                                html = "";
                                                pageRcd = pageRcd; // 更新頁碼的紀錄
                                                for (let i = 0; i < callBackData.length; i++) {
                                                    // 商品狀態
                                                    if (callBackData[i].Order_Status_Id == "11") {
                                                        status = "";
                                                        if (callBackData[i].Pay_Type_sId == "01") {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（即時付款）</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                </div>
                                                            `;
                                                        };
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note"></span>
                                                            </div>
                                                        `;
                                                    };
                                                    html += `
                                                        <tr data-num="${callBackData[i].Id}">
                                                            <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                            <td data-title="訂單日期" class="text-left">
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                </div>
                                                            </td>
                                                            <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                            <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                            <td data-title="狀態" class="order-status">${status}</td>
                                                            <td data-title="預估出貨時間" class="text-left">
                                                                <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                            </td>
                                                            <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                            <td data-title="設定" class="setup">
                                                                <div class="setupBlock">
                                                                    <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `;
                                                };
                                                orders.html(html);
                                                init();
                                                $('html,body').scrollTop(0);
                                            };
                                        };
                                    };
                                    xhr.open('POST', `${URL}${connect}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(clsObj));
                                }
                            } else {
                                if (clsNow !== clsRcd) {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                    let xhr = new XMLHttpRequest()
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                let callBackData = JSON.parse(xhr.responseText);
                                                html = "";
                                                pageRcd = num, clsRcd = clsNow;
                                                for (let i = 0; i < callBackData.length; i++) {
                                                    // 商品狀態
                                                    if (callBackData[i].Order_Status_Id == "11") {
                                                        status = "";
                                                        if (callBackData[i].Pay_Type_sId == "01") {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（即時付款）</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                </div>
                                                            `;
                                                        };
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note"></span>
                                                            </div>
                                                        `;
                                                    };
                                                    html += `
                                                        <tr data-num="${callBackData[i].Id}">
                                                            <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                            <td data-title="訂單日期" class="text-left">
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                </div>
                                                            </td>
                                                            <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                            <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                            <td data-title="狀態" class="order-status">${status}</td>
                                                            <td data-title="預估出貨時間" class="text-left">
                                                                <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                            </td>
                                                            <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                            <td data-title="設定" class="setup">
                                                                <div class="setupBlock">
                                                                    <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `;
                                                };
                                                orders.html(html);
                                                init();
                                                $('html,body').scrollTop(0);
                                            };
                                        };
                                    };
                                    xhr.open('POST', `${URL}${connect}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(clsObj));
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        $(this).addClass('active').siblings().removeClass('active');
                                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                                        clsObj.page = num // 傳送的頁碼
                                        let xhr = new XMLHttpRequest();
                                        xhr.onload = function () {
                                            if (xhr.status == 200) {
                                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                    let callBackData = JSON.parse(xhr.responseText);
                                                    html = "";
                                                    pageRcd = num;
                                                    for (let i = 0; i < callBackData.length; i++) {
                                                        // 商品狀態
                                                        if (callBackData[i].Order_Status_Id == "11") {
                                                            status = "";
                                                            if (callBackData[i].Pay_Type_sId == "01") {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note">買家尚未付款（即時付款）</span>
                                                                    </div>
                                                                `;
                                                            } else {
                                                                status = `
                                                                    <div>
                                                                        <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                        <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                    </div>
                                                                `;
                                                            };
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note"></span>
                                                                </div>
                                                            `;
                                                        };
                                                        html += `
                                                            <tr data-num="${callBackData[i].Id}">
                                                                <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                                <td data-title="訂單日期" class="text-left">
                                                                    <div>
                                                                        <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                        <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                    </div>
                                                                </td>
                                                                <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                                <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                                <td data-title="狀態" class="order-status">${status}</td>
                                                                <td data-title="預估出貨時間" class="text-left">
                                                                    <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                                </td>
                                                                <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                                <td data-title="設定" class="setup">
                                                                    <div class="setupBlock">
                                                                        <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        `;
                                                    };
                                                    orders.html(html);
                                                    init();
                                                    $('html,body').scrollTop(0);
                                                }
                                            }
                                        }
                                        xhr.open('POST', `${URL}${connect}`, true);
                                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                        xhr.send($.param(clsObj));
                                    } else { };
                                };
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        pageLens = 1; // 沒有搜尋到訂單，頁數呈現為 1 頁
                        html = "";
                        html = `
                            <tr class="none">
                                <td colspan="8" class="none">
                                    <span>沒有搜尋到此筆訂單！</span>
                                </td>
                            </tr> 
                        `;
                        orders.html(html);
                        paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
                    };
                } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                };
            };
            xhr.open('POST', `${URL}${connect}`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send($.param(clsObj));
        } else {
            alert("請輸入訂單編號！");
        };
    });
    odrSearchs.on('change', function (e) {
        e.preventDefault();
        if ($(this).val() == "") {
            // 當使用搜尋功能值為空時，會顯示全部
            clsRcd == "";
            orderLiv.eq(0).trigger('click');
        };
    });
    // DateSearch
    dateSearch.on('apply.daterangepicker', function (ev, picker) {
        orderLiv.eq(0).trigger('click'); // 點擊 "全部" 回到取得全部資訊的狀態

        startDate = picker.startDate.format('YYYY-MM-DD');
        endDate = picker.endDate.format('YYYY-MM-DD');
        clsRcd = "", pageRcd = ""; // 使用搜尋，清空目前記錄的篩選 && 每次使用都要清除頁碼紀錄
        clsObj = {
            // "id": "",
            // "order_status_id": "",
            "startDate": startDate,
            "endDate": endDate,
            // "count": "",
            // "page": ""
        };
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                    let callBackData = JSON.parse(xhr.responseText);
                    // 分頁數
                    mainLens = callBackData.length;
                    pageLens = Math.ceil(mainLens / listSize);
                    paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
                    paginations.unbind('click').on('click', 'li', function (e) {
                        e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                        let num = $(this).find('a').data("num");
                        let clsNow = "";// 當前點擊的分類設為空值
                        clsObj.count = listSize; // 筆數限制
                        if (isNaN(num)) {
                            if (!$(this).hasClass('disabled')) {
                                if (num == "prev") {
                                    pageRcd--;
                                } else if (num == "next") {
                                    pageRcd++;
                                };
                                // 上下頁，以記錄的頁碼來做拋接值
                                clsObj.page = pageRcd;
                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount))
                                let xhr = new XMLHttpRequest()
                                xhr.onload = function () {
                                    if (xhr.status == 200) {
                                        if (xhr.responseText !== "") {
                                            let callBackData = JSON.parse(xhr.responseText);
                                            html = "";
                                            pageRcd = pageRcd; // 更新頁碼的紀錄
                                            for (let i = 0; i < callBackData.length; i++) {
                                                // 商品狀態
                                                if (callBackData[i].Order_Status_Id == "11") {
                                                    status = "";
                                                    if (callBackData[i].Pay_Type_sId == "01") {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note">買家尚未付款（即時付款）</span>
                                                            </div>
                                                        `;
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                            </div>
                                                        `;
                                                    };
                                                } else {
                                                    status = `
                                                        <div>
                                                            <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                            <span class="status-note"></span>
                                                        </div>
                                                    `;
                                                }
                                                html += `
                                                    <tr data-num="${callBackData[i].Id}">
                                                        <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                        <td data-title="訂單日期" class="text-left">
                                                            <div>
                                                                <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span> 
                                                            </div>
                                                        </td>
                                                        <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                        <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                        <td data-title="狀態" class="order-status">${status}</td>
                                                        <td data-title="預估出貨時間" class="text-left">
                                                            <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                        </td>
                                                        <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                        <td data-title="設定" class="setup">
                                                            <div class="setupBlock">
                                                                <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                            </div>
                                                        </td>
                                                    /tr>
                                                `;
                                            };
                                            orders.html(html);
                                            init();
                                            $('html,body').scrollTop(0);
                                        };
                                    };
                                };
                                xhr.open('POST', `${URL}${connect}`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(clsObj));
                            }
                        } else {
                            if (clsNow !== clsRcd) {
                                $(this).addClass('active').siblings().removeClass('active');
                                paginations.find('div').html(curPage(num, pageLens, pageCount));
                                let xhr = new XMLHttpRequest()
                                xhr.onload = function () {
                                    if (xhr.status == 200) {
                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                            let callBackData = JSON.parse(xhr.responseText);
                                            html = "";
                                            pageRcd = num, clsRcd = clsNow;
                                            for (let i = 0; i < callBackData.length; i++) {
                                                // 商品狀態
                                                if (callBackData[i].Order_Status_Id == "11") {
                                                    status = "";
                                                    if (callBackData[i].Pay_Type_sId == "01") {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note">買家尚未付款（即時付款）</span>
                                                            </div>
                                                        `;
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                            </div>
                                                        `;
                                                    };
                                                } else {
                                                    status = `
                                                <div>
                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                    <span class="status-note"></span>
                                                </div>
                                            `;
                                                }
                                                html += `
                                                    <tr data-num="${callBackData[i].Id}">
                                                        <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                        <td data-title="訂單日期" class="text-left">
                                                            <div>
                                                                <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                            </div>
                                                        </td>
                                                        <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                        <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                        <td data-title="狀態" class="order-status">${status}</td>
                                                        <td data-title="預估出貨時間" class="text-left">
                                                            <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                        </td>
                                                        <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                        <td data-title="設定" class="setup">
                                                            <div class="setupBlock">
                                                                <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                            </div>
                                                        </td>
                                                    </tr>
                                                `;
                                            };
                                            orders.html(html);
                                            init();
                                            $('html,body').scrollTop(0);
                                        };
                                    };
                                };
                                xhr.open('POST', `${URL}${connect}`, true);
                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                xhr.send($.param(clsObj));
                            } else {
                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                    clsObj.page = num // 傳送的頁碼
                                    let xhr = new XMLHttpRequest();
                                    xhr.onload = function () {
                                        if (xhr.status == 200) {
                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                let callBackData = JSON.parse(xhr.responseText);
                                                html = "";
                                                pageRcd = num;
                                                for (let i = 0; i < callBackData.length; i++) {
                                                    // 商品狀態
                                                    if (callBackData[i].Order_Status_Id == "11") {
                                                        status = "";
                                                        if (callBackData[i].Pay_Type_sId == "01") {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（即時付款）</span>
                                                                </div>
                                                            `;
                                                        } else {
                                                            status = `
                                                                <div>
                                                                    <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                    <span class="status-note">買家尚未付款（在 ${callBackData[i].Pay_End_Date} 前）</span>
                                                                </div>
                                                            `;
                                                        };
                                                    } else {
                                                        status = `
                                                            <div>
                                                                <span class="status" data-num="${callBackData[i].Order_Status_Id}">${callBackData[i].Order_Status}</span>
                                                                <span class="status-note"></span>
                                                            </div>
                                                        `;
                                                    }
                                                    html += `
                                                        <tr data-num="${callBackData[i].Id}">
                                                            <td data-title="訂單編號">${callBackData[i].Id}</td>
                                                            <td data-title="訂單日期" class="text-left">
                                                                <div>
                                                                    <span class="mr-1">${callBackData[i].Purchase_Date.split(' ')[0]}</span>
                                                                    <span>${callBackData[i].Purchase_Date.split(' ')[1]}</span>
                                                                </div>
                                                            </td>
                                                            <td data-title="訂單金額" class="text-right"><span class="priceMark amt">${thousands(parseInt(Number(callBackData[i].Order_Total) + Number(callBackData[i].Delivery_Fee)))}</span></td>
                                                            <td data-title="付款方式" class="text-center">${callBackData[i].Pay_Type}</td>
                                                            <td data-title="狀態" class="order-status">${status}</td>
                                                            <td data-title="預估出貨時間" class="text-left">
                                                                <span class="mr-1">${callBackData[i].Delivery_Date.split(' ')[0]}</span>
                                                            </td>
                                                            <td data-title="配送方式" class="text-center">${callBackData[i].Delivery_Type}</td>
                                                            <td data-title="設定" class="setup">
                                                                <div class="setupBlock">
                                                                    <a class="btn btn-secondary btn-sm btnOrder" data-toggle="modal" data-target="#ordersDetail"><i class="fad fa-info-circle"></i> 詳情</a> 
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    `;
                                                };
                                                orders.html(html);
                                                init();
                                                $('html,body').scrollTop(0);
                                            }
                                        }
                                    }
                                    xhr.open('POST', `${URL}${connect}`, true);
                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                    xhr.send($.param(clsObj));
                                } else { };
                            };
                        };
                    });
                    paginations.find('div li:first-child').trigger('click');
                } else {
                    pageLens = 1; // 沒有搜尋到訂單，頁數呈現為 1 頁
                    html = "";
                    html = `
                        <tr class="none">
                            <td colspan="8" class="none">
                                <span>沒有搜尋到此筆訂單！</span>
                            </td>
                        </tr> 
                    `;
                    orders.html(html);
                    paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
                };
            } else {
                alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            };
        };
        xhr.open('POST', `${URL}${connect}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send($.param(clsObj));
    });
    dateSearch.on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
        startDate = "", endDate = "";
        clsObj = {}; // 重置搜尋條件
        orderLiv.eq(0).trigger('click'); // 點擊 "全部" 回到取得全部資訊的狀態
    });
});
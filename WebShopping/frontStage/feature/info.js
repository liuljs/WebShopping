// INFOS
let tabs = $('.tabz');
let purCustomer = $('.pur_customer'), purGender = $('input[name="purGender"]'), purCell = $('.pur_cell'), purMail = $('.pur_mail'), purAddr = $('.pur_addr');
let devCustomer = $('.dev_customer'), devGender = $('input[name="devGender"]'), devCell = $('.dev_cell'), devMail = $('.dev_mail'), devNote = $('.add_note');
let cloneStatus = $('.clone-status');
let devType = 1; // 預設店到店（1:店到店 2:宅配）
let devFee = 0 // 預設運費為 0 元 
let purAddress, devAddress;
let payType = "01"; //預設付款方式為 線上刷卡
let invo, invoTitle = "紙本發票", invoType = "01"; // 預設
let invoName = "", invoCode = ""; // 預設發票資訊為 紙本發票

let add_store = $('.add_store'), add_addr = $('.add_addr');

let btnSendOrder = $('.btnSendOrder');
// Cart Totals 
let total, amt, cartQty = $('.cartQty'), cartSubAmts = $('.cartSubAmts'), cartFee = $('.cartFee'), cartAmts = $('.cartAmts');
let freeSet = $('.freeSet');
let freeField = $('<span>運費</span><span class="notes">免運費</span>');
let feeField = $('<span>運費</span><span class="total_free cartFee"></span>');
function calcOdrTotal(amt, fee) {
    return amt + fee;
};
// 驗證
function dataUpdateCheck(name, cell, mail, address, name, cell, mail, address, invoType) {
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認購買資訊的姓名欄位是否確實填寫，或格式是否正確！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val()) === false) {
        cell.focus();
        return check = false, errorText = '請確認購買資訊的手機欄位是否確實填寫，或格式是否正確！';
    }
    if (mail.val().trim() === '' || EmailRegExp.test(mail.val()) === false) {
        mail.focus();
        return check = false, errorText = '請確認購買資訊的信箱欄位是否確實填寫，或格式是否正確！';
    }
    if (address === '' || address === undefined) {
        return check = false, errorText = '請確認是否有填寫購買資訊的地址欄位（宅配或店到店地址）！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認收件資訊的姓名欄位是否確實填寫，或格式是否正確！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val()) === false) {
        cell.focus();
        return check = false, errorText = '請確認收件資訊的手機欄位是否確實填寫，或格式是否正確！';
    }
    if (mail.val().trim() === '' || EmailRegExp.test(mail.val()) === false) {
        mail.focus();
        return check = false, errorText = '請確認收件資訊的信箱欄位是否確實填寫，或格式是否正確！';
    }
    if (address === '' || address === undefined) {
        return check = false, errorText = '請確認是否有填寫收件資訊的地址欄位（宅配或店到店地址）！';
    }
    if (invoType == '01') {
        return check = true, errorText = "";
    }
    else if (invoType == '02') {
        if (invoCode.val().trim() === '') {
            invoCode.focus();
            return check = false, errorText = '請確認發票資訊的手機條碼欄位有確實的填寫！';
        } else {
            return check = true, errorText = "";
        };
    }
    else if (invoType == '03') {
        if (invoCode.val().trim() === '' || invoName.val().trim() === '') {
            invoName.focus()
            return check = false, errorText = '請確認發票資訊的公司抬頭（統一編號）欄位有確實的填寫！';
        } else if (invoCode.val().length >= 9) {
            return check = false, errorText = '請確認發票資訊的統一編號欄位是否正確（小於9碼）！';
        } else {
            return check = true, errorText = "";
        };
    }
    else if (invoType == '04') {
        if (invoCode.val().trim() === '') {
            invoCode.focus();
            return check = false, errorText = '請確認發票資訊欄位的捐贈碼欄位有確實的填寫！';
        } else {
            return check = true, errorText = "";
        };
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    // Tabs
    tabs.find('input[type="radio"]').on('change', function () {
        let tabContent = $(this).parents('.tabWraps').find('.tab-contents');
        tabContent.find('.tab').eq($(this).parents('label').index()).addClass('active').siblings().removeClass('active');
    });
    // MEMBER INFOS
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `MemberUser`,
        "QUERYs": "",
        "Sends": "",
        "Counts": "",
    };
    getPageDatas(dataObj).then(res => {
        if (res !== null) {
            // Purchase
            if (res.Name !== "") {
                purCustomer.val(res.Name);
            };
            // Gender
            if (res.Gender !== "") {
                $(`.purGender[value="${res.Gender}"]`).prop('checked', true);
            } else {
                $(`.purGender[value="2"]`).prop('checked', true);
            };
            // Cell Phone
            if (res.Phone !== "") {
                purCell.val(res.Phone);
            };
            // Mail
            if (res.Account !== "") {
                purMail.val(res.Account);
            };
            // Address
            if (res.Address !== "") {
                let addrArr = JSON.parse(res.Address);
                $('.pur_twZipCode').twzipcode('set', {
                    'zipcode': addrArr[0],
                    'county': addrArr[1],
                    'district': addrArr[2]
                });
                purAddr.val(addrArr[3]);
            };
            cloneStatus.on('change', function () {
                if ($(this).prop('checked') == true) {
                    if (purCustomer.val() !== "") {
                        devCustomer.val(purCustomer.val());
                        $(`input[name="devGender"][value="${$('input[name="purGender"]:checked').val()}"]`).prop('checked', true);
                    };
                    if (purCell.val() !== "") {
                        devCell.val(purCell.val());
                    };
                    if (purMail.val() !== "") {
                        devMail.val(purMail.val());
                    };

                } else {
                    devCustomer.val(''), $(`input[name="devGender"][value="2"]`).prop('checked', true), devCell.val(''), devMail.val('');
                };
            });
            // CART INFOS
            let dataObj = {
                "Methods": "GET",
                "APIs": URL,
                "CONNECTs": `Orders/GetCart`,
                "QUERYs": "",
                "Sends": "",
                "Counts": "",
            };
            getPageDatas(dataObj).then(res => {
                if (res !== null) {
                    cartQty.html(res.Count);
                    // 商品總額
                    if (res.Discount_Total !== "" && res.Discount_Total !== 0 && res.Discount_Total !== null && res.Discount_Total !== undefined) {
                        cartSubAmts.html(thousands(res.Discount_Total));
                        amt = res.Discount_Total;
                    } else {
                        cartSubAmts.html(thousands(res.Total));
                        amt = res.Total;
                    };
                    // 載入網頁後顯示的 Fee 
                    if (devType == 1) {
                        if (amt >= freeRules) {
                            devFee = 0;
                            freeSet.html(freeField);
                        } else {
                            devFee = $('.storeSelects option:checked').data('fee');
                            freeSet.html(feeField);
                            $('.cartFee').html(devFee);
                        };
                        total = calcOdrTotal(devFee, amt);
                    } else if (devType == 2) {
                        if (amt > freeRules) {
                            devFee = 0;
                            freeSet.html(freeField);
                        } else {
                            devFee = homeDevFee;
                            freeSet.html(feeField);
                            $('.cartFee').html(devFee);
                        };
                        total = calcOdrTotal(devFee, amt);
                    };
                    cartAmts.html(thousands(total));
                    // Devs Type
                    $('input[name="devMethods"]').on('change', function () {
                        devType = $(this).val();
                        // Fee
                        if (devType == 1) {
                            if (amt >= freeRules) {
                                devFee = 0;
                                freeSet.html(freeField);
                            } else {
                                devFee = $('.storeSelects option:checked').data('fee');
                                freeSet.html(feeField);
                                $('.cartFee').html(devFee);
                            };

                        } else if (devType == 2) {
                            if (amt >= freeRules) {
                                devFee = 0;
                                freeSet.html(freeField);
                            } else {
                                devFee = homeDevFee;
                                freeSet.html(feeField);
                                $('.cartFee').html(devFee);
                            };
                        };
                        total = calcOdrTotal(devFee, amt);
                        cartAmts.html(thousands(total));
                    });
                    // Store Fee
                    $('.storeSelects').on('change', function () {
                        console.log($(this).val())
                        if (amt >= freeRules) {
                            devFee = 0;
                            freeSet.html(freeField);
                        } else {
                            devFee = $(this).find('option:checked').data('fee');
                            freeSet.html(feeField);
                            $('.cartFee').html(devFee);
                        };
                        total = calcOdrTotal(devFee, amt);
                        totals.html(total);
                    });
                    // Pay Type
                    $('input[name="pay-method"]').on('change', function () {
                        payType = $(this).data('num').toString();
                        console.log(payType)
                    });
                    // Invoice
                    $('input[name="invo-method"]').on('change', function () {
                        invoType = $(this).val().toString();
                        invoTitle = $(this).data('title');
                        console.log(invoType, invoTitle)
                    });
                    // Send Order
                    btnSendOrder.on('click', function (e) {
                        e.preventDefault();
                        // Purchase Info
                        purAddress = "";
                        $('.pur_twZipCode').twzipcode('get', function (county, district, zipcode) {
                            if (county !== "") {
                                if (district !== "") {
                                    purAddress = zipcode + county + district;
                                };
                            };
                            return purAddress;
                        });
                        if (purAddr.val() !== "") {
                            purAddress += purAddr.val().trim();
                        };
                        // Delivery Address
                        if (devType == 1) {
                            devAddress = "";
                            devAddress = add_store.val();
                        } else {
                            // twzipcode 取值
                            devAddress = "";
                            let addrArr = $('.twZipCode').twzipcode('get', 'county,district');
                            for (let i = 0; i < addrArr.length; i++) {
                                devAddress += addrArr[i];
                            }
                            devAddress = devAddress + add_addr.val();
                        };
                        // Invoices
                        if (invoType == '02') {
                            invoCode = $('.carrier');
                            invoName = "";
                            invo = `${invoTitle},發票抬頭:${invoName},發票編號:${invoCode.val().trim()}`;
                        } else if (invoType == '03') {
                            invoName = $('.invoName');
                            invoCode = $('.invoNum');
                            invo = `${invoTitle},發票抬頭:${invoName.val().trim()},發票編號:${invoCode.val().trim()}`;
                        } else if (invoType == '04') {
                            invoName = "";
                            invoCode = $('.donateCode');
                            invo = `${invoTitle},發票抬頭:${invoName},發票編號:${invoCode.val().trim()}`;
                        } else {
                            invoName = "";
                            invo = `${invoTitle},發票抬頭:${invoName},發票編號:${invoCode}`;
                        };
                        // 驗證
                        dataUpdateCheck(purCustomer, purCell, purMail, purAddress, devCustomer, devCell, devMail, devAddress, invoType);
                        if (check == true) {
                            // InfoData
                            let dataObj = {
                                "purchaser_name": purCustomer.val().trim(),
                                "purchaser_sex": $('input[name="purGender"]:checked').val().trim(),
                                "purchaser_phone": purCell.val().trim(),
                                "purchaser_tel": "",
                                "purchaser_address": purAddress,
                                "purchaser_email": purMail.val().trim(),
                                "pay_type_id": payType,
                                "delivery_type_id": devType,
                                "delivery_time": "皆可",
                                "memo_customer": devNote.val().trim(),
                                "receiver_name": devCustomer.val().trim(),
                                "receiver_sex": $('input[name="devGender"]:checked').val(),
                                "receiver_phone": devCell.val().trim(),
                                "receiver_tel": "",
                                "receiver_address": devAddress,
                                "receiver_email": devMail.val().trim(),
                                "invoice": invo
                            };
                            // InvoData
                            if (invoType == '02') {
                                invoCode = $('.carrier').val().trim(), invoName = "";
                            } else if (invoType == '03') {
                                invoName = $('.invoName').val().trim(), invoCode = $('.invoNum').val().trim();
                            } else if (invoType == '04') {
                                invoName = "", invoCode = $('.donateCode').val().trim();
                            } else {
                                invoName = "", invoCode = "";
                            };
                            // 1. Update Info
                            if (confirm("再次確認，您要結帳這筆訂單了嗎？")) {
                                let purchaseInfo = new XMLHttpRequest();
                                purchaseInfo.onload = function () {
                                    if (purchaseInfo.status == 200 || purchaseInfo.status == 204) {
                                        // 2. Create Orders
                                        let dataObj = {
                                            "MerchantId": flowObj.MerchantId,
                                            "TerminalId": flowObj.TerminalId,
                                            "MerchantName": flowObj.MerchantName,
                                            "RequestUrl": flowObj.RequestUrl,
                                            "ReturnURL": flowObj.ReturnURL,
                                            "PayType": payType,
                                            "OrderNo": "",
                                            "Amount": total,
                                            "Product": "商品",
                                            "OrderDesc": devNote.val().trim(),
                                            "Encoding": "utf-8",
                                            "Mobile": devCell.val().trim(),
                                            "TelNumber": "",
                                            "Address": devAddress,
                                            "Email": devMail.val().trim(),
                                            "memberId": idz,
                                            "GoBackURL": flowObj.GoBackURL,
                                            "ReceiveURL": flowObj.ReceiveURL,
                                            "DeadlineDate": "",
                                            "RequiredConfirm": "1",
                                            "Invoice": {
                                                "deferred": 7,
                                                "Carrier": invoCode,
                                                "InvoiceName": invoName
                                            }
                                        };
                                        let createOrder = new XMLHttpRequest();
                                        createOrder.onload = function () {
                                            if (createOrder.status == 200 || createOrder.status == 204) {
                                                if (createOrder.responseText !== "" && createOrder.responseText !== "[]") {
                                                    // 3. Send Order
                                                    let callBackData = JSON.parse(createOrder.responseText);
                                                    sendOrder(flowObj.MerchantId, flowObj.TerminalId, flowObj.MerchantName, flowObj.RequestUrl, flowObj.ReturnURL, payType, callBackData.OrderNo, total, "商品", devNote.val().trim(), flowObj.Encoding, devCell.val().trim(), "", devAddress, devMail.val().trim(), idz, flowObj.GoBackURL, flowObj.ReceiveURL, flowObj.DeadlineDate, flowObj.RequiredConfirm, flowObj.deferred, invoCode, invoName, flowObj.validateKey);
                                                };
                                            } else {
                                                alert("錯誤訊息 " + createOrder.status + "：您的連線異常，請重新登入！");
                                                getLogout();
                                            };
                                        };
                                        createOrder.open('POST', `${URL}Orders/CreatPurchase`, true);
                                        createOrder.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                        createOrder.send($.param(dataObj));
                                    } else {
                                        alert("錯誤訊息 " + purchaseInfo.status + "：您的連線異常，請重新登入！");
                                        location.reload();
                                    };
                                };
                                purchaseInfo.open('PUT', `${URL}Orders/UpdatePurchase`, true);
                                purchaseInfo.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                purchaseInfo.send($.param(dataObj));
                            };
                        } else {
                            alert(errorText);
                        };
                    });
                } else {
                    alert("目前購物車中沒有商品！");
                    location.href = "./cart.html";
                };
            }, rej => {
                if (rej == "NOTFOUND") {
                    // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    getLogout();
                };
            })
        } else {
            // 沒有資料的話就會到訂單列表
            location.href = "oder_list.html";
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    });

});
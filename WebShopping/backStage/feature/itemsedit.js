// 宣告要帶入的欄位
let btnCancel = $('.btnCancel'), btnEdit = $('.btnEdit'), btnReturn = $('.btnReturn');
let confirmContent, enable = 1; // 預設為上架

let imgFile = $('.imgFile'), edit_titImg = $('.edit_titImg'), edit_picImag = $('.edit_picImag'), picLens = edit_picImag.length, imgArr = ["", "", "", "", "", ""];
// 基本資訊
let edit_pdtName = $('.edit_pdtName');
// 商品分類
let selected, selectA, selectB, selectC; // 紀錄已選擇的分類 value 用做渲染
let arrow = `<span class="arrow-mark">&gt;</span>`; // > 符號
let first = new Array(), second = new Array(), third = new Array(), clsArr = new Array();
let clsObj = {
    "Cid1": "",
    "Cid2": "",
    "Cid3": ""
};
let edit_pdtCls = $('.edit_pdtCls'), btnEditCls = $('.btnEditCls')
let sortz = $('.sortz'), selectedList = $('.selectedList'), btnSaveCls = $('.btnSaveCls');
// 上下架時間
let edit_pdtStart = $('.edit_pdtStart'), edit_pdtEnd = $('.edit_pdtEnd');
// 商品各狀態
let popuzStatus = $('.popuzStatus'); // 銷售資訊（目前已有的欄位）
// 行銷資訊
let specs = $(".specifications"), specz = $('.specz');
let edit_orgPrice = $('.edit_orgPrice'), edit_specPrice = $('.edit_specPrice'), edit_specQty = $('.edit_specQty');
// 其他資訊
let feezSet = $('.feezSet'), add_feez = $('.add_feez'), feezs = $('.feezs'), code, logistics, fee;
let feeEnable = 0;
// 商品介紹
// let edit_pdtTabz = $('.edit_pdtTabz');
let fNameArr1 = new Array(), fNameArr2 = new Array();
// 驗證
function dataUpdateCheck(aId, pdtName, pdtCls, orgPrice, specPrice, specQty, feez, contentz) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    };
    // if (titImage.val().trim() === '') {
    //     $('html,body').scrollTop(titImage.parents('.row').offset().top - 80);
    //     return check = false, errorTitle = '媒體管理', errorText = '封面圖片：請確認有選擇商品的封面照片！';
    // };
    if (pdtName.val().trim() === '') {
        $('html,body').scrollTop(pdtName.parents('.row').offset().top - 80);
        pdtName.focus().addClass('warmIpt').attr('placeholder', '尚未輸入商品名稱（至少5個字元）！');
        return check = false, errorTitle = '基本資訊', errorText = '請確認商品名稱的欄位有確實填寫！';
    } else if (pdtName.val().trim().length < 5) {
        $('html,body').scrollTop(pdtName.parents('.row').offset().top - 80);
        pdtName.focus().addClass('warmIpt').attr('placeholder', '尚未輸入商品名稱（至少5個字元）！');
        return check = false, errorText = '商品名稱過短，請輸入至少5個字元！';
    };
    if (pdtCls.text() == '') {
        $('html,body').scrollTop(pdtCls.parents('.row').offset().top - 80);
        pdtCls.focus().addClass('warmIpt').attr('placeholder', '尚未選擇商品分類！');
        return check = false, errorTitle = '基本資訊', errorText = '請確認有選擇商品分類！';
    };
    if (orgPrice.val().trim() === '') {
        $('html,body').scrollTop(orgPrice.parents('.row').offset().top - 80);
        orgPrice.focus().addClass('warmIpt').attr('placeholder', '尚未輸入商品原始定價！');
        return check = false, errorTitle = '銷售資訊', errorText = '請確認商品原始定價的欄位有確實填寫！';
    };
    if (specPrice.val().trim() === '') {
        $('html,body').scrollTop(specPrice.parents('.row').offset().top - 80);
        specPrice.focus().addClass('warmIpt').attr('placeholder', '尚未輸入商品的銷售價格！');
        return check = false, errorTitle = '銷售資訊', errorText = '請確認商品銷售價格的欄位有確實填寫！';
    };
    if (specQty.val().trim() === '') {
        $('html,body').scrollTop(specQty.parents('.row').offset().top - 80);
        specQty.focus().addClass('warmIpt').attr('placeholder', '尚未輸入商品數量！');
        return check = false, errorTitle = '銷售資訊', errorText = '請確認商品數量的欄位有確實填寫！';
    };
    // 至少開啟一種物流選項
    let feezResult = feez.find('.feezStatus').is(function () {
        return $(this).val() == "1";
    });
    if (!feezResult) {
        $('html,body').scrollTop(feez.parents('.row').offset().top - 80);
        return check = false, errorTitle = '其他資訊', errorText = '運費設定：請至少開啟一種物流選項！';
    };
    // 至少設定一種商品介紹
    if (contentz.getLength() === 1) {
        $('html,body').scrollTop($('.desciptions').offset().top - 80); // 介紹的頂端位置
        return check = false, errorTitle = '商品介紹', errorText = '請至少設定一個標籤、介紹！';
    }
    else {
        return check = true, errorText = "";
    };
};

$().ready(function () {
    // 當視窗置適應時，改動 page-footer 的寬度
    let focusz = $('.card').width();
    $('.page-footer .card').css('max-width', focusz + 'px');
    $(window).on('resize', function () {
        focusz = $('.card').width();
        $('.page-footer .card').css('max-width', focusz + 'px');
    });
    // 當到達視窗最底部時，改動 page-footer
    let bottomz = $(document).height() - $(window).height() - 22;
    $(window).on('scroll', function () {
        if (!$('.topbar-toggler').hasClass('toggled')) {
            if ($(window).scrollTop() >= bottomz) {
                $('.page-footer').addClass('active');
            } else {
                $('.page-footer').removeClass('active');
            }
        }
    });
    // 
    $('.topbar-toggler').on('click', function () {
        if ($('.page-footer').hasClass('active')) {
            $('.page-footer').removeClass('active');
        } else {
            $('.page-footer').addClass('active');
        };
    });
    // 返回
    btnReturn.on('click', function () {
        if (confirm("您填寫的內容可能不會進行儲存，確定要回到上一頁嗎？")) {
            window.history.go(-1);
        };
    });
    // 商品分類 取得所有分類 
    btnEditCls.on('click', function () {
        // 點擊時，判斷是否有取過資料 1.有，就繼續使用資料做編輯設定 2.沒有，則取資料做第一層父層分類的渲染
        edit_pdtCls = $('.edit_pdtCls');
        if (edit_pdtCls.html() == "") { // 判斷是否有紀錄值
            // 
            html = "";
            // 取得 所有的分類類別 做渲染
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
                        // 主層
                        first = $.extend(true, [], callBackData);
                        sortz.find('.list-group').html(html); // 如果沒有做儲存的動作，清空已渲染的父、子層
                        selectedList.html(html); //  如果沒有做儲存的動作，清空渲染的已選擇類別
                        btnSaveCls.prop('disabled', true); // 鎖定設定按鈕
                        // 先做第一層分類別渲染
                        for (let i = 0; i < first.length; i++) {
                            html += `
                                <li class="list-group-item list-group-item-action">
                                    <span data-num="${first[i].Id}" class="abridged1" title="${first[i].Name}">${first[i].Name}</span>
                                    <input type="hidden" value="${first[i].Enable}">
                                    <span><i class="fas fa-chevron-right"></i></span>
                                </li>
                            `;
                        };
                        sortz.find('.list-group').eq(0).html(html);
                    };
                } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    // getLogout();
                };
            };
            xhr.open('GET', `${URL}CategoryAdmin`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(null);
        } else {
            // 有的話，保留已渲染的類別列表
        };
    });
    // 點擊父層分類
    $(document).on('click', '.sortz .list-group:nth-child(1) li', function () {
        let trz = $(this).find('span').data('num');
        // 次層
        second = $.map(first, function (item, index) {
            if (trz == item.Id) {
                return item.SubCategories;
            }
        });
        btnSaveCls.prop('disabled', true); // 重置：重選父層類別的話，鎖定設定按鈕
        sortz.find('.list-group').eq(2).html(''); // 重置：重選父層類別的話，已渲染的子層類別要清空
        $(this).addClass('active').siblings().removeClass('active'); // 點擊效果
        selected = "";
        selectA = `<span class="sort-item" data-num="${trz}">${$(this).find('span').text()}</span>`;
        selected = selectA;
        selectedList.html(selected);
        html = "";
        for (let i = 0; i < second.length; i++) {
            if (second[i].SubCategories == "" || second[i].SubCategories == [] || second[i].SubCategories == null) { //確認第二層是否有子層
                html += `
                    <li class="list-group-item list-group-item-action">
                        <span data-num="${second[i].Id}" class="abridged1" title="${second[i].Name}">${second[i].Name}</span>
                        <input type="hidden" value="${second[i].Enable}">
                    </li>
                `;
            } else {
                html += `
                    <li class="list-group-item list-group-item-action">
                        <span data-num="${second[i].Id}" class="abridged1" title="${second[i].Name}">${second[i].Name}</span>
                        <span><i class="fas fa-chevron-right"></i></span>
                        <input type="hidden" value="${second[i].Enable}">
                    </li>
                `;
            }
        }
        sortz.find('.list-group').eq(1).html(html);
    });
    // 
    $(document).on('click', '.sortz .list-group:nth-child(2) li', function () {
        let trz = $(this).find('span').data('num');
        third = $.map(second, function (item, index) {
            if (trz == item.Id) {
                let obj = {
                    "Id": item.Id,
                    "Parent_id": item.Parent_id,
                    "Name": item.Name,
                    "Enable": item.Enable,
                    "SubCategories": item.SubCategories
                }
                return obj;
            }
        });
        btnSaveCls.prop('disabled', true); // 重置：重選父層類別的話，鎖定設定按鈕
        $(this).addClass('active').siblings().removeClass('active');
        selectB = `<span class="sort-item" data-num="${$(this).find('span').data('num')}">${$(this).find('span').text()}</span>`;
        selected = selectA + arrow + selectB;
        selectedList.html(selected);
        html = "";
        if (third[0].SubCategories == "" || third[0].SubCategories == [] || third[0].SubCategories == null) {
            sortz.find('.list-group').eq(2).html(''); // 重置：重選父層類別的話，已渲染的子層類別要清空
            btnSaveCls.prop('disabled', false); // 已是最後一層鎖，開啟設定按鈕
        } else {
            for (let i = 0; i < third[0].SubCategories.length; i++) {
                html += `
                    <li class="list-group-item list-group-item-action">
                        <span data-num="${third[0].SubCategories[i].Id}" class="abridged1" title="${third[0].SubCategories[i].Name}">${third[0].SubCategories[i].Name}</span>
                        <input type="hidden" value="${third[0].SubCategories[i].Enable}">
                    </li>
                `;
            };
            sortz.find('.list-group').eq(2).html(html);
        };

    });
    // 點擊子層
    $(document).on('click', '.sortz .list-group:nth-child(3) li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        selectC = `<span class="sort-item" data-num="${$(this).find('span').data('num')}">${$(this).find('span').text()}</span>`;
        selected = selectA + arrow + selectB + arrow + selectC;
        selectedList.html(selected);
        btnSaveCls.prop('disabled', false);
    });
    // 儲存按鈕 將已選擇類別渲染到商品分類欄位
    btnSaveCls.on('click', function () {
        edit_pdtCls.html(selectedList.html());
        clsObj = {
            "Cid1": "",
            "Cid2": "",
            "Cid3": ""
        };
        clsArr = [];
        for (let i = 0; i < edit_pdtCls.find('.sort-item').length; i++) {
            clsArr.push(edit_pdtCls.find('.sort-item').eq(i).data('num'));
        };
        for (let i = 0; i < Object.keys(clsObj).length; i++) {
            if (clsArr[i] == "" || clsArr[i] == undefined) {
                delete clsObj[`Cid${i + 1}`];
            } else {
                clsObj[`Cid${i + 1}`] = clsArr[i]
            }
        };
        $(this).parents('.modal-content').find('.close').trigger('click');
        console.log(clsObj)
    });
    // 從 localStorage 取編號，用於呼叫要編輯的商品訊息
    let num = localStorage.getItem('itemNum');
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            if (xhr.responseText !== "") {
                let callBackData = JSON.parse(xhr.responseText);
                // 將取得的內容渲染至編輯頁面上

                // 商品圖片
                let titleImgURL = `./img/products/${callBackData.Id}/${callBackData.Product_Cover}`;
                edit_titImg.parents('.fileinput').addClass('fileinput-exists').removeClass('fileinput-new');
                edit_titImg.parents('.fileinput').find('.fileinput-preview').html(`<img src="${titleImgURL}" alt="">`);
                let picArr = edit_picImag.parents('.fileinput');
                for (let i = 0; i < picLens; i++) {
                    if (callBackData[`Product0${picLens - i}`] !== "" && callBackData[`Product0${picLens - i}`] !== null) {
                        let picImgURL = `./img/products/${callBackData.Id}/${callBackData[`Product0${picLens - i}`]}`;
                        picArr.eq(i).addClass('fileinput-exists').removeClass('fileinput-new');
                        picArr.eq(i).find('.fileinput-preview').html(`<img src="${picImgURL}" alt="">`);
                        // 紀錄已有的圖片
                        imgArr[picLens - 1 - i] = callBackData[`Product0${picLens - i}`];
                    };
                };
                // 商品名稱
                edit_pdtName.val(callBackData.Title);
                // 商品分類
                if (callBackData.ProductCategory !== "") {
                    edit_pdtCls.attr('data-num', callBackData.ProductCategory.Id);
                    clsObj = {
                        "Cid1": callBackData.ProductCategory.Cid1,
                        "Cid2": callBackData.ProductCategory.Cid2,
                        "Cid3": callBackData.ProductCategory.Cid3
                    };
                    // 取得 所有的分類類別 做渲染
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                let callBackData = JSON.parse(xhr.responseText);
                                html = "";
                                // 產生第一層主層分類，後續由點擊事件產生
                                first = $.extend(true, [], callBackData);
                                btnSaveCls.prop('disabled', false); // 開啟設定按鈕：一定會是開啟狀態
                                // 第一層分類別渲染
                                for (let i = 0; i < first.length; i++) {
                                    html += `
                                        <li class="list-group-item list-group-item-action">
                                            <span data-num="${first[i].Id}" class="abridged1" title="${first[i].Name}">${first[i].Name}</span>
                                            <input type="hidden" value="${first[i].Enable}">
                                            <span><i class="fas fa-chevron-right"></i></span>
                                        </li>
                                    `;
                                };
                                sortz.find('.list-group').eq(0).html(html);

                                // 點擊事件產生原商品分類項目
                                $('.sortz .list-group:nth-child(1) li').find(`span[data-num="${clsObj.Cid1}"]`).trigger('click');
                                $('.sortz .list-group:nth-child(2) li').find(`span[data-num="${clsObj.Cid2}"]`).trigger('click');
                                if (clsObj.Cid3 !== "" && clsObj.Cid3 !== null && clsObj.Cid3 !== undefined) {
                                    $('.sortz .list-group:nth-child(3) li').find(`span[data-num="${clsObj.Cid3}"]`).trigger('click');
                                };
                                edit_pdtCls.html(selected);
                                clsArr = [];
                                for (let i = 0; i < edit_pdtCls.find('.sort-item').length; i++) {
                                    clsArr.push(edit_pdtCls.find('.sort-item').eq(i).data('num'));
                                };
                                for (let i = 0; i < Object.keys(clsObj).length; i++) {
                                    if (clsArr[i] == "" || clsArr[i] == undefined) {
                                        delete clsObj[`Cid${i + 1}`];
                                    } else {
                                        clsObj[`Cid${i + 1}`] = clsArr[i]
                                    };
                                };
                            };
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                            // getLogout();
                        };
                    };
                    xhr.open('GET', `${URL}CategoryAdmin`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send(null);
                };
                // 上、下架日期
                if (callBackData.Starts_At) {
                    let start = dateChange(callBackData.Starts_At); // yyyy-mm-dd
                    edit_pdtStart.val(start);
                };
                if (callBackData.Ends_At) {
                    let end = dateChange(callBackData.Ends_At); // yyyy-mm-dd
                    edit_pdtEnd.val(end);
                };
                // 商品狀態
                if (callBackData.Recommend !== "") {
                    popuzStatus.val(callBackData.Recommend);
                };
                // 銷售資訊
                edit_orgPrice.val(callBackData.Price);

                specz.attr('data-num', callBackData.SellInfos[0].Id); // 已有的規格 Id
                specz.data('enabled', callBackData.SellInfos[0].Enabled);
                edit_specPrice.val(callBackData.SellInfos[0].Sell_Price);
                edit_specQty.val(callBackData.SellInfos[0].Start_Stock_Qty);
                // 運費資訊
                if (feeEnable !== 0) {
                    feezSet.html(''), html = "";
                    for (let i = 0; i < callBackData.Logistics.length; i++) {
                        // 通路設定
                        if (callBackData.Logistics[i].Code == 0) {
                            code = "SevenEleven";
                            logistics = "7-11";
                        } else if (callBackData.Logistics[i].Code == 1) {
                            code = "FamilyMart";
                            logistics = "全家";
                        } else if (callBackData.Logistics[i].Code == 2) {
                            code = "HiLife";
                            logistics = "萊爾富";
                        } else if (callBackData.Logistics[i].Code == 3) {
                            code = "HomeDelivery";
                            logistics = "宅配";
                        };
                        html += `
                            <li class="list-group-item add_feez" data-num="${code}">
                                <span class="feezName" data-ofeez="${callBackData.Logistics[i].Shipping_Fee}">${logistics}</span>
                                <span class="fee-block">
                                    <div class="feez">NT$ <span>${callBackData.Logistics[i].Shipping_Fee}</span> 元</div>
                                    <div class="btnSetFee" data-toggle="modal" data-target="#setFeeModal"><i class="fas fa-edit"></i></div>
                                    <div class="switch-block">
                                        <div class="custom-control custom-switch">
                                            <input type="checkbox" class="custom-control-input edit_status feezStatus" value="${callBackData.Logistics[i].Enable}" id="feezSwitch${callBackData.Logistics[i].Code}">
                                            <label class="custom-control-label" for="feezSwitch${callBackData.Logistics[i].Code}">開啟</label>
                                        </div>
                                    </div>
                                </span>
                            </li>
                        `;
                    };
                    feezSet.html(html);

                    add_feez = $('.add_feez'); // 重新取得各個物流資訊
                    // 運費設定
                    $('.btnSetFee').on('click', function () {
                        let e = $(this).parents('.list-group-item'), ofeez = e.find('.feezName').data('ofeez'); // 紀錄最初渲染的運費
                        html = "";
                        html = `
                            <div class="modal-header">
                                <h4 class="modal-title">配送方式 <span>${e.find('.feezName').text().trim()}</span> / 運費設定</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="form-group col-md-auto">
                                    <label>運費設定</label>
                                    <div class="check-block">
                                        <input type="text" class="form-control mb-2 edit_feez numberz" value="${e.find('.feez span').text().trim()}">
                                        <span>元</span>
                                    </div>
                                </div>
                                <div class="form-group col-md-auto check-block">
                                    <input class="feezSetOnly" type="checkbox" id="blankCheckbox">
                                    <label for="blankCheckbox">由我方（賣家）負擔運費！</label>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary btnSaveFeez">儲存並開啟此物流方式</button>
                                <button type="button" class="btn btnCancel" data-dismiss="modal">取消</button>
                            </div>                
                        `;
                        feezs.html(html);

                        let edit_feez = $('.edit_feez'), chk = $('.feezSetOnly');
                        //  如果取得的運費是 0 元 運費設定顯示為 0 元、負擔運費狀態打勾
                        if (edit_feez.val() == 0) {
                            chk.val('1'), chk.prop('checked', true);
                            fee = ofeez;
                        } else {
                            chk.val('0'), chk.prop('checked', false);
                        };
                        // 運費設定
                        edit_feez.on('change', function () {
                            if ($(this).val().trim() == 0 || $(this).val().trim() == "") {
                                $(this).val('0');
                                chk.val('1'), chk.prop('checked', true);
                            } else {
                                chk.val('0'), chk.prop('checked', false);
                            };
                            fee = parseInt($(this).val().trim());
                        });
                        // 負擔運費的狀態控制
                        chk.on('change', function () {
                            if ($(this).prop('checked') == true) {
                                $(this).val('1');
                                fee = edit_feez.val();
                                edit_feez.val('0');
                            } else {
                                $(this).val('0');
                                edit_feez.val(fee);
                            };
                        });
                        // 更新運費顯示的費用及狀態
                        let btnSaveFeez = $('.btnSaveFeez');
                        btnSaveFeez.on('click', function () {
                            e.find('.feez span').text(edit_feez.val());
                            e.find('.feezStatus').prop('checked', true).val('1');
                            $(this).parents('.feezs').find('.close').trigger('click');
                        });
                    });
                } else {
                    add_feez.find('.fee-block').find('.btnSetFee').remove();
                    add_feez.find('.fee-block').find('.switch-block').remove();
                    add_feez.find('.fee-block').append(`<input type="hidden" class="feezStatus" value="1">`);

                    add_feez = $('.add_feez'); // 重新取得各個物流資訊
                };
                // 商品介紹
                // edit_pdtTabz.eq(0).find('input').val(callBackData.Detail.Title1);
                quill_0.setContents(JSON.parse(callBackData.Detail.Introduction1).ops);

                // 各個狀態顯示
                let chk = $('.edit_status');
                for (let i = 0; i < chk.length; i++) {
                    if (chk.eq(i).val() == "1") {
                        chk.eq(i).prop('checked', true);
                    } else {
                        chk.eq(i).prop('checked', false);
                    };
                };
            }
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    };
    xhr.open('GET', `${URL}ProductAdmin/${num}`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(null);
    // Switch 狀態切換對應傳送值的變化 // 取得頁面上所有的 switch
    $(document).on('change', '.custom-control-input', function () {
        if ($(this).prop('checked') == true) {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    });
    // 設定上架日期 MinDate
    let thisDate = new Date().toISOString().split('T')[0];
    edit_pdtStart.attr('min', thisDate), edit_pdtEnd.attr('min', thisDate);
    // 設定下架日期 MinDate
    edit_pdtStart.on('change', function () {
        let overDate = $('.edit_pdtStart').val();
        edit_pdtEnd.val('');
        edit_pdtEnd.attr('min', overDate);
    });
    // 行銷資訊
    $(document).on('change', '.edit_orgPrice', function () {
        if (Number($('.edit_specPrice').val().trim()) !== 0) {
            $('.edit_specPrice').val('');
        };
    });
    $(document).on('change', '.edit_specPrice', function () {
        if (Number($('.edit_orgPrice').val().trim()) > 0) {
            if ($(this).val() >= Number($('.edit_orgPrice').val().trim())) {
                alert("無效設定：商品售價不得高於商品定價！");
                $(this).val('');
            };
        } else {
            alert("無效設定：請先設定商品定價！");
            $(this).val('');
        };
    });
    // 圖片驗證
    imgFile.on('change', function () {
        let file = $(this);
        let num = $(this).parents('.pics').index();
        if (file[0].files.length !== 0) {
            imgUpdateCheck(file); // 檢查
            imgArr[num] = file[0].files[0].name // 上傳檔案 紀錄圖片名稱
        };
    });
    // 如果清除圖片，就清除圖片紀錄
    $('.btnClrImg').on('click', function () {
        let num = $(this).parents('.pics').index();
        imgArr[num] = null // 清除檔案 紀錄 NULL
    });
    // 修改
    btnEdit.on('click', function () {
        // 上下架狀態
        if ($(this).hasClass('on')) {
            enable = 1;
            confirmContent = "您確認要更新並上架此商品嗎？";
        } else {
            enable = 0;
            confirmContent = "您確認要更新並下架此商品嗎？";
        };
        dataUpdateCheck(idz, edit_pdtName, edit_pdtCls, edit_orgPrice, edit_specPrice, edit_specQty, add_feez, quill_0);
        if (check == true) {
            // 銷售資訊
            specz = $('.specz'); // 取頁面上所有的商品規格（包含動態產生）
            let specObj, specArr = new Array();
            for (let i = 0; i < specz.length; i++) {
                specObj = {
                    "Title": edit_pdtName.val().trim(),
                    "Enabled": specz.eq(i).data('enabled'),
                    "SellPrice": specz.eq(i).find('.edit_specPrice').val().trim(),
                    "StockQty": specz.eq(i).find('.edit_specQty').val().trim(),
                    "SafetyStockQty": specz.eq(i).find('.edit_specQty').val().trim(),
                    "DiscountPrice": "0",
                    "DiscountPercent": "0"
                };
                specArr.push(specObj);
            };
            // 物流資訊
            let feezObj, feezArr = new Array();
            for (let i = 0; i < add_feez.length; i++) {
                feezObj = {
                    "Code": add_feez.eq(i).find('.feezName').data('num'),
                    "ShippingFee": Number(add_feez.eq(i).find('.feez span').text().trim()),
                    "Enable": Number(add_feez.eq(i).find('.feezStatus').val())
                }
                feezArr.push(feezObj);
            };
            // 商品介紹
            let tabzObj1, tabzObj2;
            // 取得圖片的名稱包成陣列
            let file1 = $('#tit1').find('.ql-editor').find('img');
            if (file1) {
                fNameArr1 = [];
                for (let i = 0; i < file1.length; i++) {
                    fNameArr1.push(file1.eq(i).attr('src').split('/').pop());
                };
            };
            tabzObj1 = {
                "Title1": "Title1",
                "Introduction1": JSON.stringify(quill_0.getContents())
            };
            let file2 = $('#tit1').find('.ql-editor').find('img');
            if (file2) {
                fNameArr2 = [];
                for (let i = 0; i < file2.length; i++) {
                    fNameArr2.push(file2.eq(i).attr('src').split('/').pop());
                };
            };
            tabzObj2 = {
                "Title2": "",
                "Introduction2": ""
            };
            fNameArr = fNameArr1.concat(fNameArr2);
            if (confirm(confirmContent)) {
                // 將要新增的資料放入 FormData
                let dataObj = new FormData();
                dataObj.append('product_cover', edit_titImg[0].files[0]);
                for (let i = 0; i < picLens; i++) {
                    if (edit_picImag[i].files[0]) {
                        dataObj.append(`Product0${i + 1}`, edit_picImag[i].files[0]);
                    } else { // 如果沒有就保持原來的 (原有圖片 或者 "")
                        dataObj.append(`Product0${i + 1}`, imgArr[i]);
                    };
                };
                dataObj.append('Title', edit_pdtName.val().trim());
                dataObj.append("Enabled", enable);
                dataObj.append("Recommend", popuzStatus.val().trim());
                dataObj.append("SellStop", "0");
                dataObj.append("ViewStock", "0");
                dataObj.append("ViewSellNum", "0");
                dataObj.append("Lead_Time", 7);
                dataObj.append("PreserveStatus", 0); // 0 為正常
                dataObj.append("ProductStatus", "");
                dataObj.append("StartsAt", edit_pdtStart.val().trim());
                dataObj.append("EndsAt", edit_pdtEnd.val().trim());
                dataObj.append("Spec", "");
                dataObj.append("Describe", "");
                dataObj.append("Price", edit_orgPrice.val().trim());
                dataObj.append("SellInfos", JSON.stringify(specArr));
                dataObj.append("Marketing_Title", "");
                dataObj.append("Marketing_Starts_At", "");
                dataObj.append("Marketing_Ends_At", "");
                dataObj.append("Logistics", JSON.stringify(feezArr));
                dataObj.append("Detail", JSON.stringify(Object.assign(tabzObj1, tabzObj2)));
                dataObj.append('fNameArr', fNameArr);
                dataObj.append("ProductCategory", JSON.stringify(clsObj));
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改商品成功！");
                        window.location.href = "./itemslist.html";
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                        // getLogout();
                    };
                };
                xhr.open('PUT', `${URL}ProductAdmin/${num}`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);
            }
        } else {
            // 提示
            $.notify({
                // options
                title: errorTitle,
                message: errorText
            }, {
                // settings
                type: 'danger',
                placement: {
                    from: "top",
                    align: "center"
                },
                offset: 40,
                delay: 600,
                timer: 2000,
            });
        };
    });
    // 取消
    btnCancel.on('click', function () {
        if (confirm("尚未儲存更改的內容，確定要取消嗎？")) {
            window.location.href = "./itemslist.html";
        }
    });
    // 商品介紹
    // 在編輯器點擊圖片上傳，選擇好圖片時就上傳並且能夠以路徑的URL預覽
    let addImg = $('.edit_cntsImg');
    let toolbar1 = quill_0.getModule('toolbar');
    toolbar1.addHandler("image", function () { // 將 quill 編輯器的圖片功能轉為自訂義圖片上傳
        addImg.eq($('.edit_pdtTabz').find('a.active').parent().index()).trigger('click');
        addImg.eq($('.edit_pdtTabz').find('a.active').parent().index()).on('change', function () {
            let file = $(this);
            if (imgUpdateCheck(file)) {
                let dataObj = new FormData();
                dataObj.append('uploadImage', file[0].files[0]);

                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData !== "") {
                            console.log(callBackData)
                            // 獲取編輯器當前 focus 的位置
                            let selection = quill_0.getSelection(true);
                            // 調用函式 insertEmbed 將圖片顯示於編輯器上
                            quill_0.insertEmbed(selection.index, 'image', callBackData.Image_Link); // path 為回傳值的路徑
                        };
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        // getLogout();
                    };
                };
                xhr.open('POST', `${URL}ProductAdmin/AddImage`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);

                file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            };
        });
    });
    let toolbar2 = quill_1.getModule('toolbar');
    toolbar2.addHandler("image", function () { // 將 quill 編輯器的圖片功能轉為自訂義圖片上傳
        addImg.eq($('.edit_pdtTabz').find('a.active').parent().index()).trigger('click');
        addImg.eq($('.edit_pdtTabz').find('a.active').parent().index()).on('change', function () {
            let file = $(this);
            if (imgUpdateCheck(file)) {
                let dataObj = new FormData();
                dataObj.append('uploadImage', file[0].files[0]);

                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 201) {
                        let callBackData = JSON.parse(xhr.responseText);
                        if (callBackData !== "") {
                            // 獲取編輯器當前 focus 的位置
                            let selection = quill_1.getSelection(true);
                            // 調用函式 insertEmbed 將圖片顯示於編輯器上
                            quill_1.insertEmbed(selection.index, 'image', callBackData.Image_Link); // path 為回傳值的路徑
                        };
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        // getLogout();
                    };
                };
                xhr.open('POST', `${URL}ProductAdmin/AddImage`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);

                file.val(''); // 重置檔案上傳欄位的內容，避免重複出現預覽圖片
            };
        });
    });
});
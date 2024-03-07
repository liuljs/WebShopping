// 宣告要帶入的欄位
let btnCancel = $('.btnCancel'), btnAdd = $('.btnAdd');
let confirmContent, enable = 1; // 預設為上架

let imgFile = $('.imgFile'), add_titImg = $('.add_titImg'), add_picImag = $('.add_picImag'), picLens = add_picImag.length; // 上傳筆數
// 基本資訊
let add_pdtName = $('.add_pdtName');
// 商品分類
let selected, selectA, selectB, selectC; // 紀錄已選擇的分類 value 用做渲染
let arrow = `<span class="arrow-mark">&gt;</span>`; // > 符號
let first = new Array(), second = new Array(), third = new Array(), clsArr = new Array();
let clsObj = {
    "Cid1": "",
    "Cid2": "",
    "Cid3": ""
};
let btnEditCls = $('.btnEditCls'), add_pdtCls = $('.add_pdtCls');
let sortz = $('.sortz'), selectedList = $('.selectedList'), btnSaveCls = $('.btnSaveCls');
// 上下架時間
let add_pdtStart = $('.add_pdtStart'), add_pdtEnd = $('.add_pdtEnd');
// 商品各狀態
let popuzStatus = $('.popuzStatus');
// 行銷資訊
let specs = $(".specifications"), specz = $('.specz');
let add_orgPrice = $('.add_orgPrice'), add_specPrice = $('.add_specPrice'), add_specQty = $('.add_specQty');
// 其他資訊
let add_feez = $('.add_feez'), feezs = $('.feezs'), btnSetFee = $('.btnSetFee'), fee;
let feeEnable = 0;

// 商品介紹
// let add_pdtTabz = $('.add_pdtTabz');
let fNameArr1 = new Array(), fNameArr2 = new Array();
// 驗證
function dataUpdateCheck(aId, titImage, pdtName, pdtCls, orgPrice, specPrice, specQty, feez, contentz) {
    if (aId.trim() === '') {
        return check = false, errorText = '請確認必填欄位皆有填寫！';
    };
    if (titImage.val().trim() === '') {
        $('html,body').scrollTop(titImage.parents('.row').offset().top - 80);
        return check = false, errorTitle = '媒體管理', errorText = '封面圖片：請確認有選擇商品的封面照片！';
    };
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
        if (!$('.page-footer').hasClass('active')) {
            $('.page-footer').toggleClass('active');
        };
    });
    // Switch 狀態切換對應傳送值的變化
    let chk = $('.custom-control-input'); // 取得頁面上所有的 switch
    chk.val('0'); // 預設為 false;
    chk.on('change', function () {
        if ($(this).prop('checked') == true) {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    });
    // 設定上架日期 MinDate
    let thisDate = new Date().toISOString().split('T')[0];
    add_pdtStart.attr('min', thisDate), add_pdtEnd.attr('min', thisDate);
    // 設定下架日期 MinDate
    add_pdtStart.on('change', function () {
        let overDate = $('.add_pdtStart').val();
        add_pdtEnd.val('');
        add_pdtEnd.attr('min', overDate);
    });
    // 商品分類 取得所有分類 
    btnEditCls.on('click', function () {
        // 點擊時，判斷是否有取過資料 1.有，就繼續使用資料做編輯設定 2.沒有，則取資料做第一層父層分類的渲染
        add_pdtCls = $('.add_pdtCls');
        if (add_pdtCls.html() == "") { // 判斷是否有紀錄值
            // 
            html = "";
            // 取得 所有的分類類別 做渲染
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    let callBackData = JSON.parse(xhr.responseText);
                    if (callBackData !== "") {
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
        // 子層
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
        add_pdtCls.html(selectedList.html());
        clsArr = [];
        for (let i = 0; i < add_pdtCls.find('.sort-item').length; i++) {
            clsArr.push(add_pdtCls.find('.sort-item').eq(i).data('num'));
        };
        for (let i = 0; i < Object.keys(clsObj).length; i++) {
            if (clsArr[i] == "" || clsArr[i] == undefined) {
                delete clsObj[`Cid${i + 1}`];
            } else {
                clsObj[`Cid${i + 1}`] = clsArr[i]
            }
        };
        $(this).parents('.modal-content').find('.close').trigger('click');
    });
    // 行銷資訊
    $(document).on('change', '.add_orgPrice', function () {
        if (Number($('.add_specPrice').val().trim()) !== 0) {
            $('.add_specPrice').val('');
        };
    });
    $(document).on('change', '.add_specPrice', function () {
        if (Number($('.add_orgPrice').val().trim()) > 0) {
            if ($(this).val() >= Number($('.add_orgPrice').val().trim())) {
                alert("無效設定：商品售價不得高於商品定價！");
                $(this).val('');
            };
        } else {
            alert("無效設定：請先設定商品定價！");
            $(this).val('');
        };
    });
    // 運費設定
    if (feeEnable == 0) {
        add_feez.find('.fee-block').find('.btnSetFee').remove();
        add_feez.find('.fee-block').find('.switch-block').remove();
        add_feez.find('.fee-block').append(`<input type="hidden" class="feezStatus" value="1">`);
    } else {
        // 運費設定
        btnSetFee.on('click', function () {
            let e = $(this).parents('.list-group-item'), ofeez = e.find('.feezName').data('ofeez');
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
    };
    // 圖片驗證
    imgFile.on('change', function () {
        let file = $(this);
        if (file[0].files.length !== 0) {
            imgUpdateCheck(file); // 檢查
        };
    });
    // 新增
    btnAdd.on('click', function () {
        // 上下架狀態
        if ($(this).hasClass('on')) {
            enable = 1;
            confirmContent = "您確定要新增並上架此商品嗎？";
        } else {
            enable = 0;
            confirmContent = "您確定要新增並下架此商品嗎？";
        };
        // 驗證
        dataUpdateCheck(idz, add_titImg, add_pdtName, add_pdtCls, add_orgPrice, add_specPrice, add_specQty, add_feez, quill_0);
        if (check == true) {
            // 銷售資訊
            specz = $('.specz'); // 取頁面上所有的商品規格（包含動態產生）
            let specObj, specArr = new Array();
            let specEnabled = 1; // 預設為開啟狀態
            for (let i = 0; i < specz.length; i++) {
                specObj = {
                    "Title": add_pdtName.val().trim(),
                    "Enabled": specEnabled,
                    "SellPrice": parseInt(specz.eq(i).find('.add_specPrice').val().trim()),
                    "StockQty": parseInt(specz.eq(i).find('.add_specQty').val().trim()),
                    "SafetyStockQty": parseInt(specz.eq(i).find('.add_specQty').val().trim()),
                    "DiscountPrice": "0",
                    "DiscountPercent": "0"
                };
                specArr.push(specObj);
            };
            // 物流資訊
            let feezObj, feezArr = new Array();
            let feeLens = add_feez.length;
            for (let i = 0; i < feeLens; i++) {
                feezObj = {
                    "Code": add_feez.eq(i).find('.feezName').data('num'),
                    "ShippingFee": Number(add_feez.eq(i).find('.feez span').text().trim()),
                    "Enable": Number(add_feez.eq(i).find('.feezStatus').val())
                };
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
                dataObj.append('product_cover', add_titImg[0].files[0]);
                for (let i = 0; i < add_picImag.length; i++) {
                    if (add_picImag[i].files[0]) {
                        dataObj.append(`Product0${i + 1}`, add_picImag[i].files[0]);
                    };
                };
                dataObj.append('Title', add_pdtName.val().trim());
                dataObj.append("Enabled", enable);
                dataObj.append("Recommend", popuzStatus.val().trim());
                dataObj.append("SellStop", "0");
                dataObj.append("ViewStock", "0");
                dataObj.append("ViewSellNum", "0");
                dataObj.append("Lead_Time", 7);
                dataObj.append("PreserveStatus", 0); // 0 為正常
                dataObj.append("ProductStatus", "");
                dataObj.append("StartsAt", add_pdtStart.val().trim());
                dataObj.append("EndsAt", add_pdtEnd.val().trim());
                dataObj.append("Spec", "");
                dataObj.append("Describe", "");
                dataObj.append("Price", add_orgPrice.val().trim());
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
                    if (xhr.status == 200 || xhr.status == 201) {
                        alert("新增商品成功!");
                        window.location.href = "./itemslist.html";
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                    };
                };
                xhr.open('POST', `${URL}ProductAdmin/AddNewProduct`, true);
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
                xhr.send(dataObj);
            };
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
    let addImg = $('.add_cntsImg');
    let toolbar1 = quill_0.getModule('toolbar');
    toolbar1.addHandler("image", function () { // 將 quill 編輯器的圖片功能轉為自訂義圖片上傳
        addImg.eq($('.add_pdtTabz').find('a.active').parent().index()).trigger('click');
        addImg.eq($('.add_pdtTabz').find('a.active').parent().index()).on('change', function () {
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
                            let selection = quill_0.getSelection(true);
                            console.log(selection)
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
        addImg.eq($('.add_pdtTabz').find('a.active').parent().index()).trigger('click');
        addImg.eq($('.add_pdtTabz').find('a.active').parent().index()).on('change', function () {
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
                            console.log(selection)
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
require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    var $addModal = $("#addModal");
    var $sampleTable = $('#sampleTable');
    var $visaPagination = $("#visaPagination");
    var $searchCont = $("#searchCont");
    //按钮组集合
    var comButtons =
            '<button class="btn btn-primary" type="button" data-operate="edit">编辑</button>'+
            '<button class="btn btn-info" type="button" data-operate="look">查看</button>',
        startBouutn =  '<button class="btn btn-primary" type="button" data-operate="setOn">上架</button>',
        stopButton = '<button class="btn btn-danger" type="button" data-operate="setOff">下架</button>',
        soldOutButton = '<button class="btn btn-warning" type="button" data-operate="soldOut">售罄</button>',
        delButton = '<button class="btn btn-danger" type="button" data-operate="del">删除</button>';

    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    function getDateArr(){
        $("select[name=anchorId]").on("change",function(){
            var anchorId = $(this).val();
            $.cookie('anchorId',anchorId);
            if(anchorId!=''){
                var dateParam = {
                    pageNo: 1,
                    pageSize:50,
                    status:'',
                    title:'',
                    date:'',
                    anchorId:anchorId
                };
                utils.ajaxSubmit(apis.anchorGoodsDate.getLists, dateParam, function (data) {
                    var optionArr = '<option value="">请选择</option>';
                    $.each(data.dataArr,function(i,n){
                        n.statusText = consts.status.goodsText[n.status];
                        optionArr+= "<option value='"+ n.id +"'>"+ n.date + "&nbsp;&nbsp;" + n.title + "【" + n.statusText + "】" +"</option>";
                    });
                    $("select[name=dateId]").html("");
                    $("select[name=dateId]").html(optionArr);
                })
            }else{
                $("select[name=dateId]").html('<option value="">请选择</option>');
            }
            $("input[name=sort]").val("1");
        });
        $("select[name=source]").on("change",function(){
            if($(this).val()==2){
                $("input[name=url]").attr("placeholder","请输入商品淘口令");
                $("input[name=url]").parent().find("span").text("商品淘口令");
            }else{
                $("input[name=url]").attr("placeholder","请输入商品链接");
                $("input[name=url]").parent().find("span").text("商品链接");
            }
        });
        $(".close").on("click",function(){
            $.cookie('anchorId',$("select[name=anchorId]").val());
            $.cookie('dateId',$("select[name=dateId]").val());
            utils.ajaxSubmit(apis.goods.getMaxSortByDateId,{anchorId:$.cookie('anchorId'),dateId:$.cookie('dateId')},function(data){
                $.cookie('sort',data);
            });
        });
        $(".modal-footer").find("button").eq(1).on("click",function(){
            $.cookie('anchorId',$("select[name=anchorId]").val());
            $.cookie('dateId',$("select[name=dateId]").val());
            utils.ajaxSubmit(apis.goods.getMaxSortByDateId,{anchorId:$.cookie('anchorId'),dateId:$.cookie('dateId')},function(data){
                $.cookie('sort',data);
            });
        })
    }

    //新增商品
    $addModal.on("click",function(){
        var initialData = {
            dataArr:{
                anchorArr:{
                    id:$.cookie('anchorId')
                },
                dateArr:{
                    id:$.cookie('dateId')
                },
                categoryArr:{},
                sort:$.cookie('sort')
            },
            anchorArr:anchorArr,
            categoryArr:categoryArr,
            dateArr:dateArr
        };
        utils.renderModal('新增商品', template('modalDiv',initialData), function(){
            if($("#visaPassportForm").valid()){
                utils.ajaxSubmit(apis.goods.create,$("#visaPassportForm").serialize(),function(data){
                    $.cookie('anchorId',$("select[name=anchorId]").val());
                    $.cookie('dateId',$("select[name=dateId]").val());
                    utils.ajaxSubmit(apis.goods.getMaxSortByDateId,{anchorId:$.cookie('anchorId'),dateId:$.cookie('dateId')},function(data){
                        $.cookie('sort',data);
                    });
                    hound.success("添加成功","",1000);
                    utils.modal.modal('hide');
                    param.pageNo = 1;
                    loadData();
                })
            }
        }, 'lg');
        uploadFile();
        getDateArr();
        $("select[name=dateId]").on("change",function(){
            var anchorId = $("select[name=anchorId]").val();
            var dateId = $(this).val();
            $.cookie('dateId',dateId);
            utils.ajaxSubmit(apis.goods.getMaxSortByDateId,{anchorId:anchorId,dateId:dateId},function(data){
               $("input[name=sort]").val(data);
            })
        })
    })
    function blobToDataURL(blob,cb) {
        var reader = new FileReader();
        reader.onload = function (evt) {
            var base64 = evt.target.result
            cb(base64)
        };
        reader.readAsDataURL(blob);
    }

    var picFile = "";
    function uploadFile(){
        //选择图片文件
        $(".uploadImg").change(function(){
            //判断是否支持FileReader
            if (window.FileReader) {
                var reader = new FileReader();
            } else {
                hound.alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
            }
            var file = this.files[0];
            reader.onload = function(e) {
                //获取图片dom
                $(".imgUrl").html('<i class="fa fa-image mr-2"></i>' + file.name)
                if(file.name!=""){
                    $(".avatarUpload").removeAttr("disabled");
                    $(".avatarUpload").removeClass("btn-default");
                    $(".avatarUpload").addClass("btn-primary");
                }
            };
            reader.readAsDataURL(file);

            if(file){
                var url = URL.createObjectURL(file);
                var base64 = blobToDataURL(file,function(base64Url) {
                    picFile = base64Url;
                })
            }
        })
        // 上传图片文件
        $(".uploadFile").find('.avatarUpload').click(function () {
            $.ajax({
                type:'POST',
                url: "@@API",
                data: {
                    c:"img",
                    a:"uploadForBase64",
                    linkUserName:consts.param.linkUserName,
                    linkPassword:consts.param.linkPassword,
                    signature:consts.param.signature,
                    userToken: $.cookie('SESSIONUID'),
                    content:picFile
                },
                dataType: 'json',
                success: function (res) {
                    $(".imgUrl").html("");
                    $(".imgUrl").html("<a target='_blank' href='"+ res.result +"'>图片预览</a>");
                    $("input[name=coverImg]").val(res.result);
                }
            }).fail(function (jqXHR, textStatus) {
                hound.error('Request failed: ' + textStatus);
            });
        });
    }
    function copyText(){
        var btns = document.querySelectorAll('.copyBtn');
        var clipboard = new ClipboardJS(btns);
        clipboard.on('success', function(e) {
            hound.success("商品地址复制成功", "", 1000);
        });
        clipboard.on('error', function(e) {
            hound.error("商品地址复制失败", "", 1000);
        });
    }
    //页面操作配置
    var operates = {
        //编辑
        edit:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.goods.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    anchorArr:anchorArr,
                    categoryArr:categoryArr,
                    dateArr:dateArr
                };
                utils.renderModal('编辑商品', template('modalDiv', getByIdData), function(){
                    if($("#visaPassportForm").valid()) {
                        utils.ajaxSubmit(apis.goods.updateById, $("#visaPassportForm").serialize(), function (data) {
                            hound.success("编辑成功", "", 1000);
                            utils.modal.modal('hide');
                            loadData();
                        })
                    }
                }, 'lg');
                uploadFile();
                getDateArr();
            });
        },
        //查看
        look:function($this){
            var id = $this.closest("tr").attr("data-id");
            utils.ajaxSubmit(apis.goods.getById, {id: id}, function (data) {
                var getByIdData = {
                    dataArr:data,
                    anchorArr:anchorArr,
                    categoryArr:categoryArr,
                    dateArr:dateArr
                };
                utils.renderModal('查看商品', template('modalDiv', getByIdData),'', 'lg');
                $("#visaPassportForm").append($("fieldset").prop('disabled', true));
            });
        },
        //无效
        setOff:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认下架吗?', '', function () {
                utils.ajaxSubmit(apis.goods.offById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //有效
        setOn:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认上架吗?', '', function () {
                utils.ajaxSubmit(apis.goods.onById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        del:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认删除吗?', '', function () {
                utils.ajaxSubmit(apis.goods.delById, {id: id}, function (data) {
                    loadData();
                });
            });
        },
        //售罄
        soldOut:function($this){
            var id = $this.closest("tr").attr("data-id");
            hound.confirm('确认售罄吗?', '', function () {
                utils.ajaxSubmit(apis.goods.soldOutById, {id: id}, function (data) {
                    loadData();
                });
            });
        }
    }

    var param = {
        pageNo: 1,
        pageSize:10,
        status:'',
        title:'',
        anchorId:'',
        source:'',
        categoryId:'',
        dateId:'',
        date:''
    };

    var anchorArr;
    var categoryArr;
    var dateArr;
    function getDownLists(){
        var anchorParam = {
            pageNo: 1,
            pageSize:50,
            name:'',
            status:''
        };
        utils.ajaxSubmit(apis.anchor.getLists, anchorParam, function (data) {
            anchorArr = data.dataArr;
        });
        var categoryParam = {
            pageNo: 1,
            pageSize:50,
            title:'',
            status:'',
            orderBy:1
        };
        utils.ajaxSubmit(apis.category.getLists, categoryParam, function (data) {
            categoryArr = data.dataArr;
        });
        var dateParam = {
            pageNo: 1,
            pageSize:50,
            status:'',
            title:'',
            date:'',
            anchorId:''
        };
        utils.ajaxSubmit(apis.anchorGoodsDate.getLists, dateParam, function (data) {
            dateArr = data.dataArr;
            $.each(dateArr,function(i,n){
                n.statusText = consts.status.goodsText[n.status];
            })
        });
    }
    function loadData() {
        utils.ajaxSubmit(apis.goods.getLists, param, function (data) {
            $.each(data.dataArr,function(i,n){
                n.statusText = consts.status.goods[n.status];
                n.sourceText = consts.status.source[n.source];
                if(n.status=="1"){
                    n.materialButtonGroup = comButtons + stopButton + soldOutButton + delButton;
                }else if(n.status=="2"){
                    n.materialButtonGroup = comButtons + startBouutn + soldOutButton + delButton;
                }else if(n.status=="3"){
                    n.materialButtonGroup = comButtons + startBouutn + stopButton + delButton;
                }
            })
            data.anchorArr = anchorArr;
            data.categoryArr = categoryArr;
            data.dateArr = dateArr;
            data.anchorText = listDropDown.anchorText;
            data.categoryText = listDropDown.categoryText;
            data.sourceText = listDropDown.sourceText;
            data.statusText = listDropDown.statusText;
            data.dateText = listDropDown.dateText;
            $sampleTable.html(template('visaListItem', data));
            utils.bindPagination($visaPagination, param, loadData);
            $visaPagination.html(utils.pagination(parseInt(data.cnt), param.pageNo));
            $sampleTable.find('#date').val(param.date);
            copyText();
        });
    }
    // 页面首次加载列表数据
    getDownLists();
    setTimeout(function(){
        loadData();
    },100);
    utils.bindList($(document), operates);
    var listDropDown = {
        anchorText:'主播',
        categoryText:'分类',
        sourceText:'来源',
        statusText:'状态',
        dateText:'带货日期'
    };
    $sampleTable.on('click', '#dropStatusOptions a[data-id]', function () {
        param.status = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.statusText = "状态" : listDropDown.statusText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropAnchorOptions a[data-id]', function () {
        param.anchorId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.anchorText = "主播" : listDropDown.anchorText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropCategoryOptions a[data-id]', function () {
        param.categoryId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.categoryText = "分类" : listDropDown.categoryText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropSourceOptions a[data-id]', function () {
        param.source = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.sourceText = "来源" : listDropDown.sourceText = $(this).text();
        param.pageNo = 1;
        loadData();
    }).on('click', '#dropDateOptions a[data-id]', function () {
        param.dateId = $(this).data('id');
        ($(this).text()=="所有") ? listDropDown.dateText = "带货日期" : listDropDown.dateText = $(this).text();
        param.pageNo = 1;
        loadData();
    });
    setInterval(function () {
        var $date = $sampleTable.find('#date');
        if ($date.length === 1) {
            if ($date.val() !== param.date) {
                param.date = $date.val();
                param.pageNo = 1;
                loadData();
            }
        }
    },500);
    $("#search").on("click",function(){
        param.pageNo = 1;
        param.title = $("#searchCont").val();
        loadData();
    });
    $('#searchCont').on('keypress',function(event){
        if (event.keyCode == 13) {
            $('#search').click();
        }
    });
});
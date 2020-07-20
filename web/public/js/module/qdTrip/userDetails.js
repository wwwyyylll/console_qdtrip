require(["consts", "apis", "utils", "common"], function(consts, apis, utils) {
    var searchlabel = $(".searchlabel");
    searchlabel.on("click",function(){
        $("#selectsearchlabel").text($(this).text());
        $("#searchCont").val("");
        $("#searchCont").attr("data-id",'');
    })

    //页面操作配置
    var operates = {
        //查看
        look:function(id){
            utils.ajaxSubmit(apis.user.getById, {id: id}, function (data) {
                data.sourceText = consts.status.userDetailSource[data.source];
                var getByIdData = {
                    dataArr:data
                };
                $("#basicMessage").html(template('basicList', getByIdData));
                $("#basicMessage").find("input").prop('disabled', true);
            });
        },
        //允许登录
        allow:function($this){
            var id = $("input[name=id]").val();
            hound.reason('确认设为允许登录吗?','请输入允许登录原因',function(data){
                utils.ajaxSubmit(apis.user.allowLoginById, {id: id,reason:data}, function (data) {
                    operates.look(param[0]);
                });
            })
        },
        //禁止登录
        notAllow:function($this){
            var id = $("input[name=id]").val();
            hound.reason('确认设为禁止登录吗?','请输入禁止登录原因',function(data){
                utils.ajaxSubmit(apis.user.disableLoginById, {id: id,reason:data}, function (data) {
                    operates.look(param[0]);
                });
            })
        }
    }

    // 页面首次加载列表数据
    //打开的对应的页面nav + active属性
    var loc = location.href;
    var n1 = loc.length;//地址的总长度
    var n2 = loc.indexOf("=");//取得=号的位置
    var id = decodeURI(loc.substr(n2+1,n1-n2));//从=号后面的内容
    var param = id.split("=");

    operates.look(param[0]);
    $("#headerTab1").on("click",function(){
        operates.ranking(param[0]);
        $(this).css({color:"orange"});
        $("#headerTab2").css({color:"#555555"});
    })
    $("#headerTab2").on("click",function(){
        operates.dynamic(param[0]);
        $(this).css({color:"orange"});
        $("#headerTab1").css({color:"#555555"});
    })
    utils.bindList($(document), operates);
});
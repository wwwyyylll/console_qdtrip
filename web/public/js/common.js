define("common", ["consts", "apis", "utils"], function(consts, apis, utils) {
    //检验此时是否登录
    utils.ajaxSubmit(apis.login.isLogin,'',function(data){
        if(data.userToken==''){
            window.location.href = "@@HOST_tpl/view/login.html";
        }else{
            $(".app-sidebar__user-name").text(data.userName);
            $(".app-sidebar__user-designation").text(data.roleName);
        }
    })
    //退出登录
    $("#logout").on("click",function(){
        //$.removeCookie("userName",{ path: '/'});
        $.removeCookie("SESSIONUID",{ path: '/'});
        window.location.href = "@@HOST_tpl/view/login.html";
    });
    //打开的对应的页面nav + active属性
    var currentUrl = window.location.pathname;
    var itemArr = $(".treeview-item");
    if(currentUrl.length>1){
        $.each(itemArr,function(i,n){
            if($(this).attr("href").indexOf(currentUrl)!= -1){
                $(this).closest(".treeview").addClass("is-expanded");
                $(this).addClass("active");
            }
        });
    }
    //小铃铛的警告提示
    function warnList(){
        utils.ajaxSubmit(apis.warn.getLists, '', function (data) {
            $("#warnList").html(template('warnItem',data));
            $(".warnCnt").text(data.cnt);
            if(data.cnt>0){
                $(".warnCnt").css({display:"inline-block"});
                $(".warnCnt").parent().find("a").find("i").attr("id","bell");
            }else{
                $(".warnCnt").hide();
                $(".warnCnt").parent().find("a").find("i").removeAttr("id");
            }
        });
    }
    warnList();
});
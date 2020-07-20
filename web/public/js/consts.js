define("consts", function() {
    return {
        host: '@@HOST',
        apiBase: "@@API",
        viewBase: '@@HOST@@VIEW',
        param: {
            linkUserName:'dusiApi',
            linkPassword:'dusida#$fda#$%@idsf@#sefwww@^%',
            signature:'7a4a8e7e6f03cae8216070884ac79baf'
        },
        status:{
            ordinary:{
                '1':'<span style="color:green">有效</span>',
                '2':'<span style="color:red">无效</span>'
            },
            user:{
                '1':'<span style="color:green">允许登录</span>',
                '2':'<span style="color:red">禁止登录</span>'
            },
            userSource:{
                '1':'<span style="color:green">微信</span>',
                '2':'<span style="color:orange">机器人</span>'
            },
            userDetailSource:{
                '1':'微信',
                '2':'机器人'
            },
            goods:{
                '1':'<span style="color:green">上架</span>',
                '2':'<span style="color:red">下架</span>',
                '3':'<span style="color:orange">售罄</span>'
            },
            goodsText:{
                '1':'有效',
                '2':'无效',
                '3':'售罄'
            },
            source:{
                '1':'<span style="color:red">京东</span>',
                '2':'<span style="color:orange">淘宝</span>'
            },
            message:{
                '1':'<span style="color:orange">待回复</span>',
                '2':'<span style="color:green">已回复</span>'
            }
        }
    }
});
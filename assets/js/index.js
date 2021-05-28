$(function() {
    // 调用获取用户基本信息
    getUserInfo();
    // 定义getUserInfo() 获取用户基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // my 开头的请求 需要Authorization 身份认证字段
            // headers 就是请求头配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败!')
                    // console.log(res);
                renderAvatar(res.data);
            },
            // 不论ajax获取成功与否  都会调用 complete 回调函数
            // complete: function(res) {
            //     // console.log(res);
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 清空token
            //         localStorage.removeItem('token')
            //             // 跳转到login页面
            //         location.href = '/login.html'
            //     }
            // }
        })
    }
    // 渲染用户的头像
    function renderAvatar(user) {
        var name = user.nickname || user.username;
        // 渲染用户的文本
        $('#welcome').html('欢迎 &nbsp;&nbsp; ' + name)
            // 按需渲染用户头像
        if (user.user_pic !== null) {
            // 渲染头像
            $('.layui-nav-img').prop('src', user.user_pic).show()
            $('.layui-nav-img').siblings().hide();
            // $('.text-avatar').hide();
        } else {
            // 渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase();
            $('.text-avatar').html(first).show();
        }
    }

    // 实现退出按钮功能
    $('#btnLogout').on('click', function() {
        // 弹出询问是否退出框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地存储的token
            localStorage.removeItem('token');
            //重新跳转到登录页面
            location.href = '/login.html';
            // 插件自带的  用于关闭询问框
            layer.close(index);
        });
    })

})
$(function() {
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '昵称长度必须在1 ~ 6个字符之间！'
        }
    });

    // 初始化 获取用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                    // console.log(res);
                form.val('formUserInfo', res.data)
            }
        })
    };
    // 调用 initUserInfo()
    initUserInfo();
    // 实现重置表单的数据 功能
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo();
    });

    // 监听表单提交时间
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // $(this) 指向当前表单 serialize 获取表单值
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！');
                // 想在 iframe 中调用父页面中的函数可以用window.parent方法
                // bug BUG
                window.parent.getUserInfo();
                // parent.parent.getUserInfo();
                // top.window.parent.getUserInfo();
                // parent.getUserInfo();
                // window.parent.$('#btnLogout').html('123');

            }
        })
    })
})
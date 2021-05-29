$(function() {
    // 点击去注册链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
        $('#form_reg')[0].reset();
    });
    // 点击去登录链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从layui中获取form对象
    var form = layui.form;
    // 自定义校验规则
    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            repwd: function(value) {
                var pwd = $('.reg-box [name=password]').val()
                if (pwd !== value) return '两次密码不一致!'
            }
        })
        // 监听注册表单提交事件
        // var layer = layui.layer;
    $('#form_reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        let data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            // 发起ajax post请求
        $.post('/api/reguser', data, function(res) {
            // console.log(res);
            if (res.status !== 0) {
                $('#form_reg')[0].reset();
                return layer.msg(res.message);
            }
            layer.msg('注册成功,请登录')
                // 成功后自调用跳转到登录界面
            $('#link_login').click();
            $('#form_login [name=username]').val(data.username)
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    $('#form_login')[0].reset();
                    $('#form_login [name=username]').focus();
                    return layer.msg('登陆失败!')
                }
                layer.msg('登陆成功!');
                // 登陆成功后把令牌保存在本地
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})
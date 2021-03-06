$(function() {
    // 定义校验规则
    layui.form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            samePwd: function(value) {
                if (value === $('[name=oldPwd]').val()) return '新旧密码不能相同！'
            },
            rePwd: function(value) {
                if (value !== $('[name=newPwd]').val()) return '两次密码不一致！'
            }
        })
        // 更改密码功能
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                layui.layer.msg(res.message);
                $('.layui-form')[0].reset()
            }
        })
    })
})
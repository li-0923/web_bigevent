$(function() {
    // 获取文章分类列表信息
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                // 渲染表格数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 调用函数 获取数据
    initArtCateList();
    // 点击添加按钮弹出 弹出层 layer.open()
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            // type 设置类别  默认带确定按钮的弹出框  我们需要没有按钮的 把type设置为1
            type: 1,
            title: '添加文章分类',
            // 渲染模板引擎的数据
            content: $('#dialog-add').html(),
            // area 设置弹出框的宽高  默认 由内容撑开
            area: ['500px', '250px']
        })
    })

    // 通过代理的形式  因为是后创建的form表单直接添加事件添加不上
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                layui.layer.msg(res.message);
                // 添加成功 重新渲染页面
                initArtCateList();
                // 成功后应该自动关闭弹出框
                layui.layer.close(indexAdd);
            }
        })
    });
    // 为编辑按钮创建点击事件 因为都是后添加  需要代理
    let indexEdit = null
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layui.layer.open({
            // type 设置类别  默认带确定按钮的弹出框  我们需要没有按钮的 把type设置为1
            type: 1,
            title: '修改文章分类',
            // 渲染模板引擎的数据
            content: $('#dialog-edit').html(),
            // area 设置弹出框的宽高  默认 由内容撑开
            area: ['500px', '250px']
        });
        // 发起请求填充修改里的原内容
        // 请求需要上传id 获取自定义属性的存储的id
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 根据得到的信息 渲染 弹出框的内容
                // console.log(res);
                // console.log(res.data);
                layui.form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理 给表单添加检测提交事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    layui.layer.msg(res.message);
                    layui.layer.close(indexEdit)
                    initArtCateList();
                }
            })
        })
        // 通过代理 给删除按钮添加点击事件
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.get('/my/article/deletecate/' + id, function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg(res.message)
                initArtCateList();
            })
            layer.close(index);
        });
    })
})
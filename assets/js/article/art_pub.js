$(function() {
    // 初始化富文本编辑器
    initEditor()
        // 图片裁剪
        // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 定义加载文章分类的方法
    function initCate() {
        $.get('/my/article/cates', function(res) {
            if (res.status !== 0) return layui.layer.msg('初始化文章分类失败！')
                // console.log(res);
            var htmlStr = template('tpl-cate', res)
            $('[name=cate_id]').html(htmlStr);

            // form.render() 方法 重新加载函数
            layui.form.render();
        })
    }
    // 调用 initCate() 函数
    initCate();

    // 选择封面点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    // 监听coverFile  change 事件 获取选择的文件
    $('#coverFile').on('change', function(e) {
            var files = e.target.files;
            if (files.length === 0) return
            var newImgURL = URL.createObjectURL(files[0])
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章的发布状态
    var art_state = '已发布'
        // 为存为草稿添加点击事件
    $('#btnSave2').on('click', function() {
            art_state = '草稿'
        })
        // 为表单添加 检测提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()
            // 基于form表单 快速创建一个FormData对象 (原生dom元素)
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 数据添加到FormData 对象里
                fd.append('cover_img', blob)
                    // 发起ajax请求
                publishArticle(fd);
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message)
                location.href = '/article/art_list.html'
            }
        })
    }
})
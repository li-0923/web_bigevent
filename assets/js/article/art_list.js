$(function() {
    // 定义一个data 获取数据需要的参数
    var q = {
        pagenum: 1, // 页码值为1 默认显示第一页的数据
        pagesize: 2, // 每页显示的数据  默认每页两条
        cate_id: '', // 文章分类的id
        state: '' // 文章发布的状态
    };
    // 定义补零 美化时间过滤器 通过template.defaults.imports 定义
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n < 9 ? '0' + n : n
    }


    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layui.layer.msg('获取文章列表失败！');
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    initTable();

    // 初始化文章分类方法
    function initCate() {
        $.get('/my/article/cates', function(res) {
            if (res.status !== 0) return layui.layer.msg(res.message);
            var htmlStr = template('tpl-cate', res);
            $('[name=cate_id]').html(htmlStr)
            layui.form.render();
        })
    }
    initCate();
    // 实现筛选功能
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        // 根据 改变了q的信息 再次渲染
        initTable();
    });
    // 通过代理给编辑按钮添加 点击事件
    $('body').on('click', '.btn-edit', function() {
        layer.open({
            type: 1,
            title: '修改文章信息',
            content: '',
        });
    });
    // 通过代理给删除按钮添加 点击事件
    $('body').on('click', '.btn-delete', function() {
            layer.confirm('确认删除此文章吗?', { icon: 3, title: '提示' }, function(index) {
                var id = $('.btn-delete').attr('data-id')
                    // console.log(id);
                $.get('/my/article/delete/' + id, function(res) {
                    if (res.status !== 0) return layui.layer.msg(res.message)
                    layui.layer.msg(res.message)
                    initTable()
                })
                layer.close(index);
            });
        })
        // 定义分页 的函数 renderPage(total) 
    function renderPage(total) {
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            limits: [2, 3, 5, 8, 10],
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                if (!first) {
                    initTable();
                }
            }
        })
    }

})
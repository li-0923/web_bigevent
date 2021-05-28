// 每次调用$.get() / $.POST() / $.ajax()的时候都
// 会先调用ajaxPrefilter 这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // 实现  把需要权限的接口 同意设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载 complete 回调函数
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 清空token
            localStorage.removeItem('token')
                // 跳转到login页面
            location.href = '/login.html'
        }
    }
})
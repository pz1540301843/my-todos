(function(Vue) {
    // 初始化 页面路由
    function handleHashChange() {
        // 清空页面hash
        window.location.hash = "",
        // 默认页面为all
        vm.$root.visibility = "all"
    }
    // 初次加载时执行一次
    handleHashChange()




    let routes = [{path : "all"},{path : "activate"},{path : "accomplish"}]


// 监听window页面的hash值变化 获取当前的hash值 过滤赋值给 vm.visibility 当vm.visibility 变化时 用于对不同页面的数据渲染
window.addEventListener("hashchange",function() {
    console.log(window.location.hash);
    let visibility = ""
    visibility = window.location.hash.replace("#/","")
    let index = routes.findIndex( (v , i ) => {
        if(v.path == visibility) {
            return true
        }
    })
    
    if(index != -1 ) {
        vm.$root.visibility = visibility
    }else {
        vm.$root.visibility = "all"
        window.location.hash = ""
    }
})
})(Vue)
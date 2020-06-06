(function(Vue) {
    Vue.prototype.getUniqID = function () {
        return Date.now()
    }

    let storageKey = "mytodos";
    let mytodos = {};

    mytodos.storageFunc = {
        // 获取数据
        fetch : function () {
        return JSON.parse(localStorage.getItem(storageKey) || "[]") 
                            },
        // 保存数据(跟新最新数据)
        sava:function (todos) {
             localStorage.setItem(storageKey,JSON.stringify(todos))
                             }
            }

        window.mytodos = mytodos
})(Vue)
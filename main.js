(function(Vue) {

    const vm = new Vue({
        el: "#app",
        // 监听数据变化
       
      data:{
        visibility:"all"
      }
       
    })
    window.vm = vm
})(Vue)
(function(Vue){
    Vue.component("app-todos" ,{
        template:`
        <div>
        <div class="app-input">
        <div :class="['input-left' , {allcheck:allChecked}]"
        @click.stop="allCheckEvent"

        > &gt; </div>
        <div class="intpu-right">
            <input type="text" 
            placeholder="请输入内容" 
            v-model="inputVal"
            @keyup.enter="saveNewTodo" 
            v-focus 
            @input = "isInput"
           
            >
            <ul v-for="tip,index in tips" :key ="index"
                v-show = "prompt_box"
            >
                <li @click.stop = "addTodoFromTip(tip)">{{tip}}</li>
            </ul>
        </div>
       
    </div>

            <div class="app-conture"         
            v-for="item,index in filterTodos"
            :key="index"
            @mouseover="todoMouseOver(index)" 
            @mouseout = "todoMouseOut"
            >

        <div class="conture-left" >
            <input type="checkbox" v-model = "item.completed">
        </div>

        <div :class="['contunre-middle',{'completed':item.completed}]"  v-show="edit_index != index" @dblclick.stop.prevent="editTodo(index)" >{{item.content}}</div>
        <div  class="contunre-middle" v-if="edit_index == index" >

            <input type="text"
                @keyup.enter="saveEditTodo(index)"
                @keyup.esc="cancelEditTodo(index)"
                @blur = "saveEditTodo(index)"
                v-model = "item.content"
                v-focus 
            >
        </div>

        <div class="contunre-right" v-show="isindex == index" @click.stop="removeTodo(index)" >✖️</div>
    </div>

    <div class="app-bottom">
    <div class="bottom-left">剩下<span :style="{color: isred}">{{remaining.length?remaining.length:"0"}}</span>项</div>
        <div class="bottom-centre">
            <a href="#/all"> 
            <button :class="['centre-all',{active:visibility=='all'}]"> 
                All
             </button>
            </a>  
            <a href="#/activate">
            <button :class="['centre-activate',{active:visibility=='activate'}]">
                激活  
            </button>
            </a>    
            <a href="#/accomplish">
            <button :class="['centre-accomplish',{active:visibility=='accomplish'}]">
            完成   
            </button>
            </a> 
        </div>
        <div class="bottom-right" @click = "clearCompletedTodos">清除已完成</div>
    </div>
    </div>
        `,

        

        data : function() {
            return {
                    // 默认输入框的内容
                    inputVal:"",

                    // 默认输入的内容数据
                    todos:window.mytodos.storageFunc.fetch(),

                    // 默认全选的状态
                    allCheckLabel:false,

                    //查找是否有匹配到的下标， 默认值为-1.
                    edit_index : -1,

                    //编辑缓存的内容 默认为空
                    content_cache:"",

                    // 对应的下标值 来操控对应数据的状态
                    isindex : -1,

                    // 底部的三种状态  全部all  激活项 active  完成 accomplish 
                    // visibility:"all",

                    //管理提示框的显示隐藏状态 默认为false 
                    prompt_box:false
            }
        },
        // 监听数据变化
        watch: {
            todos:{
                // 数据变化时处理 传入数据
                handler(todos) {
                    // 存储数据
                    window.mytodos.storageFunc.sava(todos)
                },
                // 深度监听 数据改变也会触发
                deep:true
            }
        },
        
        computed: {
            // 每次切换时 重新计算 visibility
            visibility :function() {
                return this.$root.visibility
            },

             // 计算属性 根据数据变化 更改相应的style样式
             isred:function() {
                let isred = this.remaining.length > 0 ? "red" :''
                return isred
            },
            // 计算属性 根据不同选项的路由 返回相应的数据 来渲染页面
            filterTodos:function(){
                if(this.visibility == "all"){
                    return this.todos;
                }else if(this.visibility == "activate"){
                    return this.todos.filter((v,i)=>{
                        return !v.completed;// 激活项
                    })
                }else if(this.visibility == "accomplish"){
                    return this.todos.filter((v,i)=>{
                        return v.completed;// 完成项目
                    })
                }
            },
            // 计算属性 根据数据状态的变化 获取对应布尔值 控制样式
            allChecked:function(){
                let allChecked = true;// 默认全选
                this.todos.map((v,i)=>{
                    if(!v.completed){
                        allChecked = false;
                    }
                })
                return allChecked;
            },

            //计算属性  返回未完成项的数据 
            //返回一个未完成的对象数组
            remaining:function(){
                let remaining = this.todos.filter((v,i)=>{
                    // 未完成项
                    return !v.completed
                })
                return remaining;
            },
            //计算属性  获取当前输入内容的相关内容
            tips:function() {
                let tips = [];

                this.todos.forEach((v,i)=>{
                    if(v.content.indexOf(this.inputVal.trim()) != -1 && this.inputVal.trim() ){
                        tips.push(v.content)
                    }
                })

                return tips
            }

        },
        methods: {
            addTodoFromTip :function(tip) {
                this.todos.push({
                   id:this.getUniqID(),
                   content: tip,
                   completed:false
                })
                this.prompt_box = false

            },

            // 输入时控制提示框的显示与隐藏
            isInput:function() {
                this.prompt_box = true;
            },

            // 根据输入的内容，构造一个数据对象
           saveNewTodo:function() {
               if(!this.inputVal.trim()) {
                 return  alert("输入不能为空")     
               }
               this.todos.push({
                   id:this.getUniqID(),
                   content: this.inputVal,
                   completed:false
               })
               this.inputVal=""
           },
        //    全选反选功能
           allCheckEvent:function() {
                this.todos.map((v,i)=> {
                    
                v.completed = !this.allCheckLabel
    
                })
                this.allCheckLabel = !this.allCheckLabel
           },
        //编辑代办事项
           editTodo:function(index) {

                // 保留编辑之前的值
                this.content_cache = this.todos[index].content
                // 记录一下当前 编辑的项
                this.edit_index = index;
           },

        //    保存编辑待办事项
        //    进入编辑状态 更改当前内容
           saveEditTodo:function(index) {
            //    如果里面输入的内容为空
               if(!this.todos[index].content) {
                //    删除当前编辑的内容
                this.todos.splice(index,1)
               }
            //    取消编辑状态
               this.edit_index = -1
           },
        //    取消编辑代办事项
           cancelEditTodo : function (index) {
               this.todos[index].content = this.content_cache
               this.content_cache ="";//清空编辑状态的内容缓存
               this.edit_index = -1;

           },
        //    鼠标移入事件 获取当前移入时的该项下标 赋值给定义变量 来控制显示与隐藏
           todoMouseOver:function(index) {
                this.isindex = index
           },
        //    鼠标移出事件 隐藏相应内容
           todoMouseOut:function() {
            this.isindex = -1
           },
           
        //    当点击✖️时,删除该项内容
        removeTodo : function(index) {
            this.todos.splice(index,1)
        },
        //  点击事件 删除已完成的项目 
            // 遍历当前数据 让当前的数据等于未完成的数据 来实现删除已完成的数据
        clearCompletedTodos:function(index){
                // completed == true 已完成
                let un_finish_todos = this.todos.filter(function(v,i){
                    // 未完成的项目
                    return !v.completed
                })
                this.todos = un_finish_todos;
            },

        },
        directives: {
            "focus":{
                inserted:function(el,binding) {
                    el.focus()
                }
            }
        }
    })
})(Vue)
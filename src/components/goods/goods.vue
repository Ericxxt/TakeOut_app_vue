<template>
<div>
    <div class="goods">
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item,index) in goods" class="menu-item"
                 :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]">
                            </span>{{item.name}}
                    </span> 
                </li>
            </ul>
        </div>
        <div class="food-wrapper" ref="foodsWrapper">
            <ul>
                <li v-for="item in goods" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">売れた: {{food.sellCount}}</span><span>推薦率: {{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">${{food.price}}</span>
                                    <!-- if you have old price -->
                                    <span class="old" v-show="food.oldPrice">$ {{food.oldPrice}}</span>
                                </div>
                                <div class="cartcontrol-wrapper">
                                    <!-- 在 cartcontrol里的add 是通过这里点击事件传进来的 -->
                                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 这里的ref是为了让父组件调用到子组件的方法 -->
        <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods"></shopcart>
    </div>
     <!-- 这里的ref是为了让父组件调用到子组件的方法 ,现在goods可以调用food中的方法-->
        <!-- 之前 商品详情界面一直没有出现小球动画，因为这里没有传入add方法 -->
    <food @add="addFood" ref="food" :food="selectedFood"></food>  
</div> 
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from 'components/shopcart/shopcart';
    import cartcontrol from 'components/cartcontrol/cartcontrol';
    import food from 'components/food/food';
    // import food from 'components/food/food';
    const ERR_OK=0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods : [],
                listHeight : [],
                scrollY : 0,
                selectedFood: {}
            };
        },
        computed: {
            currentIndex() {
                for(let i=0;i<this.listHeight.length;i++){
                    let height1=this.listHeight[i];
                    let height2=this.listHeight[i+1];
                    //!height2 是因为height2最后一个元素超界
                    //this.scrollY>= height1 向上开区间， 向下闭区间
                    if(!height2||this.scrollY>= height1&& this.scrollY< height2){
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods=[];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if(food.count) {
                            foods.push(food);
                        }
                    }); 
                });
                return foods;
            }
        },
        created() {
            this.classMap = ['decrease','discount','special','invoice','guarantee'];
            this.$http.get('/api/goods').then((response) => {
                response=response.body;
                if(response.errno === ERR_OK){
                    this.goods=response.data;
                    //vue 更新dom数据是异步的所以需要使用nexttick去更新
                    this.$nextTick(() => {
                        this._initScroll();
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
            selectMenu (index, event) {
                //event._constructed 为false就是非当前应用的点击事件
                if(!event._constructed){
                    return;
                }
                let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                // get the corresponding food list 
                let el=foodList[index];
                this.foodsScroll.scrollToElement(el,300);
            },
            // 这里的 _drop(target) 方法是为了调用购物车shopcart里面的drop方法
            //下划线_ 开头的方法一般被认为是私有方法
            _drop(target) {
                // console.log("in _drop_goods");
                // 体验优化，异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target);
                });
            },
            _initScroll() {
                this.menuScroll =new BScroll(this.$refs.menuWrapper,{
                    // indicating that it could be pressed
                    click: true
                });
                this.foodsScroll=new BScroll(this.$refs.foodsWrapper,{
                    //indicading that we are LISTEN THE position of  scroll
                    click: true,
                    probeType: 3
                }); 
                this.foodsScroll.on('scroll',(pos) =>{
                    this.scrollY=Math.abs(Math.round(pos.y));
                });
            },

            _calculateHeight() {
                //get the foodList object
                let foodList=this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let height=0;
                this.listHeight.push(height);
                for(let i=0;i<foodList.length;i++){
                    let item= foodList[i];
                    height+=item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            addFood(target) {
                this._drop(target);
            },
            //一旦点击food就会触发事件
            selectFood(food, event) {
                if(!event._constructed){
                    return;
                }
                this.selectedFood=food;
                this.$refs.food.show();
            }
        },
        components: {
            shopcart,
            cartcontrol,
            food
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin.styl"
    
    .goods
        display: flex
        position: absolute
        top: 174px
        bottom: 46px
        width: 100%
        overflow : hidden
        .menu-wrapper
            flex: 0 0 80px
            width: 80px
            background: #f3f5f7
            .menu-item
                //使用display table的话元素可以居中 
                display : table
                height: 54px
                width: 56px
                padding: 0 12px
                line-height: 14px
                &.current
                    position : relative
                    z-index: 10
                    margin-top : -1px
                    background: #fff
                    font-weight: 700
                    .text
                        border-none()
                .icon
                    display: inline-block
                    vertical-align : top
                    width: 12px
                    height: 12px
                    margin-right: 2px 
                    background-size: 12px 12px 
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')  
                    &.invoice
                        bg-image('invoice_3') 
                    &.special
                        bg-image('special_3')
                .text
                    display : table-cell
                    width: 56px
                    vertical-align : middle
                    border-1px(rgba(7,17,27,0.1))
                    font-size : 12px
        .food-wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                line-height: 26px
                border-left: 2px solid #d9dde1
                font-size : 12px
                color : rgb(147,153,159)
                background : #f3f5f7
            .food-item
                display : flex
                margin : 18px
                padding-bottom : 18px   
                border-1px(rgba(7,17,27,0.1))
                &:last-child
                    border-none()
                    margin-bottom : 0 
                .icon
                    flex: 0 0 57px
                    margin-right : 10px
                .content
                    flex: 1
                    .name
                        margin: 1px 0 8px 0
                        height: 14px
                        line-height: 14px
                        font-size : 14px
                        color : rgb(7,17,27)
                    .desc, .extra
                        line-height : 10px
                        font-size : 10px
                        color : rgb(147,153,159)
                    .desc
                        margin-bottom : 8px
                        line-height : 12px
                    .extra
                        .count
                            margin-right : 12px
                    .price
                        font-weight: 700
                        line-height : 24px
                        .now
                            margin-right : 8px
                            font-size: 14px
                            color : rgb(240,20,20)
                        .old
                            text-decoration: line-through
                            font-size : 10px
                            color : rgb(147,153,159)
                    .cartcontrol-wrapper
                        position: absolute
                        right : 0
                        bottom: 12px
</style>

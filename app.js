console.log("APP.JS NEW VERSION LOADED");

const { createApp, ref, computed, onMounted, watch } = Vue;


createApp({

    setup() {


        const searchQuery = ref('');

        const selectedItem = ref(null);

        const products = ref([]);

        const isLoading = ref(true);

        const errorMsg = ref('');

        // Excel 更新时间
        const excelUpdatedAt = ref('TEST');

        console.log("excelUpdatedAt:", excelUpdatedAt.value);



        // 图片加载状态

        const loadedImages = ref(new Set());




        const fetchData = async () => {


            isLoading.value = true;

            errorMsg.value = '';


            try {


                const res = await fetch('/api/products');


                if (!res.ok) {

                    throw new Error('后端响应异常');

                }



                const data = await res.json();



                /*
                    兼容两种返回：

                    旧:
                    [
                        {...}
                    ]

                    新:
                    {
                        updated_at:"",
                        products:[]
                    }

                */


                if (Array.isArray(data)) {


                    products.value = data;


                } else {


                    products.value = data.products || [];


                    excelUpdatedAt.value =
                        data.updated_at || '';

                }



            } catch (e) {


                console.error(e);


                errorMsg.value =
                    "请确保 Go 后端服务已经启动";


            } finally {


                setTimeout(() => {

                    isLoading.value = false;

                }, 200);


            }


        };







        // 搜索过滤

        const filteredProducts = computed(() => {


            if (!searchQuery.value) {

                return products.value;

            }


            const q =
                searchQuery.value
                    .toLowerCase()
                    .trim();



            return products.value.filter(p => {


                return (

                    (p.name &&
                     p.name.toLowerCase().includes(q))


                    ||

                    (p.code &&
                     p.code.toLowerCase().includes(q))


                    ||

                    (p.supplier &&
                     p.supplier.toLowerCase().includes(q))


                    ||

                    (p.capacity_ml &&
                     String(p.capacity_ml).includes(q))

                );


            });


        });








        // 图片加载完成

        const onImageLoad = (id) => {

            loadedImages.value.add(id);

        };



        const isImageLoaded = (id) => {

            return loadedImages.value.has(id);

        };







        // 卡片阶梯动画

        const getStaggerStyle = (index) => {


            const delay =
                Math.min(index * 40, 400);



            return {


                animationDelay:
                    `${delay}ms`,


                transitionDelay:
                    `${delay}ms`


            };


        };








        // ESC关闭

        const handleKeydown = (e) => {


            if (e.key === 'Escape') {

                closeModal();

            }


        };







        const openModal = (item) => {


            selectedItem.value = item;


            // 打开详情回顶部

            setTimeout(() => {


                const modal =
                    document.querySelector('.fixed.inset-0');


                if (modal) {

                    modal.scrollTop = 0;

                }


            },0);


        };





        const closeModal = () => {


            selectedItem.value = null;


        };









        // Modal 状态监听

        watch(selectedItem, (newVal) => {



            if (newVal) {


                document.body.style.overflow =
                    'hidden';


                window.addEventListener(
                    'keydown',
                    handleKeydown
                );


            } else {


                document.body.style.overflow =
                    '';


                window.removeEventListener(
                    'keydown',
                    handleKeydown
                );


            }



        });








        // 搜索重新动画

        watch(searchQuery, () => {


            loadedImages.value.clear();


        });








        onMounted(fetchData);






        return {


            searchQuery,

            selectedItem,

            products,

            filteredProducts,

            isLoading,

            errorMsg,

            excelUpdatedAt,


            openModal,

            closeModal,


            onImageLoad,

            isImageLoaded,


            getStaggerStyle


        };


    }


}).mount('#app');
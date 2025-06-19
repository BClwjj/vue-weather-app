import {createRouter,createWebHashHistory}from 'vue-router'

const routes =[
    {
        path:'/',
        redirect:'/index'
    },
    {
        path:'/index',
        name:'index',
        component:()=>import('../views/index.vue')
    },
    {
        path:'/index2',
        name:'index2',
        component:()=>import('../views/index2.vue')
    }
]


const router = createRouter({
    history:createWebHashHistory(),
    routes
})
export default router
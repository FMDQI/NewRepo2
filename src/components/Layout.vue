<template>
    <el-container>
        <!-- 头部 -->
        <el-header>
            <div class="header-content">
                <span class="app-title">智能仓储系统</span>
                <el-menu mode="horizontal"
                         :default-active="activeMenu"
                         @select="handleMenuSelect">
                    <el-menu-item index="/dashboard">信息仪表盘</el-menu-item>
                    <el-menu-item index="/inventory">库存管理</el-menu-item>
                    <el-menu-item index="/orders">订单展示</el-menu-item>
                    <el-menu-item index="/replenishment">补货服务</el-menu-item>
                    <el-menu-item index="/recycling">回收管理</el-menu-item>
                    <el-menu-item index="/normal-items">库存物品信息管理</el-menu-item>
                </el-menu>
                <div class="user-info">
                    <span>欢迎，{{ username }}</span>
                    <el-button type="text" @click="handleLogout">退出登录</el-button>
                </div>
            </div>
        </el-header>

        <!-- 主体内容 -->
        <el-main>
            <router-view /> <!-- 路由对应的页面内容会渲染在这里 -->
        </el-main>

        <!-- 底部 -->
        <el-footer>
            <div class="footer-content">
                &copy; 2025 warehouse_forntend. All rights reserved.
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                activeMenu: '/dashboard', // 默认激活的菜单项
                username: localStorage.getItem('role') || '用户', // 从 localStorage 获取用户名
            };
        },
        methods: {
            // 处理菜单项点击事件
            handleMenuSelect(index) {
                this.$router.push(index); // 跳转到对应的路由
            },
            // 处理退出登录
            handleLogout() {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                this.$router.push('/login'); // 跳转到登录页面
            },
        },
        watch: {
            // 监听路由变化，更新激活的菜单项
            $route(to) {
                this.activeMenu = to.path;
            },
        },
        mounted() {
            // 初始化时设置激活的菜单项
            this.activeMenu = this.$route.path;
        },
    };
</script>

<style scoped>
    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .app-title {
        font-size: 20px;
        font-weight: bold;
        color: #333;
    }

    .el-header {
        background-color: #409eff;
        color: white;
        line-height: 60px;
    }

    .el-main {
        padding: 20px;
    }

    .el-footer {
        background-color: #333;
        color: white;
        text-align: center;
        line-height: 60px;
    }

    .user-info {
        margin-left: auto;
        display: flex;
        align-items: center;
    }

        .user-info span {
            margin-right: 10px;
        }


        /* 修改退出登录按钮的文字颜色 */
        .user-info .el-button--text {
            color: black;
        }
</style>
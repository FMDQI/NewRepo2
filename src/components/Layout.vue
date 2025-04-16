<template>
    <el-container style="height: 100vh;">
        <!-- 头部 -->
        <el-header class="header">
            <div class="header-content">
                <span class="app-title">智能仓储系统</span>
                <div class="user-info">
                    <span>欢迎，{{ username }}</span>
                    <el-button type="primary" @click="handleLogout">退出</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside class="nav-menu">
                <el-menu mode="vertical"
                         :default-active="activeMenu"
                         @select="handleMenuSelect"
                         class="custom-menu">
                    <el-menu-item index="/dashboard">
                        <i class="el-icon-s-data"></i>
                        <span slot="title">信息仪表盘</span>
                    </el-menu-item>
                    <el-menu-item index="/inventory">
                        <i class="el-icon-s-goods"></i>
                        <span slot="title">库存管理</span>
                    </el-menu-item>
                    <el-menu-item index="/replenishment">
                        <i class="el-icon-s-check"></i>
                        <span slot="title">补货服务</span>
                    </el-menu-item>
                    <el-menu-item index="/recycling">
                        <i class="el-icon-refresh"></i>
                        <span slot="title">回收管理</span>
                    </el-menu-item>
                    <el-menu-item index="/normal-items">
                        <i class="el-icon-box"></i>
                        <span slot="title">库存物品管理</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <!-- 主体内容 -->
            <el-main class="main-content">
                <router-view />
            </el-main>
        </el-container>

        <!-- 底部 -->
        <el-footer class="footer">
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
                activeMenu: '/dashboard',
                username: localStorage.getItem('role') || '用户',
            };
        },
        methods: {
            handleMenuSelect(index) {
                this.$router.push(index);
            },
            handleLogout() {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('role');
                localStorage.removeItem('username');
                this.$router.push('/login');
            },
        },
        watch: {
            $route(to) {
                this.activeMenu = to.path;
            },
        },
        mounted() {
            this.activeMenu = this.$route.path;
        },
    };
</script>

<style scoped>
    /* 头部 */
    .header {
        background-color: #34495e;
        color: white;
        padding: 0;
        height: 64px;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 10;
    }

    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }

    .app-title {
        font-size: 22px;
        font-weight: bold;
        color: white;
    }

    /* 导航菜单 */
    .nav-menu {
        background-color: #2e7d32; /* 深绿色背景 */
        border: none;
        width: 200px;
        height: calc(100vh - 64px);
        position: fixed;
        top: 64px;
        overflow-y: auto;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
    }

    .el-menu-item {
        color: #ffffff !important;
        font-size: 16px;
        transition: background 0.3s;
    }

        .el-menu-item:hover,
        .el-menu-item.is-active {
            background-color: #4caf50 !important; /* 浅绿色选中背景 */
            color: #ffffff !important;
            font-weight: bold;
        }

    /* 主内容区域 */
    .main-content {
        padding: 20px;
        margin-left: 200px; /* 侧边栏宽度 */
        margin-top: 64px; /* 头部高度 */
        /* 移除了高度限制和滚动设置 */
    }

    /* 底部 */
    .footer {
        background-color: #34495e;
        color: white;
        text-align: center;
        padding: 10px;
        font-size: 14px;
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 10;
    }
</style>






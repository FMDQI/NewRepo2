<template>
    <el-container style="height: 100vh;">
        <!-- 头部 -->
        <el-header class="header">
            <div class="header-content">
                <span class="app-title">智能仓储系统</span>
                <!-- 修改为 vertical 模式 -->
                <el-menu mode="vertical"
                         :default-active="activeMenu"
                         @select="handleMenuSelect"
                         class="nav-menu" :style="{zIndex: 100}">
                    <el-menu-item index="/dashboard">信息仪表盘</el-menu-item>
                    <el-menu-item index="/inventory">库存管理</el-menu-item>
                    <el-menu-item index="/replenishment">补货服务</el-menu-item>
                    <el-menu-item index="/recycling">回收管理</el-menu-item>
                    <el-menu-item index="/normal-items">库存物品管理</el-menu-item>
                </el-menu>
                <div class="user-info">
                    <span>欢迎，{{ username }}</span>
                    <el-button type="primary" @click="handleLogout">退出</el-button>
                </div>
            </div>
        </el-header>

        <!-- 主体内容 -->
        <el-main class="main-content">
            <div class="card">
                <router-view />
            </div>
        </el-main>

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
        background-color: transparent;
        border: none;
        width: 200px; /* 设置菜单宽度，适应纵向布局 */
        height: calc(100vh - 64px); /* 让菜单高度占满剩余区域 */
        position: fixed;
        top: 64px;
        overflow-y: auto; /* 保证菜单内容能滚动 */
    }

    .el-menu-item {
        color: #000 !important; /* 或者改成黑色 #000 取决于你的背景 */
        font-size: 16px;
        transition: background 0.3s;
    }
    .el-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .el-main {
        flex: 1;
        overflow-y: auto;
    }


        .el-menu-item:hover,
        .el-menu-item.is-active {
            background-color: rgba(255, 255, 255, 0.3) !important;
            color: #ffcc00 !important; /* 选中状态颜色 */
            font-weight: bold;
        }


    /* 用户信息 */
    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;
    }

        .user-info span {
            font-size: 14px;
        }

    .el-button {
        background-color: #3498db;
        border-color: #3498db;
        color: white;
    }

        .el-button:hover {
            background-color: #2980b9;
        }

    /* 主内容区域 */
    .main-content {
        padding: 20px;
        display: flex;
        flex-direction: column; /* 让内容按列排列 */
        justify-content: flex-start;
        align-items: center;
        margin-left: 200px;
        margin-top: 64px;
        height: calc(100vh - 64px); /* 让主内容区撑满 */
        overflow-y: auto; /* 允许滚动 */
    }

    /* 卡片式布局 */
    .card {
        width: 90%;
        max-width: 1200px;
        padding: 20px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .card-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        width: 100%;
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




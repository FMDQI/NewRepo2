<template>
    <el-container style="height: 100vh;">
        <!-- 头部 -->
        <el-header class="header">
            <div class="header-content">
                <span class="app-title">智能仓储系统</span>
                <div class="user-info">
                    <!-- 添加导航栏隐藏按钮 -->
                    <el-button type="text" class="toggle-nav-btn" @click="toggleNav">
                        <i :class="isNavVisible? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
                    </el-button>
                    <span>欢迎，{{ username }}</span>
                    <el-button type="primary" @click="handleLogout">退出</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside class="nav-menu"
                      v-show="isNavVisible"
                      :style="{ width: isNavVisible? '200px' : '0' }">
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
            <el-main class="main-content"
                     :style="{
                        marginLeft: isNavVisible? '200px' : '0',
                        width: isNavVisible? 'calc((100% - 200px) * 0.6666)' : 'calc(100% * 0.6666)'
                    }">
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
                isNavVisible: true, // 控制导航栏显示状态
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
            toggleNav() {
                this.isNavVisible = !this.isNavVisible; // 切换导航栏显示状态
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
        position: relative; /* 添加相对定位 */
    }

    .app-title {
        font-size: 22px;
        font-weight: bold;
        color: white;
        margin-left: 40px; /* 为隐藏按钮留出空间 */
    }

    /* 隐藏按钮 */
    .toggle-nav-btn {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 11; /* 确保按钮在头部之上 */
        color: white;
    }

    /* 导航菜单 - 毛玻璃效果 */
    .nav-menu {
        background-color: rgba(255, 255, 255, 0.3); /* 半透明白色背景 */
        border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明白色边框 */
        height: calc(100vh - 64px);
        position: fixed;
        top: 64px;
        overflow-y: auto;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1); /* 添加阴影 */
        backdrop-filter: blur(10px); /* 模糊效果 */
        -webkit-backdrop-filter: blur(10px); /* 兼容 Safari */
        border-radius: 8px; /* 圆角效果 */
        transition: width 0.3s ease; /* 添加宽度过渡效果 */
    }

    /* 导航菜单项 */
    .el-menu-item {
        color: #000000 !important; /* 字体颜色改为黑色 */
        font-size: 16px;
        transition: background 0.3s, color 0.3s;
    }

        /* 悬停和选中状态 */
        .el-menu-item:hover,
        .el-menu-item.is-active {
            background-color: rgba(255, 255, 255, 0.5) !important; /* 浅白色选中背景 */
            color: #000000 !important; /* 字体颜色保持黑色 */
            font-weight: bold;
        }

    /* 主内容区域 */
    .main-content {
        padding: 20px;
        margin-top: 64px; /* 头部高度 */
        transition: margin-left 0.3s ease; /* 添加过渡效果 */
        box-sizing: border-box; /* 确保 padding 不影响宽度计算 */
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
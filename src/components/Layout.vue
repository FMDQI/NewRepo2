<template>
  <el-container class="eco-container">
    <!-- 头部 -->
    <el-header class="eco-header">
      <div class="header-content">
        <el-button 
          class="nav-toggle"
          @click="toggleNav"
          :icon="isNavVisible ? 'el-icon-close' : 'el-icon-s-operation'"  
          circle
        />
        <h1 class="app-title">智能仓储系统</h1>
        <div class="user-panel">
          <span class="welcome-msg">欢迎，{{ username }} </span>
          <el-button 
            type="success" 
            plain 
            @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 导航栏 -->
      <el-aside class="eco-aside" :width="isNavVisible ? '200px' : '0'">
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
          class="glass-nav"
          :collapse="!isNavVisible">
          <el-menu-item index="/dashboard">
            <i class="el-icon-s-data"></i> <!-- 官方数据仪表图标 -->
            <span>信息仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/inventory">
            <i class="el-icon-office-building"></i> <!-- 仓库建筑图标 -->
            <span>库存管理</span>
          </el-menu-item>
          <el-menu-item index="/replenishment">
            <i class="el-icon-truck"></i> <!-- 官方卡车图标 -->
            <span>补货服务</span>
          </el-menu-item>
          <el-menu-item index="/recycling">
            <i class="el-icon-delete-solid"></i> <!-- 实心删除图标 -->
            <span>回收管理</span>
          </el-menu-item>
          <el-menu-item index="/normal-items">
            <i class="el-icon-box"></i> <!-- 官方盒子图标 -->
            <span>物品管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="eco-main">
        <router-view class="glass-content" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.eco-header {
  /* 修改为更明显的绿色渐变 */
  background: linear-gradient(90deg, 
    rgba(1, 136, 33, 0.927) 0%, 
    rgba(240, 249, 235, 0.95) 100%
  ) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
}

.eco-aside {
    background: rgba(245, 255, 240, 0.96) !important;
    backdrop-filter: blur(8px);
}
/* 菜单项特效（不改变布局） */
.glass-nav >>> .el-menu-item {
  transition: all 0.3s ease;
}
.glass-nav >>> .el-menu-item:hover {
  background: rgba(225, 243, 216, 0.6) !important;
  box-shadow: 1px 1px 4px rgba(103, 194, 58, 0.1);
}

.glass-nav >>> .el-menu-item.is-active {
  background: linear-gradient(90deg, 
    rgba(225, 243, 216, 0.8) 0%,
    rgba(240, 249, 235, 0.6) 100%
  ) !important;
}

.eco-main {
  margin-top: 60px;
  transition: all 0.3s;
  width: 66.66%;
  /* 新增定位方式 */
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
}

/* 导航栏展开时调整 */
.eco-aside[width="200px"] + .eco-main {
  width: calc(66.66% - 100px);
  left: calc(50% + 100px);
}

/* 头部内容布局调整 */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

/* 标题颜色调整 */
.app-title {
  color: #0e0c01;
  /* 添加文字阴影增强对比 */
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

/* 调整菜单项间距和图标大小 */
.glass-nav >>> .el-menu-item {
  padding: 0 25px !important;
  height: 50px;
  line-height: 50px;
  margin: 8px 0;
}

.glass-nav >>> .el-menu-item i {
  margin-right: 15px;
  font-size: 20px;
  vertical-align: middle;
}

/* 导航按钮样式优化 */
.nav-toggle {
  font-size: 26px;
  padding: 14px;
  transition: transform 0.3s;
}
.nav-toggle:hover {
  transform: rotate(180deg);
}
</style>

<script>
export default {
  data() {
    return {
      isNavVisible: true,
      activeMenu: '/dashboard',
      username: localStorage.getItem('username') || '管理员'
    }
  },
  methods: {
    toggleNav() {
      this.isNavVisible = !this.isNavVisible
    },
    handleMenuSelect(index) {
      this.$router.push(index)
    },
    handleLogout() {
      localStorage.clear()
      this.$router.push('/login')
    }
  },
  watch: {
    $route(to) {
      this.activeMenu = to.path
    }
  },
  mounted() {
    this.activeMenu = this.$route.path
  }
}
</script>

<style>
/* 在全局或组件内添加 */
@import url('//unpkg.com/element-ui/lib/theme-chalk/icon.css');

.glass-nav i {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
}
</style>

<style scoped>

/* 用户面板间距调整 */
.user-panel {
  display: flex;
  align-items: center;
  gap: 20px; /* 新增间距 */
}

.welcome-msg {
  margin-right: 10px; /* 文字与按钮间距 */
}

/* 修改卡片容器为透明 */
.glass-content {
  background: transparent !important;
  backdrop-filter: none;
}

/* 卡片内容区域毛玻璃效果 */
.glass-content .el-card__body {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  border-radius: 8px;
}

/* 卡片整体样式调整 */
.glass-content .el-card {
  background: transparent !important;
  border: 1px solid rgba(103, 194, 58, 0.2);
  box-shadow: 0 8px 32px rgba(103, 194, 58, 0.15);
}

/* 调整主内容区背景 */
.eco-main {
  background: transparent !important;
  overflow: visible;
}
/* 修改主内容区背景 */
.eco-main {
  background: transparent !important;
  backdrop-filter: none; /* 移除容器层模糊 */
}

/* 调整导航栏透明度 */
.eco-aside {
  background: rgba(245, 255, 240, 0.1) !important; 
}

/* 添加全局背景层 */
.eco-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #f0f9eb 0%, #e6f7ff 100%);
  z-index: -1;
}

.eco-container {
  background: transparent !important;
}

.eco-main {
  background: transparent !important; /* 移除白色背景 */
}

.glass-nav {
  background: rgba(245, 255, 240, 0.85) !important; /* 调整透明度 */
}
</style>

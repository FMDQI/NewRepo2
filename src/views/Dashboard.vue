<template>
    <el-container>
        <el-main>
            <h2>信息仪表盘</h2>

            <!-- 销售趋势 -->
            <el-card class="dashboard-card">
                <h3>销售趋势</h3>
                <el-form :inline="true" @submit.prevent="fetchSalesTrend">
                    <el-form-item label="物品ID">
                        <el-input v-model="salesTrendItemId" placeholder="请输入物品ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchSalesTrend">查询</el-button>
                    </el-form-item>
                </el-form>
                <div ref="salesTrendChart" style="width: 100%; height: 400px;"></div>
            </el-card>

            <!-- 回收趋势 -->
            <el-card class="dashboard-card">
                <h3>回收趋势</h3>
                <el-form :inline="true" @submit.prevent="fetchRecyclingTrend">
                    <el-form-item label="物品ID">
                        <el-input v-model="recyclingTrendItemId" placeholder="请输入物品ID"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchRecyclingTrend">查询</el-button>
                    </el-form-item>
                </el-form>
                <div ref="recyclingTrendChart" style="width: 100%; height: 400px;"></div>
            </el-card>

            <!-- 所有物品信息及库存 -->
            <el-card class="dashboard-card">
                <h3>所有物品信息及库存</h3>
                <el-button type="primary" @click="fetchAllItems">刷新</el-button>
                <el-table :data="allItemsData" style="width: 100%">
                    <el-table-column prop="item_id" label="物品ID"></el-table-column>
                    <el-table-column prop="item_name" label="物品名称"></el-table-column>
                    <el-table-column prop="item_type" label="物品类型"></el-table-column>
                    <el-table-column prop="current_stock" label="当前库存"></el-table-column>
                </el-table>
            </el-card>

            <!-- 类别销售趋势 -->
            <el-card class="dashboard-card">
                <h3>类别销售趋势</h3>
                <el-form :inline="true" @submit.prevent="fetchCategorySalesTrend">
                    <el-form-item label="物品类型">
                        <el-input v-model="categorySalesTrendItemType" placeholder="请输入物品类型"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="fetchCategorySalesTrend">查询</el-button>
                    </el-form-item>
                </el-form>
                <div ref="categorySalesTrendChart" style="width: 100%; height: 400px;"></div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script>
    import axios from 'axios';
    import * as echarts from 'echarts';

    export default {
        data() {
            return {
                salesTrendItemId: null, // 销售趋势的物品ID
                salesTrendData: [], // 销售趋势数据
                recyclingTrendItemId: null, // 回收趋势的物品ID
                recyclingTrendData: [], // 回收趋势数据
                allItemsData: [], // 所有物品信息及库存数据
                categorySalesTrendItemType: '', // 类别销售趋势的物品类型
                categorySalesTrendData: [], // 类别销售趋势数据
            };
        },
        methods: {
            // 初始化图表
            initChart(ref, data, title, dateField, valueField) {
                const chartDom = this.$refs[ref];
                if (chartDom) {
                    const chart = echarts.init(chartDom);
                    const option = {
                        title: {
                            text: title,
                        },
                        tooltip: {
                            trigger: 'axis',
                        },
                        xAxis: {
                            type: 'category',
                            data: data.map((item) => item[dateField]), // 动态使用 dateField
                        },
                        yAxis: {
                            type: 'value',
                        },
                        series: [
                            {
                                name: title,
                                type: 'line',
                                data: data.map((item) => parseInt(item[valueField])), // 动态使用 valueField，并转换为数字
                                smooth: true,
                            },
                        ],
                    };
                    chart.setOption(option);
                }
            },
            // 获取销售趋势
            async fetchSalesTrend() {
                try {
                    const response = await axios.get('http://localhost:5000/api/dashboard/sales_trend', {
                        params: {
                            item_id: this.salesTrendItemId,
                        },
                    });
                    console.log('销售趋势数据:', response.data); // 打印后端返回的数据
                    this.salesTrendData = response.data;
                    this.initChart(
                        'salesTrendChart',
                        this.salesTrendData,
                        '销售趋势',
                        'sale_date', // 日期字段名
                        'total_sales' // 数值字段名
                    );
                } catch (error) {
                    console.error('获取销售趋势失败', error);
                }
            },
            // 获取回收趋势
            async fetchRecyclingTrend() {
                try {
                    const response = await axios.get('http://localhost:5000/api/dashboard/recycling_trend', {
                        params: {
                            item_id: this.recyclingTrendItemId,
                        },
                    });
                    console.log('回收趋势数据:', response.data); // 打印后端返回的数据
                    this.recyclingTrendData = response.data;
                    this.initChart(
                        'recyclingTrendChart',
                        this.recyclingTrendData,
                        '回收趋势',
                        'recycle_date', // 日期字段名
                        'total_recycled' // 数值字段名
                    );
                } catch (error) {
                    console.error('获取回收趋势失败', error);
                }
            },
            // 获取所有物品信息及库存
            async fetchAllItems() {
                try {
                    const response = await axios.get('http://localhost:5000/api/dashboard/items');
                    this.allItemsData = response.data;
                } catch (error) {
                    console.error('获取所有物品信息失败', error);
                }
            },
            // 获取类别销售趋势
            async fetchCategorySalesTrend() {
                try {
                    const response = await axios.get('http://localhost:5000/api/dashboard/category_sales_trend', {
                        params: {
                            item_type: this.categorySalesTrendItemType,
                        },
                    });
                    console.log('类别销售趋势数据:', response.data); // 打印后端返回的数据
                    this.categorySalesTrendData = response.data;
                    this.initChart(
                        'categorySalesTrendChart',
                        this.categorySalesTrendData,
                        '类别销售趋势',
                        'sale_date', // 假设日期字段名与销售趋势相同
                        'total_sales' // 假设数值字段名与销售趋势相同
                    );
                } catch (error) {
                    console.error('获取类别销售趋势失败', error);
                }
            },
        },
        mounted() {
            // 页面加载时获取所有物品信息及库存
            this.fetchAllItems();
        },
    };
</script>

<style scoped>
    .dashboard-card {
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: 20px;
    }

    h3 {
        margin-bottom: 10px;
    }
</style>
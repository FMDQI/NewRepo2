<template>
  <el-container>
    <el-main>
      <h2>回收管理</h2>

      <!-- 添加可回收物品 -->
      <el-card class="recycling-card">
        <h3>添加可回收物品</h3>
        <el-form :model="newItemForm" :rules="itemRules" ref="newItemForm">
          <el-form-item label="物品名称" prop="item_name">
            <el-input v-model="newItemForm.item_name" placeholder="请输入物品名称"></el-input>
          </el-form-item>
          <el-form-item label="物品类型" prop="item_type">
            <el-input v-model="newItemForm.item_type" placeholder="请输入物品类型"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitNewItem">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 添加回收记录 -->
      <el-card class="recycling-card">
        <h3>添加回收记录</h3>

        <!-- 手动添加回收记录 -->
        <el-form :model="newRecordForm" :rules="recordRules" ref="newRecordForm">
          <el-form-item label="物品ID" prop="item_id">
            <el-input v-model="newRecordForm.item_id" placeholder="请输入物品ID"></el-input>
          </el-form-item>
          <el-form-item label="回收数量" prop="quantity">
            <el-input v-model="newRecordForm.quantity" placeholder="请输入回收数量"></el-input>
          </el-form-item>
          <el-form-item label="回收日期" prop="recycle_date">
            <el-date-picker
              v-model="newRecordForm.recycle_date"
              type="date"
              placeholder="选择回收日期"
              value-format="YYYY-MM-DD"
              format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitNewRecord">提交</el-button>
          </el-form-item>
        </el-form>

        <!-- Excel 导入回收记录 -->
        <el-upload
          action=""
          :on-change="handleExcelUpload"
          :auto-upload="false"
          accept=".xlsx, .xls"
          :show-file-list="false"
        >
          <el-button type="primary">导入 Excel 文件</el-button>
        </el-upload>
      </el-card>

      <!-- 查询指定 item_id 的回收数量 -->
      <el-card class="recycling-card">
        <h3>查询回收数量</h3>
        <el-form :model="queryForm" :rules="queryRules" ref="queryForm">
          <el-form-item label="物品ID" prop="item_id">
            <el-input v-model="queryForm.item_id" placeholder="请输入物品ID"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryRecyclingQuantity">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="recyclingQuantityData" style="width: 100%" v-if="recyclingQuantityData.length > 0">
          <el-table-column prop="item_id" label="物品ID"></el-table-column>
          <el-table-column prop="total_quantity" label="回收数量"></el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
  data() {
    return {
      // 添加可回收物品的表单数据
      newItemForm: {
        item_name: '',
        item_type: '',
      },
      // 添加回收记录的表单数据
      newRecordForm: {
        item_id: null,
        quantity: null,
        recycle_date: null,
      },
      // 查询回收数量的表单数据
      queryForm: {
        item_id: null,
      },
      // 回收数量数据
      recyclingQuantityData: [],
      // 表单验证规则
      itemRules: {
        item_name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        item_type: [{ required: true, message: '请输入物品类型', trigger: 'blur' }],
      },
      recordRules: {
        item_id: [{ required: true, message: '请输入物品ID', trigger: 'blur' }],
        quantity: [{ required: true, message: '请输入回收数量', trigger: 'blur' }],
        recycle_date: [{ required: true, message: '请选择回收日期', trigger: 'blur' }],
      },
      queryRules: {
        item_id: [{ required: true, message: '请输入物品ID', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 提交新的可回收物品
    async submitNewItem() {
      try {
        const response = await axios.post('http://localhost:5000/api/recycling/items', this.newItemForm);
        this.$message.success('可回收物品添加成功');
        this.newItemForm = { item_name: '', item_type: '' }; // 清空表单
      } catch (error) {
        console.error('添加可回收物品失败', error);
        this.$message.error('添加可回收物品失败');
      }
    },
    // 提交新的回收记录
    async submitNewRecord() {
      try {
        console.log('Selected Date:', this.newRecordForm.recycle_date); // 打印日期值
        if (!this.newRecordForm.recycle_date) {
          this.$message.error('请选择回收日期');
          return;
        }

        const payload = {
          ...this.newRecordForm,
        };

        const response = await axios.post('http://localhost:5000/api/recycling/records', payload);
        this.$message.success('回收记录添加成功');
        this.newRecordForm = { item_id: null, quantity: null, recycle_date: null }; // 清空表单
      } catch (error) {
        console.error('添加回收记录失败', error);
        this.$message.error('添加回收记录失败');
      }
    },
    // 处理 Excel 文件上传
    handleExcelUpload(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 将 Excel 数据转换为需要的格式
        const records = jsonData.map((item) => ({
          item_id: item['物品ID'],
          quantity: item['回收数量'],
          recycle_date: item['回收日期'], // 确保 Excel 中的日期格式正确
        }));

        // 批量提交回收记录
        this.submitExcelRecords(records);
      };
      reader.readAsArrayBuffer(file.raw);
    },
    // 批量提交 Excel 中的回收记录
    async submitExcelRecords(records) {
      try {
        for (const record of records) {
          await axios.post('http://localhost:5000/api/recycling/records', record);
        }
        this.$message.success('Excel 数据导入成功');
      } catch (error) {
        console.error('导入 Excel 数据失败', error);
        this.$message.error('导入 Excel 数据失败');
      }
    },
    // 查询指定 item_id 的回收数量
    async queryRecyclingQuantity() {
      try {
        const response = await axios.get('http://localhost:5000/api/recycling/items/quantity', {
          params: {
            item_id: this.queryForm.item_id,
          },
        });
        this.recyclingQuantityData = [response.data]; // 将结果包装为数组
        this.$message.success('查询成功');
      } catch (error) {
        console.error('查询回收数量失败', error);
        this.$message.error('查询回收数量失败');
      }
    },
  },
};
</script>

<style scoped>

.recycling-card {
        margin-bottom: 20px;
        background: transparent !important;
    }

    .recycling-card .el-card__body {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(25px) saturate(200%);
  -webkit-backdrop-filter: blur(25px) saturate(200%);
  border-radius: 8px;
  border: 1px solid rgba(103, 194, 58, 0.25);
  box-shadow: 0 8px 32px rgba(103, 194, 58, 0.2);
}
/* 添加回收记录卡片表单对齐 */
.recycling-card:nth-child(2) .el-form-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 18px;
}

.recycling-card:nth-child(2) .el-form-item__label {
  text-align: right;
  padding-right: 15px;
}

.recycling-card:nth-child(2) .el-form-item__content {
  max-width: 300px;
}

.recycling-card:nth-child(2) .el-date-picker {
  width: 100%;
}

h2 {
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 10px;
}
</style>
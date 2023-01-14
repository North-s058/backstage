<template>
  <div>
    <!--    按钮-->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px; background-color: #20a0ff"
      >添加</el-button
    >
    <el-table border :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 150px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page='page'      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 3,
      list: [],
      total: 0,
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(page = 1) {
      this.page = page
      let result = await this.$API.tradeMark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(pageSize){
      this.limit = pageSize
      this.getPageList()

    }

  },
};
</script>

<style scoped></style>

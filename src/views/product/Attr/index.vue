<template>
  <div>
    <el-card style="margin: 20px">
      <category-select @getCategoryId="getCategoryId" :show="!isShowTable"> </category-select>
    </el-card>
    <el-card style="margin: 20px">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!cateId.c3Id"
          @click="addAttr"
          >添加</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column align="center" label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 10px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template v-slot="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                siz="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                siz="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item lable="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template v-slot="{ row, $index }">
              <el-input
                v-model="row.valueName"
                :ref="$index"
                placeholder="请输入属性值"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm :title='`你确定要删除${row.valueName}？`' @onConfirm="deleteAttrValue($index)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdata" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入 lodash 的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      cateId: {
        c1Id: "",
        c2Id: "",
        c3Id: "",
      },
      attrList: [],
      isShowTable: true,
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(cateId) {
      this.cateId = cateId;
      this.getAttrList();
    },
    async getAttrList() {
      let result = await this.$API.attr.reqAttrList(
        this.cateId.c1Id,
        this.cateId.c2Id,
        this.cateId.c3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.categoryId,
        attrName: "",
        flag: true,
      });
      this.$nextTick(() =>
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      );
    },
    addAttr() {
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
          attrName: "",
          attrValueList: [],
          categoryId: this.cateId.c3Id,
          categoryLevel: 3,

      };
    },
    updateAttr(row) {
      this.isShowTable = false;
      //由于数据复杂 所以要用深拷贝
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        //添加响应式数据
        this.$set(item, "flag", false);
      });
    },
    toLook(row) {
      //进行判定
      if (row.valueName.trim() == "") {
        this.$message("不能为空");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (item != row) {
          return item.valueName == row.valueName;
        }
      });
      if (isRepeat) {
        this.$message("不可重复");
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      row.flag = true;
      //获取input节点，自动聚焦,需要注意，对于浏览器而言，页面重新渲染需要消耗时间，input还未渲染
      this.$nextTick(() => this.$refs[index].focus());
    },
    deleteAttrValue(index){
      //气泡确认框的确定按钮回调 最新版本为onConfirm
      this.attrInfo.attrValueList.splice(index,1)

    },
    async addOrUpdata(){
      //整理参数

    //过滤空属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName!==''){
          //删除flag
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.$message({type:'success',message:'保存成功'})
        this.getAttrList()
        this.isShowTable = true
      }catch (error){

      }
    }
  },
};
</script>

<style scoped></style>

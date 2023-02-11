<template>
  <div>
    <el-card style="margin: 20px">
      <category-select @getCategoryId="getCategoryId"></category-select>
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
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width" >
            <template v-slot="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="row.flag=true" style="display: block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template v-slot="{row,$index}">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-button type="primary">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入 lodash 的深拷贝
import cloneDeep from 'lodash/cloneDeep'
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
      isShowTable: false,
      attrInfo:{
        attrName:'',
        attrValueList:[],
        categoryId:0,
        categoryLevel:3
      }
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
    addAttrValue(){
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.categoryId,
        attrName:'',
        flag:true
      })
    },
    addAttr(){
      this.isShowTable = false
      //清除数据
      this.attrInfo = {
        attrInfo: {
          attrName: '',
          attrValueList: [],
          categoryId: this.cateId.c3Id,
          categoryLevel: 3
        }
      }

    },
    updateAttr(row){
        this.isShowTable=false
      //由于数据复杂 所以要用深拷贝
      this.attrInfo = cloneDeep(row)
    },
    toLook(row){
      //进行判定
      if(row.valueName.trim()=='') {
        this.$message('不能为空')
        return
      }
      let isRepeat = this.attrInfo.attrValueList.some(item=>{
        if(item!=row){
          return item.valueName==row.valueName
        }
      })
      if(isRepeat){
        this.$message('不可重复')
        return;
      }
      row.flag = false
    }
  },
};
</script>

<style scoped></style>

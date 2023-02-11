import request from "@/utils/request";
import { data } from "autoprefixer";

export const reqCategory1List = () =>
  request({ url: "admin/product/getCategory1", method: "get" });
export const reqCategory2List = (category1Id) =>
  request({ url: `admin/product/getCategory2/${category1Id}`, method: "get" });
export const reqCategory3List = (category2Id) =>
  request({ url: `admin/product/getCategory3/${category2Id}`, method: "get" });

export const reqAttrList = (cate1Id, cate2Id, cate3Id) =>
  request({
    url: `/admin/product/attrInfoList/${cate1Id}/${cate2Id}/${cate3Id}`,
    method: "get",
  });

export const reqSetAttrInfo = (data) =>
  request({ url: "/admin/product/saveAttrInfo", method: "post", data });

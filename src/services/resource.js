import request from '@/utils/request'

// 分页获取所有资源列表
export const getResourcePages = data => {
  return request({
    method: 'post',
    url: 'boss/resource/getResourcePages',
    data
  })
}

// 查询资源分类接口
export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

import request from '@/utils/request'

// 添加菜单
export const saveOrUpdate = data => {
  return request({
    method: 'post',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // url: '/boss/menu/getEditMenuInfo?id=id',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取编辑页面菜单
// 请求参数的id， 默认为-1
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'get',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 获取所有菜单列表
export const getAllMenu = () => {
  return request({
    method: 'get',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
export const deleteMenu = id => {
  return request({
    method: 'delete',
    url: `/boss/menu/${id}`
  })
}

// 获取所有菜单并按层级展示

export const getMenuNodeList = () => {
  return request({
    method: 'get',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 给角色分配菜单
export const allocateRoleMenus = data => {
  return request({
    method: 'post',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

// 获取角色对应的出彩的那
export const getRoleMenus = (roleId) => {
  return request({
    method: 'get',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}

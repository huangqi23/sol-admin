import { get, post } from "@/utils/ajax";

export function getStatus(params) {
    return post("/status/getStatus", params);
}
// 登录接口
export function login(params) {
    return post("/auth/login", params);
}
// 登录接口
// export const login = (params) => { return loginreq("post", "/sysApi/auth/login", params) };


export function getUserInfo(params) {
    return post("/user/getUserInfo", params);
}

// 获取用户菜单
export function menu(params) {
    return post("/api/menu", params);
}
// export const menu = (params) => { return axios.get("/api/menu?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 退出接口
// export const loginout = () => { return axios.delete("/api/login?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 用户管理
 **/
// 用户管理-获取用户列表
export function userList(params) {
    return post("/api/User/list", params);
}
// export const userList = (params) => { return req("post", "/api/User/list", params) };
// 用户管理-保存（添加编辑）
export function userSave(params) {
    return post("/api/User/list", params);
}
// export const userSave = (params) => { return req("post", "/api/User/save", params) };
// 用户管理-删除用户
export function userDelete(params) {
    return post("/api/User/list", params);
}
// export const userDelete = (params) => { return axios.delete("/api/User/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 用户管理-重置密码
export function userPwd(params) {
    return post("/api/User/list", params);
}
// export const userPwd = (params) => { return req("post", "/api/User/pwd", params) };
// 用户管理-修改状态
export function userLock(params) {
    return post("/api/User/list", params);
}
// export const userLock = (params) => { return axios.get("/api/User/lock?userId=" + params.userId + "&lock=" + params.lock + "&token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限
export function UserDeptTree(params) {
    return post("/api/User/list", params);
}
// export const UserDeptTree = (params) => { return axios.get("/api/UserDept/tree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限保存
export function UserDeptSave(params) {
    return post("/api/User/list", params);
}
// export const UserDeptSave = (params) => { return req("post", "/api/UserDept/save", params) };
// 用户管理-获取部门设置
export function UserDeptdeptTree(params) {
    return post("/api/User/list", params);
}
// export const UserDeptdeptTree = (params) => { return axios.get("/api/UserDept/deptTree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-保存部门设置
export function UserChangeDept(params) {
    return post("/api/User/list", params);
}
// export const UserChangeDept = (params) => { return req("post", "/api/User/change/dept", params) };
// 用户管理-用户下线
export function userExpireToken(params) {
    return post("/api/User/list", params);
}
// export const userExpireToken = (params) => { return req("get", "/api/User/expireToken/" + params, {}) };
// 用户管理-刷新缓存
export function userFlashCache(params) {
    return post("/api/User/list", params);
}
// export const userFlashCache = (params) => { return req("get", "/api/User/flashCache/" + params, {}) };

/**
 * 菜单管理
 **/
// 菜单管理-获取菜单Module/list
export function ModuleList(params) {
    return post("/api/User/list", params);
}
// export const ModuleList = () => { return req("post", "/api/Module/list") };
// 菜单管理-根据菜单获取数据
export function ModuleGet(params) {
    return post("/api/User/list", params);
}
// export const ModuleGet = (params) => { return axios.get("/api/Module/get/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 菜单管理-获取父级菜单Module/nodes
export function ModuleNodes(params) {
    return post("/api/User/list", params);
}
// export const ModuleNodes = (params) => { return req("post", "/api/Module/nodes", params) };
// 菜单管理-修改菜单
export function ModuleSave(params) {
    return post("/api/User/list", params);
}
// export const ModuleSave = (params) => { return req("post", "/api/Module/save", params) };
// 菜单管理-删除菜单
export function ModuleDelete(params) {
    return post("/api/User/list", params);
}
// export const ModuleDelete = (params) => { return axios.delete("/api/Module/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 角色管理
 **/
// 角色管理-获取角色列表
export function roleList(params) {
    return post("/api/User/list", params);
}
// export const roleList = (params) => { return req("post", "/api/Role/list", params) };
// 角色管理-保存（添加编辑）
export function roleSave(params) {
    return post("/api/User/list", params);
}
// export const roleSave = (params) => { return req("post", "/api/Role/save", params) };
// 角色管理-删除角色
export function roleDelete(params) {
    return post("/api/User/list", params);
}
// export const roleDelete = (params) => { return axios.delete("/api/Role/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 角色管理-菜单权限（获取）
export function RoleRightTree(params) {
    return post("/api/User/list", params);
}
// export const RoleRightTree = (params) => { return axios.get("/api/RoleRight/tree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 角色管理-菜单权限（保存）
export function RoleRightSave(params) {
    return post("/api/User/list", params);
}
// export const RoleRightSave = (params) => { return req("post", "/api/RoleRight/save", params) };

/**
 * 公司管理
 **/
// 公司管理-获取公司列表
export function deptList(params) {
    return post("/sys/list", params);
}
// export const deptList = (params) => { return req("post", "/api/Dept/list", params) };
// 公司管理-保存（添加编辑）
export function deptSave(params) {
    return post("/api/User/list", params);
}
// export const deptSave = (params) => { return req("post", "/api/Dept/save", params) };
// 公司管理-删除公司
export function deptDelete(params) {
    return post("/api/User/list", params);
}
// export const deptDelete = (params) => { return axios.get("/api/Dept/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 系统环境变量
 **/
// 系统环境变量-获取系统环境变量列表
export function variableList(params) {
    return post("/api/User/list", params);
}
// export const variableList = (params) => { return req("post", "/api/Variable/list", params) };
// 系统环境变量-保存（添加编辑）
export function variableSave(params) {
    return post("/api/User/list", params);
}
// export const variableSave = (params) => { return req("post", "/api/Variable/save", params) };
// 系统环境变量-删除系统环境变量
export function variableDelete(params) {
    return post("/api/User/list", params);
}
// export const variableDelete = (params) => { return axios.delete("/api/Variable/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 权限管理
 **/
// 权限管理-获取权限列表
export function permissionList(params) {
    return post("/api/User/list", params);
}
// export const permissionList = (params) => { return req("post", "/api/Permission/list", params) };
// 权限管理-保存权限
export function ermissionSave(params) {
    return post("/api/User/list", params);
}
// export const ermissionSave = (params) => { return req("post", "/api/Permission/save", params) };
// 权限管理-删除权限
export function ermissionDelete(params) {
    return post("/api/User/list", params);
}
// export const ermissionDelete = (params) => { return axios.delete("/api/Permission/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-获取权限
export function roleDropDown(params) {
    return post("/api/User/list", params);
}
// export const roleDropDown = () => { return axios.get("/api/Role/dropDown/all?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-配置权限
export function RolePermission(params) {
    return post("/api/User/list", params);
}
// export const RolePermission = (params) => { return req("post", "/api/RolePermission/save", params) };

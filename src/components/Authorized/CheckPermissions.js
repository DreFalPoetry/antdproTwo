import React from 'react';
import PromiseRender from './PromiseRender';
import { CURRENT } from './index';

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;
  if (!authority) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
      let currAuthority = currentAuthority.split(',');
      let isAuthority = false;
      if(currAuthority.length >= 1){
        authority.map((item,index) => {
            currAuthority.map((item2,index2) => {
                if(item2 == item){
                    isAuthority = true;
                }
            })
        })
      }
      if(isAuthority){
        return target;
      }
    // if (authority.indexOf(currentAuthority) >= 0) {
    //   return target;
    // }
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
      if(authority.split(',').length > 1){
        let menuAuthority = authority.split(',');
        let isAuthority = false;
        let userAuthority = currentAuthority.split(',');
        userAuthority.map((item,index) => {
            menuAuthority.map((item2,index2) => {
                if(item2 == item){
                    isAuthority = true;
                }
            })
        });
        if(isAuthority){
          return target;
        }else{
            return Exception;
        }
      }else{
            let currAuthority = currentAuthority.split(',');
            let isAuthority = false;
            if(currAuthority.length >= 1){
                currAuthority.map((item) => {
                    if(authority.indexOf(item) >= 0){
                        isAuthority = true;
                    }
                })
            }
            if(isAuthority){
                return target;
            }else{
                return Exception;
            }
      } 
    // if (authority === currentAuthority) {
    //   return target;
    // }
  }

  // Promise 处理
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      // 函数执行后返回值是 Promise
      if (isPromise(bool)) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;

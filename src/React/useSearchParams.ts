import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router';

/** 同步searchParams到地址栏，用法类似于useState */
export const useSearchParams = (initSearchParams: any) => {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const [searchParams, setSearchParams] = useState({
    ...initSearchParams,
    ...getObjectFromSearch(search),
  });

  // 监听searchParams变化，同步值search
  useEffect(() => {
    if (isObjectEqual(searchParams, getObjectFromSearch(search))) return;
    setSearchParamsToQuery(searchParams);
  }, [searchParams]);
  // 监听search变化，同步值searchParams
  useEffect(() => {
    const mergeSearchParams = { ...searchParams, ...getObjectFromSearch(search) };
    if (isObjectEqual(searchParams, mergeSearchParams)) return;
    setSearchParams(mergeSearchParams);
  }, [search]);

  /** 将搜索参数同步至query参数 */
  const setSearchParamsToQuery = (params = {}) => {
    const search = getSearchFromObject(params);
    history.replace({ search, pathname });
  };

  return { searchParams, setSearchParamsToQuery, setSearchParams };
};

export function getObjectFromSearch(str: string) {
  const urlParams = new URLSearchParams(str);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = tryParseJson(value) ?? value;
  }
  return params;
}

export function getSearchFromObject(obj: Record<string, any>) {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (value != undefined) {
      urlParams.append(key, JSON.stringify(value));
    }
  }
  return urlParams.toString();
}

export function isObjectEqual(obj1: Record<string, any>, obj2: Record<string, any>) {
  // 如果两个对象的引用相同，则它们相等
  if (obj1 === obj2) return true;

  // 如果两个对象中有一个不是对象或为null，则它们不相等
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // 获取两个对象的键
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 如果两个对象的键的数量不同，则它们不相等
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 递归比较两个对象的每个键值对
  for (const key of keys1) {
    if (!keys2.includes(key) || !isObjectEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // 如果所有键值对都相等，则对象相等
  return true;
}

export function isObject(value: any) {
  return typeof value === 'object' && value !== null;
}
export function tryParseJson(str: any) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

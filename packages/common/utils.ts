import * as _ from 'lodash';
import * as t from 'types';

export function omitDeep(input: any, props: any): any {
  function omitDeepOnOwnProps(obj: any) {
    if (!_.isArray(obj) && !_.isObject(obj)) {
      return obj;
    }

    if (_.isArray(obj)) {
      return omitDeep(obj, props);
    }

    const o: any = {};
    _.forOwn(obj, (value, key) => {
      o[key] = omitDeep(value, props);
    });

    return _.omit(o, props);
  }

  if (arguments.length > 2) {
    props = Array.prototype.slice.call(arguments).slice(1);
  }

  if (typeof input === 'undefined') {
    return {};
  }

  if (_.isArray(input)) {
    return input.map(omitDeepOnOwnProps);
  }

  return omitDeepOnOwnProps(input);
}

export function omitTypeName(input: any) {
  return omitDeep(input, '__typename');
}

export function dayTypeEnumReverseMapping(value: string) {
  const values = Object.values(t.DayType);
  const keys = Object.keys(t.DayType);
  for (let i = 0; i < values.length; i++) {
    if (keys[i] === value) {
      return values[i];
    }
  }
  return undefined;
}

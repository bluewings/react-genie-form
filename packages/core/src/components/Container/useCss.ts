import { useMemo } from 'react';
import { get } from 'lodash-es';
import { css } from '@emotion/core';
import classNames from '../FormGroup/FormGroup.module.scss';

const FORM_GROUP_GUTTER = '1rem';

const enums = {
  layout: ['vertical', 'horizontal'],
  labelAlign: ['right', 'center', 'left'],
};

const getPreferredValue = (type: string, value: any) => {
  const values = get(enums, [type], []);
  return values.indexOf(value) !== -1 ? value : values[0];
};

function useCss({ layout, labelWidth, labelAlign, styles, plugin }: any) {
  const _layout = useMemo(() => getPreferredValue('layout', layout), [layout]);

  const _labelAlign = useMemo(
    () => getPreferredValue('labelAlign', labelAlign),
    [labelAlign],
  );

  const _serializedStyles = useMemo(() => JSON.stringify(styles), [styles]);

  return useMemo(() => {
    let rootCss;
    if (_layout === 'horizontal') {
      const values = {
        labelWidth: labelWidth || 100,
        labelAlign: 'flex-end',
      };
      if (_labelAlign === 'left') {
        values.labelAlign = 'flex-start';
      } else if (_labelAlign === 'center') {
        values.labelAlign = 'center';
      }
      rootCss = css`
        .${classNames.formGroup} {
          display: flex;
          margin-bottom: ${FORM_GROUP_GUTTER};
          align-items: flex-start;
        }
        .${classNames.label} {
          display: flex;
          flex: 0 0
            ${typeof values.labelWidth === 'number'
              ? `${values.labelWidth}px`
              : values.labelWidth};
          justify-content: ${values.labelAlign};
          padding-right: 0.75rem;
        }
        .${classNames.control} {
          flex: 1 1 auto;
        }
      `;
    } else {
      rootCss = css`
        .${classNames.formGroup} {
          margin-bottom: ${FORM_GROUP_GUTTER};
        }
      `;
    }
    let pluginCss = Object.entries((plugin && plugin.styles) || {}).reduce(
      (accum: any, [k, v]: any) =>
        classNames[k] ? { ...accum, [`.${classNames[k]}`]: v } : accum,
      {},
    );
    let userCss;
    try {
      userCss = Object.entries(JSON.parse(_serializedStyles)).reduce(
        (accum: any, [k, v]: any) =>
          classNames[k] ? { ...accum, [`.${classNames[k]}`]: v } : accum,
        {},
      );
    } catch (e) {
      userCss = {};
    }
    return {
      className: `layout_${_layout} labelAlign_${_labelAlign}`,
      css: css(rootCss, pluginCss, userCss),
    };
  }, [_layout, _labelAlign, labelWidth, _serializedStyles, plugin]);
}

export default useCss;

import { useMemo } from 'react';
import { get } from 'lodash-es';
import { css } from '@emotion/core';
import classNames from '../FormGroup/FormGroup.module.scss';

const FORM_GROUP_GUTTER = '1rem';

const getStyles = (styles: any, size: any) =>
  typeof styles === 'function' ? styles({ size }) : styles;

function useCss({ layout, labelWidth, labelAlign, styles, plugin, size }: any) {
  const _serializedStyles = useMemo(
    () => JSON.stringify(getStyles(styles, size)),
    [styles, size],
  );

  return useMemo(() => {
    let rootCss;
    if (layout === 'horizontal') {
      const values = {
        labelWidth: labelWidth || 100,
        labelAlign: 'flex-end',
      };
      if (labelAlign === 'left') {
        values.labelAlign = 'flex-start';
      } else if (labelAlign === 'center') {
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
    let pluginCss = Object.entries(
      getStyles(plugin && plugin.styles, size) || {},
    ).reduce(
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
      className: `layout_${layout} labelAlign_${labelAlign}`,
      css: css(rootCss, pluginCss, userCss),
    };
  }, [layout, labelAlign, labelWidth, _serializedStyles, plugin, size]);
}

export default useCss;

import { useMemo } from 'react';
import { css } from '@emotion/core';
import classNames from '../FormGroup/FormGroup.module.scss';

const FORM_GROUP_GUTTER = '1rem';

function useCss({ layout, labelWidth, labelAlign }: any) {
  const rootCss = useMemo(() => {
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
      return css`
        .${classNames.formGroup} {
          display: flex;
          margin-bottom: ${FORM_GROUP_GUTTER};
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
    }

    return css`
      .${classNames.formGroup} {
        margin-bottom: ${FORM_GROUP_GUTTER};
      }
    `;
  }, [layout, labelAlign, labelWidth]);

  return rootCss;
}

export default useCss;

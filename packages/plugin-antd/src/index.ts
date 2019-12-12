import formTypes from './formTypes';
import Label from './Label';

const styles = ({ size }: any) =>
  size === 'small'
    ? {
        label: {
          margin: '2px 0 0',
          lineHeight: '1.3125rem',
        },
        formGroup: {
          marginBottom: '0.75rem',
        },
      }
    : {
        formGroup: {
          marginBottom: '1.5rem',
        },
      };

const plugin = { formTypes, Label, styles };

export { plugin, formTypes, Label, styles };

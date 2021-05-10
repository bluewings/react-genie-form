import formTypes from './formTypes';
import Label from './Label';
import ErrorMessage from './ErrorMessage';
import './styles/common.scss';

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

const plugin: any = { formTypes, Label, ErrorMessage, styles };

export { plugin, formTypes, Label, ErrorMessage, styles };

export * from './formTypes';

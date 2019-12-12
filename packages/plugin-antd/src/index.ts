import formTypes from './formTypes';
import Label from './Label';

const styles = {
  formGroup: {
    marginBottom: '1.5rem',
  },
};

const plugin = { formTypes, Label, styles };

export { plugin, formTypes, Label, styles };

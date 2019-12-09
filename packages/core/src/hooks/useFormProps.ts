import useContext from './useContext';

function useFormProps() {
  const value = useContext('formProps');
  return value;
}

export default useFormProps;

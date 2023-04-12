import * as Yup from 'yup';
const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Too Short!')
      .max(20, 'Too Long!')
      .required('Required'),
    ratio: Yup.number()
      .required('Required'),
    applicableItems: Yup.array().min(1).required('Required')
  });
export default schema;
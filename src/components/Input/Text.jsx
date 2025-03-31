import { Field } from 'formik';
import { Form } from 'react-bootstrap';

function Text(props) {
    return (
        <Field name={props.name} type={props.inputType || 'text'}>
            {/* feel free to customize the text control here */}
            {({ field }) => (
                <Form.Control type={props.inputType || 'text'} placeholder={props.placeholder} {...field} />
            )}
        </Field>
    );
}

export default Text;

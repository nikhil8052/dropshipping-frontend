import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';

const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const handleChange = (value) => {
        helpers.setValue(value);
        if (props.onChange) {
            props.onChange(value);
        }
    };
    return (
        <div className="quill-editor">
            <ReactQuill
                value={field.value}
                onChange={handleChange}
                modules={props.modules}
                className="field-quill-control"
                formats={props.formats}
                placeholder={props.placeholder}
            />
        </div>
    );
};
export default RichTextEditor;

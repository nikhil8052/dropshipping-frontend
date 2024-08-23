import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';
import { useRef } from 'react';

const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const quillRef = useRef(null);

    const handleChange = (value) => {
        helpers.setValue(value);
        if (props.onChange) {
            props.onChange(value);
        }
    };

    const handleClick = () => {
        if (quillRef.current) {
            quillRef.current.focus();
        }
    };
    return (
        <div className="quill-editor" onClick={handleClick}>
            <ReactQuill
                ref={quillRef}
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

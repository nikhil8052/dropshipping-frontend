import ReactQuill from 'react-quill';
import { FORMATS, TOOLBAR_CONFIG } from '../../utils/common';

const RichTextEditor = ({ field, form, className = 'field-quill-control' }) => {
    const handleChange = (html) => {
        form.setFieldValue(field.name, html);
    };

    return (
        <ReactQuill
            modules={{
                toolbar: TOOLBAR_CONFIG
            }}
            formats={FORMATS}
            className={className}
            onChange={handleChange}
            theme="snow"
        />
    );
};

export default RichTextEditor;

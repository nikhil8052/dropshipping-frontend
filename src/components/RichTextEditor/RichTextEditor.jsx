import ReactQuill from 'react-quill';

const modules = {
    toolbar: true
};

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video'
];

const RichTextEditor = ({ field, form, className = 'field-quill-control' }) => {
    const handleChange = (html) => {
        form.setFieldValue(field.name, html);
    };

    return (
        <ReactQuill formats={formats} className={className} modules={modules} onChange={handleChange} theme="snow" />
    );
};

export default RichTextEditor;

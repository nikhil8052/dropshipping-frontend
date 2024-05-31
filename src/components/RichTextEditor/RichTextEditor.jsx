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

const RichTextEditor = ({ field, className = 'field-quill-control' }) => {
    return (
        <ReactQuill
            // theme="snow"
            formats={formats}
            className={className}
            modules={modules}
            onChange={field.onChange(field.name)}
            value={field.value}
        />
    );
};

export default RichTextEditor;

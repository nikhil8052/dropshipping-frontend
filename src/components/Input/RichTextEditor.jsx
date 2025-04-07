import ReactQuill,{ Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';
import { useRef } from 'react';
import './input.scss';


const Block = Quill.import('blots/block');

class CustomHeader extends Block {}
CustomHeader.blotName = 'header';
CustomHeader.tagName = ['H1', 'H2', 'H3']; 
Quill.register(CustomHeader, true);



const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const quillRef = useRef(null);

    const TOOLBAR_CONFIG = [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
    ];

     const FORMATS = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link', 'image'
      ];

    const handleChange = (value) => {
        helpers.setValue(value);
        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <div className="quill-editor">
            <ReactQuill
                ref={quillRef}
                value={field.value}
                onChange={handleChange}
                modules={{ toolbar: TOOLBAR_CONFIG }}
                className="field-quill-control"
                formats={FORMATS}
                placeholder={props.placeholder}
            />
        </div>
    );
};
export default RichTextEditor;

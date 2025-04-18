import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';
import { useRef, useEffect } from 'react';
import './input.scss';


const Block = Quill.import('blots/block');

class CustomHeader extends Block { }
CustomHeader.blotName = 'header';
CustomHeader.tagName = ['H1', 'H2', 'H3'];
Quill.register(CustomHeader, true);



const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const quillRef = useRef(null);
    const TOOLBAR_CONFIG = {
        container: [
            ['bold', 'italic', 'underline', 'strike', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['link', 'image', 'video'],
            [{ 'header-h1': 'H1' }, { 'header-h2': 'H2' }, { 'header-h3': 'H3' }, { 'header-h4': 'H4' }],
        ],
        handlers: {
            'header-h1': function () {
                const quill = this.quill;
                quill.format('header', 1);
            },
            'header-h2': function () {
                const quill = this.quill;
                quill.format('header', 2);
            },
            'header-h3': function () {
                const quill = this.quill;
                quill.format('header', 3);
            },
            'header-h4': function () {
                const quill = this.quill;
                quill.format('header', 4);
            },
        }
    };

    const FORMATS = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'blockquote',
        'code-block',
        'link', 'image', 'video'
    ];

    const handleChange = (value) => {
        helpers.setValue(value);
        if (props.onChange) {
            props.onChange(value);
        }
    };

    useEffect(() => {
        const quill = quillRef.current.getEditor();

        const handleAddResource = () => {
            const html = `
             <div class="resource-card mt-2">
                            <img src="https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg" alt="Resource Image" class="resource-image" />
                            <div class="resource-title">This is the Resource Title</div>
                        </div>
            `;
         
            document.getElementById('all_resources').innerHTML += html;

        };

        const button = document.getElementById('add-resource-btn');
        if (button) {
            button.addEventListener('click', handleAddResource);
        }

        // Cleanup on unmount
        return () => {
            if (button) {
                button.removeEventListener('click', handleAddResource);
            }
        };
    }, []);

    return (
        <div className="quill-editor">
            <div id="toolbar" >
                <button className="ql-header" value="1">H1</button>
                <button className="ql-header" value="2">H2</button>
                <button className="ql-header" value="3">H3</button>
                <button className="ql-header" value="4">H4</button>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
                <button className="ql-code-block"></button>
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-blockquote"></button>
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <button className="ql-video"></button>
            </div>
            <ReactQuill
                ref={quillRef}
                value={field.value}
                onChange={handleChange}
                modules={{ toolbar: { container: '#toolbar' } }}
                className="field-quill-control"
                formats={FORMATS}
                placeholder={props.placeholder}
            />
            <div className='card new-resource-main-card'>
                <div className='card-body d-flex flex-column' >
                    <h5 className='card-title'>Resources</h5>

                    <div id="all_resources" >
                        <div class="resource-card">
                            <img src="https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg" alt="Resource Image" class="resource-image" />
                            <div class="resource-title">This is the Resource Title</div>
                        </div>
                        <div class="resource-card mt-3">
                            <img src="https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg" alt="Resource Image" class="resource-image" />
                            <div class="resource-title">This is the Resource Title</div>
                        </div>
                    </div>


                </div>
            </div>
            {/* <div className="card mt-4">
                <div className="card-body d-flex justify-content-between">
                    <h4>Add Resource </h4>
                    <button type="button" className="btn btn-primary btn-sm fr" id="add-resource-btn">
                        Add
                    </button>
                </div>
            </div> */}
        </div>
    );
};
export default RichTextEditor;

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';
import { useRef, useEffect, useState } from 'react';
import './input.scss';
// import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageResize', ImageResize);
import TextField from '@mui/material/TextField';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Card, Form, Dropdown } from 'react-bootstrap';
import Edit2 from '../../assets/icons/Dropdown.svg';
import { useSelector } from 'react-redux';
import { API_URL } from '../../utils/apiUrl';
import axiosWrapper from '../../utils/api';
import resourceImg from '../../../public/resource_image.svg';
import linkImg from '../../../public/linkImg.svg';

const Block = Quill.import('blots/block');

class CustomHeader extends Block { }
CustomHeader.blotName = 'header';
CustomHeader.tagName = ['H1', 'H2', 'H3'];
Quill.register(CustomHeader, true);

const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const quillRef = useRef(null);
    const resourceList = props.resources || [];
    const [nameField, setNameField] = useState('');
    const token = useSelector((state) => state?.auth?.userToken);

    useEffect(() => {
        setNameField(props.showNameFieldData || '');
    }, [props.showNameFieldData]);

    const TOOLBAR_CONFIG = {
        container: [
            ['bold', 'italic', 'underline', 'strike', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['link', 'image', 'video'],
            [{ 'header-h1': 'H1' }, { 'header-h2': 'H2' }, { 'header-h3': 'H3' }, { 'header-h4': 'H4' }]
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
            }
        }
    };
    const modules = {
        toolbar: { container: `#${props.id}` }
        // imageResize: {
        //     parchment: Quill.import('parchment'),
        //     modules: ['Resize', 'DisplaySize', 'Toolbar'],
        // },
    };
    const FORMATS = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'blockquote',
        'code-block',
        'link',
        'image',
        'video'
    ];


    const handleChange = (value) => {
        if (!quillRef.current || !quillRef.current.getEditor) return;

        const quill = quillRef.current.getEditor();
        const editor = quill.root;

        // Ensure all image widths and heights are inlined
        editor.querySelectorAll('img').forEach((img) => {
            const width = img.width;
            const mainWidth = img.data - width;
            const inlineWidth = img.style.width;
            const height = img.height;
            if (width) img.setAttribute('width', width);
            if (width) img.style.removeProperty('width');

        });

        const finalHTML = editor.innerHTML;
        // console.warn(finalHTML);
        helpers.setValue(finalHTML); // Save clean value
        if (props.onChange) props.onChange(finalHTML);
    };
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setNameField(newName);
        if (props.onNameChange) {
            props.onNameChange(newName);
        }
    };

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        let overlayEl = null;
        let isOverlayVisible = false;

        const checkTooltip = () => {
            const tooltip = quill.theme?.tooltip;
            if (!tooltip || !tooltip.root) return;

            const root = tooltip.root;
            const input = root.querySelector('input');

            const isEditing = root.classList.contains('ql-editing');
            const isHidden = root.classList.contains('ql-hidden');
            const isVideoInput = input?.placeholder === 'Embed URL';

            const shouldShowOverlay = isEditing && isVideoInput && !isHidden;

            if (shouldShowOverlay && !isOverlayVisible) {
                if (!overlayEl) {
                    overlayEl = document.createElement('div');
                    overlayEl.id = 'ql-video-overlay';
                    overlayEl.className = 'ql-video-overlay';
                    document.body.appendChild(overlayEl);
                    // delay adding the 'show' class to trigger transition
                    requestAnimationFrame(() => {
                        overlayEl?.classList.add('show');
                    });
                }
                isOverlayVisible = true;
            } else if ((!shouldShowOverlay || isHidden) && isOverlayVisible) {
                overlayEl?.classList.remove('show');
                setTimeout(() => {
                    overlayEl?.remove();
                    overlayEl = null;
                }, 300); // match transition time
                isOverlayVisible = false;
            }
        };

        const interval = setInterval(checkTooltip, 200);

        return () => {
            clearInterval(interval);
            if (overlayEl) overlayEl.remove();
        };
    }, []);




    const deleteResource = async (id) => {
        const ENDPOINT = API_URL.SUPABASE_DELETE_LECTURE_RESOURCE.replace(':id', id);
        const response = await axiosWrapper('POST', ENDPOINT, {}, token);
        props.setResources(prev => prev.filter(resource => resource.id !== id));
      
    }

    const editResource = async (id) => {
        const resourceToEdit = resourceList.find((res) => res.id === id);
        props.setEditResource(true);
        props.setEditResourceID(id);
        if (resourceToEdit) {
            props.setModalShow(true);
            props.setLabel(resourceToEdit.title ?? "");
            props.setResourceFileUrl(resourceToEdit.image ?? "");
            props.setResourceUrl(resourceToEdit.url ?? "");
        }
    }



    return (
        <div className="quill-editor lecture-quill-edit">
            <div id={`${props.id}`}>
                <button className="ql-header" value="1">
                    H1
                </button>
                <button className="ql-header" value="2">
                    H2
                </button>
                <button className="ql-header" value="3">
                    H3
                </button>
                <button className="ql-header" value="4">
                    H4
                </button>
                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>
                <button className="ql-strike"></button>
                <button className="ql-code-block"></button>
                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <button className="ql-blockquote"></button>
                {props.name !== 'transcript' && (
                    <>
                        <button className="ql-link"></button>
                        <button className="ql-image"></button>
                        <button className="ql-video"></button>
                    </>
                )}
            </div>

            {props.showNameField && (
                <>
                    <TextField
                        fullWidth
                        name="name"
                        label="Name"
                        className="field-control name-field-editor"
                        id="name-basic"
                        type="text"
                        value={nameField}
                        onChange={handleNameChange}
                        required
                        autoComplete="off"
                        variant="standard" // or "outlined"
                        InputProps={{
                            disableUnderline: true, // works for standard and filled variant
                            classes: {
                                notchedOutline: 'no-outline'
                            }
                        }}
                        InputLabelProps={{
                            shrink: true
                        }}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if (quillRef.current) {
                            const editor = quillRef.current.getEditor();
                            editor.focus();
                            }
                        }
                        }}
                    />
                </>
            )}

            <ReactQuill
                ref={quillRef}
                value={field.value}
                onChange={handleChange}
                modules={modules}
                className="field-quill-control"
                formats={FORMATS}
                placeholder={props.placeholder}
            />

            {/* Resources List  */}
            {props.showResources && resourceList.length > 0 && (
                <div className="card new-resource-main-card ">
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">Resources</h5>
                        <div id="all_resources">
                            {resourceList.map((resource, index) => (

                                <>
                                    <div key={resource.id} className={`resource-card ${index !== 0 ? 'mt-3' : ''}`}>
                                        {/* <img src={resource.image} alt="Resource" className="resource-image" /> */}
                                        <img src={resource.url ? linkImg : resourceImg} alt="Resource" className="resource-image" />
                                        <div className="resource-title">{resource.title}</div>
                                        <Dropdown align="end">
                                            <Dropdown.Toggle variant="light" className="action-dropdown-toggle" id="dropdown-basic">
                                                <img src={Edit2} alt="" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => editResource(resource.id)}  >Edit</Dropdown.Item>
                                                <Dropdown.Item onClick={() => deleteResource(resource.id)}>Delete</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                </>

                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};
export default RichTextEditor;

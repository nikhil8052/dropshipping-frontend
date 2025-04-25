import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useField } from 'formik';
import { useRef, useEffect, useState } from 'react';
import './input.scss';


const Block = Quill.import('blots/block');

class CustomHeader extends Block { }
CustomHeader.blotName = 'header';
CustomHeader.tagName = ['H1', 'H2', 'H3'];
Quill.register(CustomHeader, true);



const RichTextEditor = (props) => {
    const [field, , helpers] = useField(props.name);
    const quillRef = useRef(null);
    const resourceList = props.resources || [];

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
      
    return (
        <div className="quill-editor">
            <div id={`${props.id}`} >
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
                modules={{ toolbar: { container: `#${props.id}` } }}
                className="field-quill-control"
                formats={FORMATS}
                placeholder={props.placeholder}
            />

            {/* {props.showResources && (
    <div className='card new-resource-main-card'>
        <div className='card-body d-flex flex-column'>
            <h5 className='card-title'>Resources</h5>
            <div id="all_resources">
                <div className="resource-card">
                    <img src="https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg" alt="Resource Image" className="resource-image" />
                    <div className="resource-title">This is the Resource Title</div>
                </div>
                <div className="resource-card mt-3">
                    <img src="https://dropship-api.ropstam.dev/uploads/1736169674625-courseThumbnail.jpeg" alt="Resource Image" className="resource-image" />
                    <div className="resource-title">This is the Resource Title</div>
                </div>
            </div>
        </div>
    </div>
)} */}
            {props.showResources && resourceList.length>0 && (
                <div className='card new-resource-main-card '>
                    <div className='card-body d-flex flex-column'>
                        <h5 className='card-title'>Resources</h5>
                        <div id="all_resources">
                            {resourceList.map((resource, index) => (
                                <div key={resource.id} className={`resource-card ${index !== 0 ? 'mt-3' : ''}`}>
                                    <img src={resource.image} alt="Resource" className="resource-image" />
                                    <div className="resource-title">{resource.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



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

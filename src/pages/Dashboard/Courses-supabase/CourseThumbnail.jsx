import { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import courseThumbnail from '../../../assets/icons/Thumbnail.svg';
import toast from 'react-hot-toast';
import { getFileObjectFromBlobUrl } from '../../../utils/utils';
import UploadSimple from '@icons/UploadSimple.svg';
import Loading from '@components/Loading/Loading';
import ImageCropper from '../../../components/ImageMask/ImageCropper';
import axiosWrapper from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';
import cross from '@icons/red-cross.svg';

const CourseThumbnail = ({ value, onChange }) => {

  console.log( value, " THUMB VALUE ")
  const inputRef = useRef();
  const [loadingThum, setLoadingThumb] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    const image = URL.createObjectURL(file);
    setImageSrc(image);
    setCropping(true);
  };

  const handleCropComplete = async (croppedImage) => {
    setLoadingThumb(true);
    try {
      const file = await getFileObjectFromBlobUrl(croppedImage, 'courseThumbnail.jpeg');
      const formData = new FormData();
      formData.append('files', file);
      formData.append('name', file.name);

      const mediaFile = await axiosWrapper('POST', API_URL.UPLOAD_MEDIA, formData, '', true);
      onChange(mediaFile.data[0].path);
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    } finally {
      setCropping(false);
      setLoadingThumb(false);
    }
  };

  const resetCropper = () => {
    setCropping(false);
    onChange('');
    setImageSrc(null);
    if (inputRef.current) inputRef.current.value = null;
  };
  const [showTranscriptEditor, setShowTranscriptEditor] = useState(false);

  return (
    <div className="upload-form-section thumbnail-block">
      <div className="upload-course-form">
        <div className="thumbnail">
          {!value && <label>Course Thumbnail</label>}
          <input
            ref={inputRef}
            accept=".jpg,.jpeg,.png"
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          
          {loadingThum ? <Loading /> : value ? (
            <div className="image-renderer">
              <span>Course Thumbnail</span>
              <img
                src={value}
                alt="Course thumbnail"
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  width: '200px',
                  height: '128px'
                }}
              />
              <div className="align-self-start" style={{ marginLeft: 'auto' }}>
                <img
                  src={cross}
                  onClick={() => onChange('')}
                  className="reset-image"
                  alt="reset"
                />
              </div>
            </div>
          ) : (
            <div className="image-preview">
              <img src={courseThumbnail} alt="thumbnail" />
              <div className="image-preview-text">
                <div>
                  <p>
                    Upload your course Thumbnail here. <strong>Important guidelines: </strong> 
                    1200x800 pixels or 12:8 Ratio. Supported format: <strong>.jpg, .jpeg, or .png</strong>
                  </p>
                </div>
                <Button
                  type="button"
                  className="upload-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.click();
                  }}
                >
                  Upload Image{' '}
                  <img className="mb-1" src={UploadSimple} alt="Upload Btn" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {cropping && (
          <ImageCropper
            imageSrc={imageSrc}
            onCropComplete={handleCropComplete}
            onCancel={resetCropper}
          />
        )}
      </div>
    </div>
  );
};

export default CourseThumbnail;
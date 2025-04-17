import React, { useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { ErrorMessage } from 'formik';
import { ReactComponent as CrossIcon } from '../../assets/icons/cross.svg'; // Adjust the path to your actual file
import { ReactComponent as UploadIcon } from '../../assets/icons/upload-simple.svg'; // Adjust the path to your actual file
import Loading from '../../components/Loading'; // Adjust the path to your actual component

const CourseThumbnail = ({ isSubmitting, handleSubmit, onBack, imageSrc, bannerImageSrc, cropping, bannerCropping, handleCropComplete, handleBannerCropComplete, resetCropper }) => {
  return (
    <>
      <div className="course-thumbnail">
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <div className="upload-thumbnail-section">
                    <Button
                      type="submit"
                      className="upload-btn"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('thumbnailInput').click(); // Trigger file input click
                      }}
                    >
                      Upload <UploadIcon className="mb-1" />
                    </Button>
                    <input
                      type="file"
                      id="thumbnailInput"
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                    <ErrorMessage name="thumbnail" component="div" className="error" />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="banner-upload-section">
                    <Button
                      type="submit"
                      className="upload-btn"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('bannerInput').click(); // Trigger banner file input click
                      }}
                    >
                      Upload Banner <UploadIcon className="mb-1" />
                    </Button>
                    <input
                      type="file"
                      id="bannerInput"
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                    <ErrorMessage name="banner" component="div" className="error" />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="add-lecture-section">
                    <div className="add-lecture-nav">
                      <div className="d-flex gap-2">
                        <CrossIcon className="cursor-pointer" />
                        <p>Add Lectures</p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button className="add-lecture-btn">+ Add Lecture</Button>
                      </div>
                    </div>

                    {/* Add your logic for displaying the list of lectures */}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  <div className="action-buttons">
                    <Button
                      type="button"
                      className="cancel-btn"
                      disabled={isSubmitting}
                      onClick={onBack}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      Save & Next
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>

        {/* Conditional rendering for cropping */}
        {cropping && (
          <Loading
            imageSrc={imageSrc}
            onCropComplete={handleCropComplete}
            onCancel={resetCropper}
          />
        )}

        {bannerCropping && (
          <Loading
            imageSrc={bannerImageSrc}
            onCropComplete={handleBannerCropComplete}
            onCancel={() => {
              setBannerCropping(false);
              setBannerImageSrc(null);
            }}
            aspect={16 / 10}
          />
        )}
      </div>
    </>
  );
};

export default CourseThumbnail;

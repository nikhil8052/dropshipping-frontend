import { useEffect, useState } from 'react';
import CaretRight from '@icons/CaretRight.svg';
import { Col, Container, Image, Row } from 'react-bootstrap';
import statusIcon from '@icons/status.svg';
import dateIcon from '@icons/dateIcon.svg';
import productNameIcon from '@icons/productName.svg';
import researchMethodIcon from '@icons/researchMethod.svg';
import categoryIcon from '@icons/category.svg';
import dollorIcon from '@icons/dollor.svg';
import linkIcon from '@icons/link.svg';
import landIcon from '@icons/land.svg';
import vedioOneIcon from '@icons/vedio-one.svg';
import berIcon from '@icons/ber.svg';
import ProductDetailField from './ProductDetailField';
import axiosWrapper from '@utils/api';
import { API_URL } from '../../../../utils/apiUrl';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../../utils/common';

const ProductDetail = ({ setSelectedRowId, selectedRowId }) => {
    const [productData, setProductData] = useState({});
    const token = useSelector((state) => state?.auth?.userToken);

    useEffect(() => {
        if (selectedRowId) {
            // Fetch product data based on productId

            getCourseById(selectedRowId);
        }
    }, [selectedRowId]);

    const getCourseById = async (id) => {
        const { data } = await axiosWrapper('GET', `${API_URL.GET_PRODUCT.replace(':id', id)}`, {}, token);

        setProductData(data);
    };

    if (!productData) {
        return <div>Loading...</div>; // or a loading spinner
    }

    return (
        <div className="product-detail-page-wrapper">
            <div className="title-top">
                <span
                    onClick={() => {
                        setSelectedRowId(null);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Students Training Products <img src={CaretRight} alt=">" />
                </span>{' '}
                Product Detail
            </div>
            <Container fluid className="product-detail-page">
                <Row className="d-flex flex-column product-avatar ">
                    <Col className="d-flex justify-content-start">
                        <Image src={productData.avatarUrl} className="avatar" />
                    </Col>
                    <h3> {productData.productName} </h3>
                </Row>
                <ProductDetailField
                    icon={statusIcon}
                    label="Status"
                    value={productData.status}
                    customClass={`${productData.status} productStatus`}
                />
                <ProductDetailField icon={dateIcon} label="Date" value={formatDate(productData.runDate)} />
                <ProductDetailField icon={productNameIcon} label="Product Name" value={productData.productName} />
                <ProductDetailField
                    icon={researchMethodIcon}
                    label="Research Method"
                    value={productData.researchMethod}
                    customClass={'productStatus research text-white'}
                />
                <ProductDetailField icon={categoryIcon} label="Category" value={productData.category} />
                <ProductDetailField icon={dollorIcon} label="Verkoop Prijs" value={productData.verkoopPrijs} />
                <ProductDetailField icon={linkIcon} label="Link" value={productData.link} isLink />
                <ProductDetailField icon={dollorIcon} label="Prijs" value={productData.prijs} />
                <ProductDetailField icon={landIcon} label="Land" value={productData.land} />
                <ProductDetailField icon={vedioOneIcon} label="Video 1" value={productData.video1} isLink />
                <ProductDetailField icon={dollorIcon} label="BTW" value={productData.btw} />
                <ProductDetailField icon={dollorIcon} label="Merge Ex BTW" value={productData.mergeExBtw} />
                <ProductDetailField icon={dollorIcon} label="Merge in BTW" value={productData.mergeInBtw} />
                <ProductDetailField icon={berIcon} label="BER" value={productData.ber} />
            </Container>
        </div>
    );
};

export default ProductDetail;

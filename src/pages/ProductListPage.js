import { json, useLoaderData} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuthToken } from '../util/auth';
import axios from 'axios';


function ProductListPage() {
  const productList = useLoaderData();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };


  console.log("ProductListPage, productList >>>>>>>>>>>>.", productList);


return (
  <>
    {selectedProduct && (
        <ImageDisplayComponent image_path={selectedProduct.image_path} />
      )}



    <h1>상품목록</h1>
    <table border="1">
      <thead>
        <tr>
          <th></th>
          <th>상품코드</th>
          <th>상품명</th>
          <th>상품규격</th>
          <th>상품단위</th>
          <th>상품상세</th>
          <th>상품카테고리</th>
          <th>상품번호</th>
          <th>유통기한</th>
          <th>개수</th>
          <th>입고일</th>
        </tr>
      </thead>
      <tbody>
        {productList.map((productItem, index) => (
          <tr key={`${productItem.proudct_id}-${index}`}>
            <td><input type="checkbox" /></td>
            <td>{productItem.product_code}</td>
            <td><button onClick={() => openModal(productItem)}>{productItem.product_name}</button></td>
            <td>{productItem.product_standard}</td>
            <td>{productItem.product_unit}</td>
            <td>{productItem.product_spec}</td>
            <td>{productItem.category_name}</td>
            <td>{productItem.item_id}</td>
            <td>{productItem.item_exp}</td>
            <td>{productItem.stock_quantity}</td>
            <td>{productItem.stock_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)

}
export default ProductListPage;

const ImageDisplayComponent = ({ image_path }) => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();

        const response = await axios.put(
          'http://localhost:8000/api/v1/stock/product/image',
          { image_path: image_path },
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token, 
            },
            responseType: 'arraybuffer',
          }
        );

        // 배열 버퍼를 base64 문자열로 변환
        const base64Image = arrayBufferToBase64(response.data);
        setImageData(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error('이미지를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, [image_path]);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return <>{imageData && <img src={imageData} alt="대체사진" style={{ height: '300px', width: '300px' }} />}</>;
};

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("ProductListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/product/list/",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: branch_id
    }
  });

  console.log("ProductListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

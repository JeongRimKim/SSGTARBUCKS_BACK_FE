import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';


function ProductListPage() {
  const productList = useLoaderData();
  console.log("ProductListPage, productList >>>>>>>>>>>>.", productList);

  return (
    <>
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
              <td>{productItem.product_name}</td>
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

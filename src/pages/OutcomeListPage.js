import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';

function OutcomeListPage() {
  const saleList = useLoaderData();

  const handleSaleListUpdate = async () => {
    try {
      const token = getAuthToken();
      const branch_id = localStorage.getItem("branch_id");

      const response = await axios({
        method: "PUT",
        url: `http://localhost:8000/api/v1/stock/sale/product`,
        headers: {
          'Content-Type': 'application/json',
          'jwtauthtoken': token
        },
        params: {
          branch_id: branch_id
        }
      });

      console.log("Update Quantity Response:", response.data);

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <>
      <h1>판매내역</h1>

      {saleList && saleList.length > 0 && (
        <>
          <input type="button" value="판매갱신" onClick={() => handleSaleListUpdate()} />

          <table border="1">
            <thead>
              <tr>
                <th>번호</th>
                <th>판매번호</th>
                <th>판매날짜</th>
                <th>판매상태</th>
                <th>상품번호</th>
                <th>상품명</th>
                <th>판매개수</th>
              </tr>
            </thead>
            <tbody>
              {saleList.map((saleItem, index) => (
                <tr key={`${saleItem.item_id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{saleItem.sale_code}</td>
                  <td>{saleItem.sale_date}</td>
                  <td>{saleItem.sale_status}</td>
                  <td>{saleItem.item_id}</td>
                  <td>{saleItem.product_name}</td>
                  <td>{saleItem.sale_list_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {(!saleList || saleList.length === 0) && (
        <p>갱신되지 않은 판매내역이 없습니다.</p>
      )}
    </>
  );
}

export default OutcomeListPage;


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("OutcomeListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/stock/sale/list",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: branch_id
    }

  });

  console.log("OutcomeListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

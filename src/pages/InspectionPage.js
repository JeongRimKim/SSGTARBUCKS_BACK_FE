import { json, useLoaderData, NavLink, useParams, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function InspectionPage() {
  const incomeDetailList = useLoaderData();
  console.log("InspectionPage, incomeDetailList >>>>>>>>>>>>.", incomeDetailList);
  const [scanResult, setScanResult] = useState('');
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { incomeId } = useParams();
  const [itemCode, setItemCode] = useState('');

  const handleScanWebCam = (result) => {
    setScanResult(result);
    setShow(false);
  };

  const handleclick = (itemCode) => {
    setShow(true);
    setItemCode(itemCode);
    console.log(itemCode);
  };

  useEffect(() => {
    const fetchData = async (itemCodeParam) => {
      if (!scanResult || !itemCodeParam) {
        return;
      }
      console.log("itemCode >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", itemCodeParam);

      try {
        const token = getAuthToken();
        const response = await axios.get(
          `http://localhost:8000/api/v1/income/inspection/product`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token
            },
            params: {
              scanResult: scanResult,
              itemCode: itemCodeParam
            }
          }
        );

        console.log("ShowIncomeList.response >>>>>>>>>>>..", response);

        if (response.status !== 200) {
          throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
        }

        const resData = response.data;
        console.log("resData>>>>>>>>>>>>>>", resData);

        navigate(`/income/list/inspection/${incomeId}`);
      } catch (error) {
        console.error("Error during fetchData:", error);
        // navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    if (scanResult) {
      // Fetch data with the updated itemCode
      fetchData(itemCode);
    }
  }, [scanResult, itemCode, navigate, incomeId]);



  //검수완료버튼
  const handleInspectionComplete = async () => {
    try {
      const token = getAuthToken();
      const branch_id = localStorage.getItem("branch_id");
      const response = await axios.get(
        `http://localhost:8000/api/v1/income/inspection/complete`,
        {
          headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
          }, params: {
            incomeId: incomeId,
            branch_id: branch_id
          }
        }
      );

      console.log("handleInspectionComplete.response >>>>>>>>>>>..", response);

      if (response.status !== 200) {
        throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
      }

      const resData = response.data;
      console.log("resData>>>>>>>>>>>>>>", resData);

      
      navigate(`/income/list/`);

    } catch (error) {
      console.error("Error during fetchData:", error);
    }

  }

  return (
    <>
      <h1>검수목록</h1>
      <button onClick={handleInspectionComplete}>검수완료</button>
      {show && <QRScanner onScan={handleScanWebCam} />}
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>번호</th>
            <th>입고번호</th>
            <th>입고일자</th>
            <th>입고총개수</th>
            <th>입고상태</th>
            <th>입고목록번호</th>
            <th>입고상품개수</th>
            <th>입고상품번호</th>
            <th>코드</th>
            <th>입고상품유통기한</th>
            <th>입고상품명</th>
            <th>QR코드</th>
          </tr>
        </thead>
        <tbody>
          {incomeDetailList.map((incomeItem, index) => (
            <tr key={`${incomeItem.income_id}-${index}`}>
              <td><input type="checkbox" /></td>
              <td>{index + 1}</td>
              <td>{incomeItem.income_id}</td>
              <td>{incomeItem.income_date}</td>
              <td>{incomeItem.income_amount}</td>
              <td>{incomeItem.income_list_result}</td>
              <td>{incomeItem.income_list_id}</td>
              <td>{incomeItem.income_list_quantity}</td>
              <td>{incomeItem.item_id}</td>
              <td>{incomeItem.item_code}</td>
              <td>{incomeItem.item_exp}</td>
              <td>{incomeItem.product_name}</td>
              <td><button onClick={() => handleclick(incomeItem.item_code)}>스캔</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default InspectionPage;

// axios 버전
export async function loader({ request, params }) {
  console.log("InspectionPage, loader >>>>>>>>>>>>.", request, params);
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  //const incomeId = params['incomeId'];
  const incomeId = params.incomeId;
  console.log("incomeId---------->", incomeId);
  
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    //url: "http://localhost:8000/api/v1/income/list/inspection",
    url : `http://localhost:8000/api/v1/income/list/inspection/${incomeId}`,
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    }
    
    //,params: {incomeId: incomeId}
      
  });

  console.log("InspectionPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

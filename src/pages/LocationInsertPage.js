import { json, useLoaderData, NavLink, useParams, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function LocationInsertPage() {
  const inspectionList = useLoaderData();
  console.log("LocationInsertPage, inspectionList >>>>>>>>>>>>.", inspectionList);

  const [scanResult, setScanResult] = useState('');
  const [show, hide] = useState(false);
  const branch_id = localStorage.getItem("branch_id");
  const navigate = useNavigate();

  const handleScanWebCam = (result) => {
    setScanResult(result);
  };

  const handleclick = () => {
    hide(show => !show);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!scanResult) {
        return;
      }

      try {
        console.log("스캔결과값----------------->",scanResult);

        const token = getAuthToken();
        const response = await axios.get(
          `http://localhost:8000/api/v1/income/inspection/`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token
            },params: {
              scanResult: scanResult
            },
          }
        );

        console.log("LocationInsertPage.response >>>>>>>>>>>..", response);

        if (response.status !== 200) {
          throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
        }

        const resData = response.data;
        console.log("resData", resData);

        //navigate('/income/list/inspection', { prams: { incomeId: resData } });
        navigate(`/income/list/inspection/${resData}`);
      } catch (error) {
        console.error("Error during fetchData:", error);
        //navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    if (scanResult) {
      fetchData();
    }
  }, [scanResult, navigate]);
  return (
    <>
      <h1>검수상품 보관장소등록</h1>
      <h2>검수내역 승인목록</h2>
      <button onClick={handleclick} >{show ? '스캔취소' : '입고내역서 스캔하기'}</button>

      {show && <QRScanner onScan={handleScanWebCam} />}

      {scanResult}

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

        </tbody>
      </table>
    </>
  );
}

export default LocationInsertPage;
// axios 버전
export async function loader({ request, params }) {
  console.log("InspectionPage, loader >>>>>>>>>>>>.", request, params);
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  const incomeId = params.incomeId;
  console.log("incomeId---------->", incomeId);
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url : `http://localhost:8000/api/v1/stock/checked/inspection/`,
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    }, params: {
      branch_id : branch_id
    }
      
  });

  console.log("InspectionPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

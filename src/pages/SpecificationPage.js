import { json, useLoaderData, NavLink, useParams, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function SpecificationPage() {
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

        console.log("SearchPage.response >>>>>>>>>>>..", response);

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
      <h1>검수하기</h1>
      <button onClick={handleclick} >{show ? '스캔취소' : '입고내역서 스캔하기'}</button>

      {show && <QRScanner onScan={handleScanWebCam} />}

      {scanResult}
    </>
  );
}

export default SpecificationPage;

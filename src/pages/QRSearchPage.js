import { json, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function QRSearchPage() {
  const [scanResult, setScanResult] = useState('');
  const [show, hide] = useState(false);
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
        const token = getAuthToken();
        const response = await axios.get(
          `http://localhost:8000/api/v1/qrcode/search/${scanResult}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token
            }
          }
        );

        console.log("SearchPage.response >>>>>>>>>>>..", response);

        if (response.status !== 200) {
          throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
        }

        const resData = response.data;
        console.log("resData", resData);

        navigate('/qrcode/search/result', { state: { storage: resData } });
      } catch (error) {
        console.error("Error during fetchData:", error);
        navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    if (scanResult) {
      fetchData();
    }
  }, [scanResult, navigate]);

  return (
    <>
      <h1>QR검색</h1>
      <div>
        <button onClick={handleclick}> {show ? '스캔취소' : '스캔하기'}</button><br/>
        {show && <QRScanner onScan={handleScanWebCam} />}

        {scanResult}
      </div>
    </>
  );
}

export default QRSearchPage;

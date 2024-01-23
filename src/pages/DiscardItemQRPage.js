import { json, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function DiscardItemQRPage() {
  const [scanResult, setScanResult] = useState('');
  const [show, hide] = useState(false);
  const branch_id = localStorage.getItem("branch_id");
  const navigate = useNavigate();

  const handleclick = () => {
    hide(show => !show);
  };


  const handleScanProductQR = (result) => {
    if (result.includes('@')) {
      setScanResult(result);
    } else {
      console.log('입력된 값이 유효하지 않습니다. "@"가 포함되어야 합니다.');
      // 유효하지 않은 경우에 대한 처리를 추가할 수 있습니다.
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!scanResult) {
        return;
      }

      try {
        const token = getAuthToken();
        const qrcode_value = scanResult;
        const response = await axios.get(
          `http://localhost:8000/api/v1/qrcode/discard/product/${qrcode_value}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token
            },params: {
              branch_id: branch_id
            },
          }
        );

        console.log("response >>>>>>>>>>>..", response);

        if (response.status !== 200) {
          throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
        }

        const resData = response.data;
        console.log("resData", resData);

        navigate('/');
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
      <h1>폐기상품선택</h1>
      <div>
        <button onClick={handleclick}> {show ? '스캔취소' : '스캔하기'}</button><br/>
        {show && <QRScanner onScan={handleScanProductQR} />}

        {scanResult}
      </div>
    </>
  );
}

export default DiscardItemQRPage;

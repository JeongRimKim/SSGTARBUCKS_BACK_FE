import { json, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

function MoveItemQRPage() {
  const [scanProductResult, setScanProductResult] = useState('');
  const [scanLocationResult, setScanLocationResult] = useState('');
  const [showProductScanner, hideProductScanner] = useState(false);
  const [showLocationScanner, hideLocationScanner] = useState(false);
  const branch_id = localStorage.getItem("branch_id");
  const navigate = useNavigate();

  const handleProductScannerclick = () => {
    hideProductScanner(showProductScanner => !showProductScanner);
  };

  const handleLocationScannerclick = () => {
    hideLocationScanner(showLocationScanner => !showLocationScanner);
  };

  const handleScanProductQR = (result) => {
    if (result.includes('@')) {
      setScanProductResult(result);
    } else {
      console.log('입력된 값이 유효하지 않습니다. "@"가 포함되어야 합니다.');
      // 유효하지 않은 경우에 대한 처리를 추가할 수 있습니다.
    }
  };

  const handleScanLocationQR = (result) => {
    if (scanProductResult) {
      if (result.startsWith('bid')) {
        setScanLocationResult(result);
      } else {
        console.log('입력된 값이 유효하지 않습니다. "bid"로 시작해야 합니다.');
        // 유효하지 않은 경우에 대한 처리를 추가할 수 있습니다.
      }
    } else {
      console.log('먼저 상품을 스캔하세요.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!scanLocationResult || !scanProductResult) {
        return; // 두 값 중 하나라도 없으면 함수를 빠져나갑니다.
      }
      const item_qrcode_value = scanProductResult;
      const location_qrcode_value = scanLocationResult;




      try {
        const token = getAuthToken();
        const response = await axios.get(
          `http://localhost:8000/api/v1/qrcode/stock/move/product/${item_qrcode_value}/${location_qrcode_value}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token,
            }
            , params: {
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

        navigate('/qrcode/move/product');
      } catch (error) {
        console.error("Error during fetchData:", error);
        navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    if (scanLocationResult && scanProductResult) {
      fetchData();
    }
  }, [scanLocationResult, scanProductResult, navigate]);


  return (
    <>
      <h1>상품선택</h1>
      <div>
        <button onClick={handleProductScannerclick}> {showProductScanner ? '상품스캔취소' : '상품스캔하기'}</button><br />
        {showProductScanner && <QRScanner onScan={handleScanProductQR} />}
        {scanProductResult}
      </div>
      <h1>장소선택</h1>
      <div>
        <button onClick={handleLocationScannerclick}> {showLocationScanner ? '장소스캔취소' : '장소스캔하기'}</button><br />
        {showLocationScanner && <QRScanner onScan={handleScanLocationQR} />}
        {scanLocationResult}
      </div>
    </>
  );
}

export default MoveItemQRPage;

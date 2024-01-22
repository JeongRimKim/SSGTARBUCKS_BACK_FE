import { json, useLoaderData, NavLink, useParams, useNavigate } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QRScanner from '../components/QRScanner';

//QR등록
const QRInspectionListToInsertLocation = () => {
  const inspectionList = useLoaderData();
  console.log("LocationInsertPage, inspectionList >>>>>>>>>>>>.", inspectionList);
  const [scanResult, setScanResult] = useState('');
  const [show, hide] = useState(false);
  const [itemId, setitemId] = useState('');
  const navigate = useNavigate();

  const handleScanWebCam = (result) => {
    setScanResult(result);
  };

  const handleclick = (itemId) => {
    hide(show => !show);
    setitemId(itemId);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!scanResult) {
        return;
      }

      try {
        console.log("스캔결과값----------------->",scanResult);
        console.log("선택한 검수내역의 아이템 아이디---->", itemId);

        const token = getAuthToken();
        const response = await axios.get(
          `http://localhost:8000/api/v1/stock/checked/insert/location`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': token
            },params: {
              scanResult: scanResult,
              item_id : itemId
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
        navigate(`/stock/checked/inspection`);
      } catch (error) {
        console.error("Error during fetchData:", error);
        //navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    if (scanResult) {
      fetchData();
    }
  }, [scanResult, navigate]);


  return(
    <>
      <h1>QR로 보관장소 등록하기</h1>
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
            <th>입고상품개수</th>
            <th>입고상품번호</th>
            <th>입고상품유통기한</th>
            <th>입고상품명</th>
            <th>보관장소</th>
            <th>스캔장소</th>
          </tr>
        </thead>
        <tbody>
        {inspectionList.map((incomeItem, index) => (
            <tr key={`${incomeItem.income_id}-${index}`}>
              <td><input type="checkbox" /></td>
              <td>{index + 1}</td>
              <td>{incomeItem.income_id}</td>
              <td>{incomeItem.income_date}</td>
              <td>{incomeItem.income_amount}</td>
              <td>{incomeItem.income_list_result}</td>
              <td>{incomeItem.income_list_quantity}</td>
              <td>{incomeItem.item_id}</td>
              <td>{incomeItem.item_exp}</td>
              <td>{incomeItem.product_name}</td>
              <td>
                <button onClick={() => handleclick(incomeItem.item_id)}>{show ? '스캔취소' : '스캔'}</button>
              </td>
              <td>{scanResult}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
};

//수기등록
const InspectionListToInsertLocation = () => {
  const inspectionList = useLoaderData();
  const branch_id = localStorage.getItem("branch_id");
  const [itemId, setitemId] = useState('');
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = async (location_id,item_id) => {

    console.log(location_id);
    console.log(item_id);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/stock/checked/insert/location`,
        {
          headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': getAuthToken()
          }, params: {
            location_id: location_id,
            item_id: item_id
          }
        }
      );

      console.log("HandleSelectChange.response >>>>>>>>>>>..", response);

      if (response.status !== 200) {
        throw json({ message: '통신에 실패했습니다.' }, { status: 500 });
      }
    } catch (error) {
      console.error("Error during handleSelectChange:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/stock/checked/show/location`,
          {
            headers: {
              'Content-Type': 'application/json',
              'jwtauthtoken': getAuthToken()
            },
            params: {
              branch_id : branch_id
            },
          }
        );

        console.log("InspectionListToInsertLocation.response >>>>>>>>>>>..", response);

        if (response.status !== 200) {
          throw json({ message: '검색에 실패했습니다.' }, { status: 500 });
        }

        const resData = response.data;
        console.log("resData>>>>>>>>>>>>>>", resData);

        setSelectedOption(resData);

        // navigate(`/stock/checked/inspection`);
      } catch (error) {
        console.error("Error during fetchData:", error);
        // navigate('/error', { state: { errorMessage: '조회시 없음' } });
      }
    };

    // 페이지가 마운트될 때 한 번만 실행
    fetchData();
  }, [itemId]);


  return (
    <>
      <h1>수기로 보관장소 등록하기</h1>

      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>번호</th>
            <th>입고번호</th>
            <th>입고일자</th>
            <th>입고총개수</th>
            <th>입고상태</th>
            <th>입고상품개수</th>
            <th>입고상품번호</th>
            <th>입고상품유통기한</th>
            <th>입고상품명</th>
            <th>보관장소</th>
          </tr>
        </thead>
        <tbody>
          {inspectionList.map((incomeItem, index) => (
            <tr key={`${incomeItem.income_id}-${index}`}>
              <td><input type="checkbox" /></td>
              <td>{index + 1}</td>
              <td>{incomeItem.income_id}</td>
              <td>{incomeItem.income_date}</td>
              <td>{incomeItem.income_amount}</td>
              <td>{incomeItem.income_list_result}</td>
              <td>{incomeItem.income_list_quantity}</td>
              <td>{incomeItem.item_id}</td>
              <td>{incomeItem.item_exp}</td>
              <td>{incomeItem.product_name}</td>
              <td>
                <select value={selectedOption} onChange={(e) => { handleSelectChange(e.target.value, incomeItem.item_id ); }}>
                  <option value="">선택</option>
                  {selectedOption && selectedOption.map((item) => (
                    <option key={item.location_id} value={item.location_id}>{item.location_id}/{item.location_code}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};


function LocationInsertPage() {
  const [way, setWay] = useState(true);
  const inspectionList = useLoaderData();
  console.log("LocationInsertPage, inspectionList >>>>>>>>>>>>.", inspectionList);

  
  const toggleWay = () => {
    setWay((prevWay) => !prevWay);
  };

  return (
    <>
      <h1>검수상품 보관장소등록 - 검수승인내역</h1>
      
      <button onClick={() => toggleWay()}>{way ? '수기' : 'QR'}로 등록하기</button>
      {way ? <QRInspectionListToInsertLocation /> : <InspectionListToInsertLocation />}

      
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
    url : `http://localhost:8000/api/v1/stock/checked/inspection`,
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

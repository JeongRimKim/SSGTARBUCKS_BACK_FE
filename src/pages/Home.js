import React, { useState, useEffect } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

import axios from 'axios';

//지점-메인
const BranchMainRenderer = ({ onSelectDate }) => {
  const [totalList, setTotalList] = useState(useLoaderData());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  const handleRetrieve = async () => {
    try {
      onSelectDate(selectedDate);
      console.log(selectedDate);

      const token = getAuthToken();
      const branch_id = localStorage.getItem("branch_id");

      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/v1/branch/main/`,
        headers: {
          'Content-Type': 'application/json',
          'jwtauthtoken': token
        },
        params: {
          branch_id: branch_id,
          curDate: selectedDate
        }
      });

      console.log("select exp date :", response.data);

      // Update the state with the new data
      setTotalList(response.data);

    } catch (error) {
      console.error('Error selecting exp date:', error);
    }
  };

  return (
    <>
      <button onClick={() => handleDateChange(-1)}>전날</button>
      <button onClick={handleRetrieve}>조회</button>
      <button onClick={() => handleDateChange(1)}>다음날</button><br />
      기준일 : <span>{selectedDate.toISOString().split('T')[0]}</span><hr />

      <table border="1">
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>규격</th>
            <th>단위</th>
            <th>상세</th>
            <th>카테고리</th>
            <th>상품고유번호</th>
            <th>유통기한</th>
            <th>상품상태</th>
            <th>저장유형</th>
            <th>저장코드</th>
            <th>저장구역</th>
            <th>저장구역명</th>
            <th>저장별칭</th>
            <th>수량</th>
          </tr>
        </thead>
        <tbody>
              {totalList.map((totalItem, index) => (
                <tr key={`${totalItem.product_id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{totalItem.product_name}</td>
                  <td>{totalItem.product_standard}</td>
                  <td>{totalItem.product_unit}</td>
                  <td>{totalItem.product_spec}</td>
                  <td>{totalItem.category_name}</td>
                  <td>{totalItem.item_id}</td>
                  <td>{totalItem.item_exp}</td>
                  <td>{totalItem.item_status}</td>
                  <td>{totalItem.location_code}</td>
                  <td>{totalItem.location_area}</td>
                  <td>{totalItem.location_section}</td>
                  <td>{totalItem.location_section_name}</td>
                  <td>{totalItem.location_alias}</td>
                  <td>{totalItem.stock_quantity}</td>
                </tr>
              ))}

        </tbody>
      </table>

    </>
  );
};

//관리자-메인
const AdminMainRenderer = ({ onSelectDate }) => {


};

export default function HomePage() {
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");  

  const handleSelectExpDateList = (newDate) => {
    console.log("Selected date:", newDate.toISOString().split('T')[0]);
  };

  return (
    <>
      <h1>인트로(메인) 페이지</h1>
      {branch_id && branch_id.startsWith('b') ? <BranchMainRenderer onSelectDate={handleSelectExpDateList} /> : <AdminMainRenderer />}
    </>
  );
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
    console.log("HomePage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);

    const response = await axios({
      method: "GET",
      url: "http://localhost:8000/api/v1/branch/main",
      headers: {
        'Content-Type': 'application/json',
        'jwtauthtoken': token
      },
      params: {
        branch_id: branch_id
        ,curDate: null
      }
    });
  
    console.log("HomePage.response >>>>>>>>>>>..", response);
  
    if (response.status !== 200) {
      throw json({ message: 'Could not save event.' }, { status: 500 });
    }
  
    const resData = response.data;
    console.log("resData", resData);
    return resData;
  }
  
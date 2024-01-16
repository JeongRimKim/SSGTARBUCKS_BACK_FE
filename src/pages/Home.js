import React, { useState, useEffect } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

import axios from 'axios';


const DateSelector = ({ onSelectDate }) => {
  const totalList = useLoaderData();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
    onSelectDate(newDate);
  };

  return (
    <>
      <button onClick={() => handleDateChange(-1)}>전날</button>
      <button onClick={() => handleDateChange(0)}>조회</button>
      <button onClick={() => handleDateChange(1)}>다음날</button><br />
      기준일 : <span>{selectedDate.toISOString().split('T')[0]}</span><hr />

    </>
  );
};

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSelectExpDateList = (newDate) => {
    console.log("Selected date:", newDate.toISOString().split('T')[0]);
  };

  return (
    <>
      <h1>인트로(메인) 페이지</h1>
      <DateSelector onSelectDate={handleSelectExpDateList} />
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
  
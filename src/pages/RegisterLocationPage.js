import React, { useState } from 'react';
import { redirect } from 'react-router-dom';
import RegisterLocationForm from '../components/RegisterLocationForm';
import axios from 'axios';
import { getAuthToken } from '../util/auth';

function RegisterLocationPage() {
  const [rows, setRows] = useState([
    { location_area: '', location_section_name: '', location_column: '', location_row: '', location_alias: '' },
  ]);

  return (
    <>
      <RegisterLocationForm rows={rows} setRows={setRows} />
    </>
  );
}

export default RegisterLocationPage;

export async function action({ request }) {
  console.log("RegisterLocationPage.action");

  
  const LOCATION_TYPES = {
    STORE: '매장',
    WAREHOUSE: '창고',
  };
  
  const LOCATION_SECTION_MAP = {
    "냉동고": "A",
    "냉장고": "B",
    "다용도렉": "C",
    "매대": "D",
    "상부장": "E",
    "진열대": "F",
    "서랍": "G",
    "수납장": "H",
    "하부장": "I",
    "기타": "J"
  };

  

  const getLocationArea = (area) => {
    return area === LOCATION_TYPES.STORE ? "FR" : area === LOCATION_TYPES.WAREHOUSE ? "BA" : area;
  };
  
  const getLocationSection = (sectionName) => {
    return LOCATION_SECTION_MAP[sectionName] || sectionName;
  };


  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);
  const data = await request.formData();


  // for (const entry of data.entries()) {
  //   console.log(entry);
  // }

  const location_area = data.getAll("location_area");
  const location_section_name = data.getAll("location_section_name");
  const location_column = data.getAll("location_column");
  const location_row = data.getAll("location_row");
  const location_alias = data.getAll("location_alias");
  console.log(location_area,location_section_name,location_column,location_row,location_alias);

  const jsonDataArray = location_area.map((_, index) => ({
    location_area: getLocationArea(location_area[index]),
    location_section_name:  getLocationSection(location_section_name[index])+"1",
    location_section:location_section_name[index],
    location_column: location_column[index],
    location_row: location_row[index],
    location_alias: location_alias[index],
    location_code : `${getLocationArea(location_area[index])}-${getLocationSection(location_section_name[index])}1-${location_column[index].toString().padStart(2, '0')}-${location_row[index].toString().padStart(2, '0')}`
  }));
  

  console.log("jsonDataArray>>",jsonDataArray);
  console.log("jsonDataToString",JSON.stringify(jsonDataArray));
  let resData = '';
  try {
    const response = await axios({
      method: "post",
      url: 'http://localhost:8000/api/v1/qrcode/branch/location/new',
      headers: {
        'Content-Type': 'application/json',
        'jwtauthtoken': token,
      },
      params: {
        branch_id: branch_id
      },
      data: JSON.stringify(jsonDataArray),
    });

    console.log("response>>>>>>", response);
    resData = response.data;

  } catch (error) {
    console.log("error:", error);
    throw new Error("error 발생되었습니다");
  }

  return redirect('/');
}
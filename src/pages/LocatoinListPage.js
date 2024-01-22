import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import axios from 'axios';


function LocatoinListPage() {
  const locationList = useLoaderData();
  //console.log("ProductListPage, productList >>>>>>>>>>>>.", locationList);

  const getLocationType = (area) => {
    switch (area) {
      case 'FR':
        return "매장";
      case 'BA':
        return "창고";
      default:
        return area;
    }
  };
  
  
 
  const LOCATION_SECTION_MAP = {
    "A": "냉동고",
    "B": "냉장고",
    "C": "다용도렉",
    "D": "매대",
    "E": "상부장",
    "F": "진열대",
    "G": "서랍",
    "H": "수납장",
    "I": "하부장",
    "J": "기타",
  };
  const getLocationSection = (section) => {
    const firstLetter = section.charAt(0).toUpperCase();
    return LOCATION_SECTION_MAP[firstLetter] || section;
  };



  return (
    <>
      <h1>보관장소목록</h1>
      <table border="1">
        <thead>
          <tr>
            <th>보관유형</th>
            <th>보관장소</th>
            <th>소분류</th>
            <th>장소코드</th>
            <th>QR</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {locationList.map((locationItem, index) => (
            <tr key={`${locationItem.proudct_id}-${index}`}>
              <td>{getLocationType(locationItem.location_area)}</td>
              <td>{getLocationSection(locationItem.location_section)}</td>
              <td>{locationItem.location_alias}</td>
              <td>{locationItem.location_code}</td>
              <td>QR</td>
              <td>삭제</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )

}
export default LocatoinListPage;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("LocatoinListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/branch/location/list",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: branch_id
    }
  });

  console.log("LocatoinListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

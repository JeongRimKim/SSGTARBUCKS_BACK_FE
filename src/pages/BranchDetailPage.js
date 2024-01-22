import { json, useLoaderData, NavLink } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ModifyRenderer = ({ modifyList, onUpdateDetails, initialUserId }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelectChange = async (event) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedData = modifyList[selectedIndex - 1];
    setSelectedItem(selectedData);
    onUpdateDetails(selectedData, initialUserId);

    try {
      const token = getAuthToken();
      await axios({
        method: "PUT",
        url: "http://localhost:8000/api/v1/admin/branch/user/modify",
        headers: {
          'Content-Type': 'application/json',
          'jwtauthtoken': token
        },
        data: selectedData,
        params: {
          initialUserId: initialUserId
        }
      });
      console.log('Data sent to /branch/user/modify:', selectedData);
    } catch (error) {
      console.error('Error sending data to /branch/user/modify:', error);
    }
  };

  return (
    <>
      <div>수정가능한 목록</div>
      <select onChange={handleSelectChange}>
        <option value="">선택</option>
        {modifyList.map((item, index) => (
          <option key={index}>
            {item.user_id}/{item.user_name}/{item.user_phone}/{item.user_email}
          </option>
        ))}
      </select>
    </>
  );
};

function BranchDetailPage() {
  const userInfo = useLoaderData();
  const [showEditForm, setShowEditForm] = useState(false);
  const [modifyList, setModifyList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(userInfo);
  const [initialUserId, setInitialUserId] = useState(userInfo.user_id);

  const handleEditClick = async () => {
    console.log("버튼누름");
    try {
      const token = getAuthToken();
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/v1/admin/branch/user/modify/list`,
        headers: {
          'Content-Type': 'application/json',
          'jwtauthtoken': token
        }
      });
      console.log('BranchIsNull=========================>', response.data);

      setModifyList(response.data);
      setShowEditForm(true);

    } catch (error) {
      console.error('Error :', error);
    }
  };

  const handleUpdateDetails = (data) => {
    setSelectedItem(data);
    console.log('Initial User ID:', initialUserId);
  };

  return (
    <>
      <h1>지점상세정보</h1>
      <table border="1">
        <thead>
          <tr>
            <th>매니저코드</th>
            <th>매니저이름</th>
            <th>매니저연락처</th>
            <th>매니저이메일</th>
            <th>담당지점 코드</th>
            <th>담당지점 이름</th>
            <th>담당지점 주소</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{selectedItem ? selectedItem.user_id : userInfo.user_id}</td>
            <td>{selectedItem ? selectedItem.user_name : userInfo.user_name}</td>
            <td>{selectedItem ? selectedItem.user_phone : userInfo.user_phone}</td>
            <td>{selectedItem ? selectedItem.user_email : userInfo.user_email}</td>
            <td>{userInfo.branch_id}</td>
            <td>{userInfo.branch_name}</td>
            <td>{userInfo.branch_address}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={handleEditClick}>수정하기</button>

      {showEditForm && <ModifyRenderer modifyList={modifyList} onUpdateDetails={handleUpdateDetails} initialUserId={initialUserId} />}
    </>
  );
}

export default BranchDetailPage;


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request,params }) {
  console.log("BranchDetailPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("params:", params);


  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/admin/branch/detail",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: params.branch_id
    }
  });

  console.log("BranchDetailPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';

//지점 - 검색결과화면
const BranchMainRenderer = () => {
  const users = useLoaderData();
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");  

  return (
    <>
      <h1>매니저-마이페이지</h1>
      <table border="1">
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>연락처</th>
            <th>이메일</th>
            <th>지점코드</th>
            <th>지점명</th>
            <th>지점주소</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{users.user_id}</td>
            <td>{users.user_name}</td>
            <td>{users.user_phone}</td>
            <td>{users.user_email}</td>            
            <td>{users.branch_id}</td>
            <td>{users.branch_name}</td>
            <td>{users.branch_address}</td>


          </tr>
        </tbody>
      </table>
    </>
  )
};

//관리자 - 검색결과화면
const AdminMainRenderer = () => {
  const users = useLoaderData();

  return (
    <>
    <h1>관리자 - 마이페이지</h1>
    <table border="1">
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>연락처</th>
            <th>이메일</th>
            <th>지점코드</th>
            <th>지점명</th>
            <th>지점주소</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{users.user_id}</td>
            <td>{users.user_name}</td>
            <td>{users.user_phone}</td>
            <td>{users.user_email}</td>            
            <td>{users.branch_id}</td>
            <td>{users.branch_name}</td>
            <td>{users.branch_address}</td>


          </tr>
        </tbody>
      </table>
    </>
  );
};


function MyPage() {
  const users = useLoaderData();
  console.log("UserListPage,users>>>>>>>>>>>>.", users)
  const user_type = localStorage.getItem("user_type");  


  return (
    <>
          { user_type === 'manager' ? <BranchMainRenderer /> : <AdminMainRenderer />}
      
    </>
  )

}

export default MyPage;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("UserListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  const user_type = localStorage.getItem("user_type");  
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  let url = null;
  if (user_type === 'manager') {
    url = "http://localhost:8000/api/v1/branch/info";
  } else {
    url = "http://localhost:8000/api/v1/admin/info";
  }

  const response = await axios({
    method: "GET",
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: branch_id
    }
  });

  console.log("UserListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// fetch 기반
export async function loader2({ request }) {
  console.log("MyPagePage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const email = localStorage.getItem("email");
  console.log("token:", token);
  console.log("email:", email);
  const authData = {
    email: email
  }
  const response = await fetch("http://localhost:8000/api/mypage/", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'jwtAuthToken': token
    },
    body: JSON.stringify(authData),
  });


  if (!response.ok) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = await response.data;
  console.log("resData", resData);
  return resData;
}

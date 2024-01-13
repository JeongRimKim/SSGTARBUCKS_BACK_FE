import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';


function UserListPage() {
  const users = useLoaderData();
  console.log("UserListPage,users>>>>>>>>>>>>.", users)
  return (
    <>
      <h1>회원 정보</h1>
      <table border="1">
        <thead>
          <tr>
            <th>아이디</th>
            <th>직급</th>
            <th>지점코드</th>
            <th>지점명</th>
          </tr>
        </thead>
        <tbody>
        <tr>
                <td>점주 조회</td>
                <td>점주 조회222</td>
                <td>점주 조회</td>
                <td>점주 조회</td>
        </tr>

        </tbody>
      </table>
    </>
  )

}
export default UserListPage;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("UserListPage,loader>>>>>>>>>>>>.", request)
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

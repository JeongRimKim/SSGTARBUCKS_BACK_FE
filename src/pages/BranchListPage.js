import { json, useLoaderData,useNavigate,NavLink } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';


function BranchListPage() {
  const navigate = useNavigate();
  const branchList = useLoaderData();
  console.log("BranchListPage, branchList >>>>>>>>>>>>.", branchList);



  return (
    <>
      <h1>지점정보</h1>
      <table border="1">
        <thead>
          <tr>
            <th>번호</th>
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
        {branchList.map((userItem, index) => (
          <tr key={`${userItem.user_id}-${index}`}>
            <td>{index + 1}</td>
            <td>
            <NavLink to={`/admin/branch/detail/${userItem.branch_id}`} >{userItem.branch_id}</NavLink></td>
            <td>{userItem.branch_name}</td>
            <td>{userItem.branch_address}</td>
            <td>{userItem.user_id}</td>
            <td>{userItem.user_name}</td>
            <td>{userItem.user_phone}</td>
            <td>{userItem.user_email}</td>
          </tr>
        ))}
        </tbody>
      </table>



    </>
  )

}
export default BranchListPage;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("BranchListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/admin/branch/list",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    }
  });

  console.log("BranchListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

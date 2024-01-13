import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

// axios import 
import axios from 'axios';

function UpdatePage() {
  const user = useLoaderData();

  return (
    <>
      <h1>관리자 페이지</h1>
    </>
  )
}

export default UpdatePage;

export async function loader({ request }) {
  console.log("UpdatePage.action");
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "get",
    url: 'http://localhost:8000/api/v1/admin/main',
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
      }
  });

  const resData = response.data;
  console.log("resData", resData);

  return resData;

}
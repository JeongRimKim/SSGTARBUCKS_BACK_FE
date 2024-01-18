import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import { useParams } from 'react-router-dom';

// axios import 
import axios from 'axios';

//지점 - 검색결과화면
const BranchMainRenderer = () => {
  const totalList = useLoaderData();
  const { searchWord } = useParams();
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");  

  return (
    <>
      <h1>'{searchWord}' 검색결과</h1>
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
  )


};

//관리자 - 검색결과화면
const AdminMainRenderer = () => {
  const userList = useLoaderData();
  const { searchWord } = useParams();
  console.log("AdminMainRenderer, searchword >>>>>>>>>>>>>>>>>>>>>>>",searchWord);
  console.log("AdminMainRenderer, userList >>>>>>>>>>>>>>>>>>>>>>>",userList);

  return (
    <>
      <h1>관리자 - '{searchWord}' 검색결과</h1>
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
        {userList.map((userItem, index) => (
          <tr key={`${userItem.user_id}-${index}`}>
            <td>{index + 1}</td>
            <td>{userItem.user_id}</td>
            <td>{userItem.user_name}</td>
            <td>{userItem.user_phone}</td>
            <td>{userItem.user_email}</td>
            <td>{userItem.branch_id}</td>
            <td>{userItem.branch_name}</td>
            <td>{userItem.branch_address}</td>

          </tr>
        ))}
        </tbody>
      </table>
    </>
  );
};



function SearchResultPage() {
  const totalList = useLoaderData();
  const { searchWord } = useParams();
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");  
  const user_type = localStorage.getItem("user_type");  

  return (
    <>

    { user_type === 'manager' ? <BranchMainRenderer /> : <AdminMainRenderer />}

    </>
  )

}
export default SearchResultPage;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request, params }) {
  console.log("SearchResultPage,loader>>>>>>>>>>>>.", request, params);
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  const user_type = localStorage.getItem("user_type");
  console.log("token:", token);
  console.log("branch_id:", branch_id);
  let url = null;
  const searchWord = params['searchWord'];
  if (user_type === 'manager') {
    url = "http://localhost:8000/api/v1/branch/integrate/search/";
  } else {
    url = "http://localhost:8000/api/v1/admin/branch/search/";
  }

  if( searchWord == null ){
    searchWord='';
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
      ,searchWord: searchWord
    }
  });

  console.log("SearchResultPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  
  const resData =  response.data;
  console.log("resData", resData);
  return resData;
}

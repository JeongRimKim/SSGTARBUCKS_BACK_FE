import AuthForm from '../components/AuthForm';
import { json, redirect } from 'react-router-dom';

import axios from 'axios';

function AuthenticationPage() {
  return (
    <>
      <AuthForm />
    </>
  );
}
export default AuthenticationPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  console.log("searchParams>>", searchParams);
  const mode = searchParams.get('mode') || 'login';
  console.log("mode>>", mode);

  const data = await request.formData();
  const authData = {
    user_id: data.get('user_id'),
    user_pw: data.get('user_pw')
  };
  console.log("authData>>", authData);
  let resData = '';
  try {
      const response = await axios({
      method: "POST",
      url: 'http://localhost:8000/api/v1/user/' + mode,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(authData),
    });

    
    console.log("response>>>>>>", response);
    //데이터 삽입
    resData = response.data;

    // 자바의 TokenDTO 에 저장된 필드명
    if (mode === "login") {

      const token = resData.jwtauthtoken;
      localStorage.setItem('jwtauthtoken', token);
      localStorage.setItem('branch_id', resData.branch_id);
      localStorage.setItem('branch_name', resData.branch_name);
      localStorage.setItem('user_type', resData.user_type);
      localStorage.setItem('user_id', resData.user_id);
    }
  } catch (error) {
    console.log("error:", error);
    throw new Error("error 발생되었습니다");
  }

  return redirect('/');
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
// https://live-everyday.tistory.com/219 참고
export async function action1({ request }) {
  const searchParams = new URL(request.url).searchParams;
  console.log("searchParams>>", searchParams);
  const mode = searchParams.get('mode') || 'login';
  console.log("mode>>", mode);

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    pwd: data.get('pwd'),
    name: data.get("name") && ''
  };
  console.log("authData>>", authData);
  let resData = '';
  try {
    const response = await axios.post('http://localhost:8000/api/user/' + mode, null, {
      params: authData,
    });

    resData = response.data;

    const token = resData.jwtAuthToken;
    localStorage.setItem('jwtAuthToken', token);
    localStorage.setItem('email', authData.email);

  } catch (error) {
    console.log("error:", error);
    throw new Error("error 발생되었습니다");
  }

  return redirect('/');
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// fetch 버전
export async function action2({ request }) {
  const searchParams = new URL(request.url).searchParams;
  console.log("searchParams>>", searchParams);
  const mode = searchParams.get('mode') || 'login';
  console.log("mode>>", mode);

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    pwd: data.get('pwd'),
    name: data.get("name")
  };
  console.log("authData>>", authData);

  const response = await fetch('http://localhost:8000/api/user/' + mode, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    console.log("!response.ok>>", !response.ok);
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  const resData = await response.json();
  console.log("resData>>>>>>", resData);

  const token = resData.jwtAuthToken;
  localStorage.setItem('jwtAuthToken', token);
  localStorage.setItem('email', authData.email);

  return redirect('/');
}

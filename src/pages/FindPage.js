import { useState } from 'react';
import { json, useLoaderData, NavLink, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function FindPage() {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const navigate = useNavigate();

  const handleFindButtonClick = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: 'http://localhost:8000/api/v1/user/find',
        data: {
          user_id: userId,
          user_email: userEmail,
          user_phone: userPhone,
          auth_code: authCode,
        },
      });

      console.log('Axios Response:', response.data);
      setShowAuthCodeInput(true);

    } catch (error) {
      console.error('Axios Error:', error);
    }
  };


  const handleVerificationButtonClick = async () => {
    try {
      console.log(authCode);

      const verificationResponse = await axios({
        method: "POST",
        url: 'http://localhost:8000/api/v1/user/verify',
        data: {
          user_id: userId,
          auth_code: authCode,
        },
      });

      console.log('Verification Response:', verificationResponse.data);

      if(verificationResponse.data === '성공'){
        navigate('/auth?mode=login');
      }
      // Update the state or handle the result as needed
      setVerificationResult(verificationResponse.data);

    } catch (error) {
      console.error('Verification Axios Error:', error);
    }
  };

  return (
    <>
      <h1>비밀번호 찾기</h1>
      <div>
        <input
          type="text"
          name="user_id"
          placeholder="사원번호"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          name="user_email"
          placeholder="이메일"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          name="user_phone"
          placeholder="핸드폰번호"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />
      </div>
      <div>
        * 입력하신 이메일과 사원정보의 이메일이 일치하지 않으면 발송되지 않습니다.
      </div>
      <button onClick={handleFindButtonClick}>인증코드 보내기</button>
      <hr />
      {showAuthCodeInput && (
        <div>
          인증번호: <input type="text" value={authCode} onChange={(e) => setAuthCode(e.target.value)}/>
          <button onClick={handleVerificationButtonClick}>확인</button>
        </div>
      )}
    </>
  );
}

export default FindPage;

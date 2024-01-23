import {
  Form,
  Link,
  useSearchParams,
  useActionData,
  useNavigation,
} from 'react-router-dom';

//회원가입창 - 참고(삭제가능)
function AuthForm() {
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('mode') === 'login';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <>
      <Form method="post" >
        <h1>{isLogin ? 'Log in' : '비밀번호 찾기'}</h1>
        {!isLogin ? null : <>
          <p>
            <label htmlFor="user_id">아이디</label>
            <input id="user_id" type="text" name="user_id" required />
          </p>
          <p>
            <label htmlFor="user_pw">비밀번호</label>
            <input id="user_pw" type="password" name="user_pw" required />
          </p>
        </>
        }
        
        {isLogin ? null : 
        <>
          
        </>
        }
        <br />
        <div>
          <Link to={`${isLogin ? 'find' : '?mode=login'}`}>
            {isLogin ? '비밀번호 찾기' : '로그인하러가기'}
          </Link>
          <br /><br />
          <button disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save'}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;

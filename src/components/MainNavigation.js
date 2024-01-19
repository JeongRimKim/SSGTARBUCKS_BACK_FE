
import { Form, NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import React, { useState } from 'react';
import classes from './MainNavigation.module.css'

export default function MainNavigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = useRouteLoaderData('tokenRoot');
  console.log("MainNavigation.token", token);
  const branch_id = localStorage.getItem("branch_id");
  const branch_name = localStorage.getItem("branch_name");

  const handleSearch = () => {
    console.log("검색어:", searchQuery);
    const searchResultUrl = `/branch/integrate/search/${searchQuery}`;
    //const searchResultUrl = `/branch/integrate/search?searchName=${searchQuery}`;
    navigate(searchResultUrl);
  };

  return (
    <>
      <div>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>
      </div>

      <NavLink to="/"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >메인페이지</NavLink><br />


      {!token && <NavLink
        to="/auth?mode=login"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >로그인페이지</NavLink>}

      {token && <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>}

      <br />
      {token && <NavLink
        to="/mypage"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >마이페이지</NavLink>}
      <hr />
      {token && <p>지점명 : {branch_name}</p>}

      {token && <NavLink
        to="/location/new"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >장소등록</NavLink>}
      <br />
      {token && <NavLink
        to="/qrcode/search"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >QR검색</NavLink>}
      <br />

      <br />
      {token && <NavLink
        to="/income/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >입고관리-입고목록</NavLink>}

      <br />
      {token && <NavLink
        to="/income/list/inspection"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >입고관리-검수하기</NavLink>}

      <br />
      {token && <NavLink
        to="/stock/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >재고관리-보관목록</NavLink>}

      <br />
      {token && <NavLink
        to="/product/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >상품관리-재고목록</NavLink>}

      <br />
      {token && <NavLink
        to="/stock/sale/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리-판매상품갱신/승인</NavLink>}
      <hr />
      {token && <NavLink
        to="/admin/branch/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >전지점정보조회</NavLink>}
    </>

  )
}


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

      {token && <NavLink
        to="/admin"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >관리자전용</NavLink>}

      <br />
      {token && <NavLink
        to="/branch"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >회원전용</NavLink>}

      <br/>
      {token && <p>지점명 : {branch_name}</p>}
      <br />
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

      <hr/>

      <br />
      {token && <NavLink
        to="/income/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >입고관리</NavLink>}


      <br />
      {token && <NavLink
        to="/stock/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >재고관리</NavLink>}

      <br />
      {token && <NavLink
        to="/product/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >상품관리</NavLink>}

      <br />
      {token && <NavLink
        to="/stock/sale/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리</NavLink>}

    </>

  )
}

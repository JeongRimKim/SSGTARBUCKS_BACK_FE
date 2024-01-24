
import { Form, NavLink, useNavigate, useRouteLoaderData } from "react-router-dom";
import React, { useState } from 'react';
import classes from './MainNavigation.module.css'
 
export default function MainNavigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = useRouteLoaderData('tokenRoot');
  //console.log("MainNavigation.token", token);
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

      {!token && <NavLink
        to="/auth?mode=login"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >로그인페이지</NavLink>}
      {token && <NavLink to="/"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >메인페이지</NavLink>
      }
      {token && <div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      }
      {token && <NavLink
        to="/qrcode/search"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >QR검색</NavLink>}
      {token && <Form action="/logout" method="post">
        <button>Logout</button>
      </Form>}
      <hr />
      {token && <p>지점명 : {branch_name}</p>}
      {token && <NavLink
        to="/location/new"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >기준정보-장소등록</NavLink>}
       <br />
       {token && <NavLink
        to="/branch/location/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >기준정보-장소내역</NavLink>}
       <br />
      {token && <NavLink
        to="/income/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >입고관리-입고목록</NavLink>}

      <br />
      {token && <NavLink
        to="/income/specification"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >입고관리-검수하기</NavLink>}
      <br />
      {token && <NavLink
        to="/stock/checked/inspection"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >재고관리-검수상품 보관장소등록</NavLink>}
      <br />
      {token && <NavLink
        to="/stock/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >재고관리-보관장소내역</NavLink>}
      <br/>
            {token && <NavLink
        to="/product/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >재고관리-상품내역</NavLink>}

      <br />
      {token && <NavLink
        to="/qrcode/move/product"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리-상품이동</NavLink>}
 
      <br />
      {token && <NavLink
        to="/qrcode/outcome/product"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리-사용등록</NavLink>}
      <br/>
      {token && <NavLink
        to="/qrcode/discard/product"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리-폐기등록</NavLink>}
      <br/>
      {token && <NavLink
        to="/stock/sale/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >출고관리-판매상품갱신/승인</NavLink>}
      <br/>
        {token && <NavLink
        to="/mypage"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >지점정보</NavLink>}
      <hr />
      {token && <NavLink
        to="/admin/branch/list"
        className={({ isActive }) =>
          isActive ? classes.menu : undefined
        }
      >관리자 - 지점관리</NavLink>}
    </>

  )
}

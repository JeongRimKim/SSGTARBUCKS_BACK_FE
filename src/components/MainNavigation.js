
import { Form, NavLink, useRouteLoaderData } from "react-router-dom";

import classes from './MainNavigation.module.css'

export default function MainNavigation() {
  const token = useRouteLoaderData('tokenRoot');
  console.log("MainNavigation.token", token);
  const branch_name = localStorage.getItem("branch_name");
  return (
    <>
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
      {token && <a>지점명 : {branch_name}</a>}
    </>

  )
}

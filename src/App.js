
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage, { loader as homeLoader } from "./pages/Home";
import SignupPage, { action as signupAction } from "./pages/SignupPage.js";
import RootLayout from "./pages/Root";
import ErrorPage from './pages/Error';
import AuthenticationPage, { action as authAction } from "./pages/Authentication.js";
import { tokenLoader } from './util/auth';
import { action as logoutAction } from './pages/Logout.js';
import MyPage, { loader as userListLoader } from './pages/MyPage.js';
import UpdatePage, { loader as updateLoader } from "./pages/UpdatePage.js";
import IncomeListPage, { loader as incomeLoader } from "./pages/IncomeListPage.js";
import StockListPage, { loader as stockLoader } from "./pages/StockListPage.js";
import ProductListPage, { loader as productLoader } from "./pages/ProductListPage.js";
import OutcomeListPage, { loader as outcomeLoader } from "./pages/OutcomeListPage.js";
import SearchResultPage, { loader as searchLoader } from "./pages/SearchResultPage.js";
import QRSearchPage from "./pages/QRSearchPage.js";
import QRSearchResultPage from "./pages/QRSearchResultPage.js";
import RegisterLocationPage, { action as registerLocationAction } from "./pages/RegisterLocationPage";
import BranchListPage, { loader as branchLoader } from "./pages/BranchListPage.js";
import BranchDetailPage, { loader as branchDetailLoader } from "./pages/BranchDetailPage.js";
import InspectionPage, { loader as inspectionLoader } from "./pages/InspectionPage.js";
import SpecificationPage from "./pages/SpecificationPage.js";
import LocationInsertPage, { loader as LocationCheckedLoader } from "./pages/LocationInsertPage.js";
import DiscardItemQRPage from "./pages/DiscardItemQRPage.js";
import UseItemQRPage from "./pages/UseItemQRPage.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'tokenRoot',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },

      { path: 'signup', element: <SignupPage /> },

      {
        path: 'auth',
        element: <AuthenticationPage />,
        action: authAction
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: 'mypage', element: <MyPage />,
        loader: userListLoader
      },
      {
        path: 'admin', element: <UpdatePage />,
        loader: updateLoader
      },
      {
        path: 'location/new'
        , element: <RegisterLocationPage />
        , action: registerLocationAction,
      },
      {
        path: 'qrcode/search', element: <QRSearchPage />,
      },
      {
        path: 'qrcode/search/result', element: <QRSearchResultPage />,
      },
      {
        path: 'income/list', element: <IncomeListPage />,
        loader: incomeLoader
      },
      {
        path: 'stock/list', element: <StockListPage />,
        loader: stockLoader
      },
      {
        path: 'product/list', element: <ProductListPage />,
        loader: productLoader
      },
      {
        path: 'stock/sale/list', element: <OutcomeListPage />,
        loader: outcomeLoader
      },
      {
        path: '/branch/integrate/search/:searchWord', element: <SearchResultPage />,
        loader: searchLoader
      },
      {
        path: 'admin/branch/list', element: <BranchListPage />,
        loader: branchLoader
      },
      {
        path: 'admin/branch/detail/:branch_id', element: <BranchDetailPage />,
        loader: branchDetailLoader
      },
      {
        path: 'income/list/inspection/:incomeId', element: <InspectionPage />,
        loader: inspectionLoader
      },
      {
        path: 'income/specification', element: <SpecificationPage />
      },
      {
        path: 'stock/checked/inspection', element: <LocationInsertPage />,
        loader: LocationCheckedLoader
      },
      {
        path: 'qrcode/outcome/product'
        , element: <UseItemQRPage />
      },
      {
        path: 'qrcode/discard/product'
        , element: <DiscardItemQRPage />
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;

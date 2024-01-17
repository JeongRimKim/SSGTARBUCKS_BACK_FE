import React from 'react';
import { useLocation } from 'react-router-dom';


function QRSearchResultPage() {
    const {state} = useLocation();
    const searchResult = state?.storage;
    if (!searchResult) {
      // Handle the case where storage is undefined or null
      return <p>Loading... {searchResult}</p>; // Or any other loading state
    }
    const { product_id, product_name, product_unit, product_spec, qrcode_id, qrcode_date, item_id, item_code, item_exp, location_code, location_section_name, location_alias, location_column, location_row } = searchResult;
    return (
      <>
         <h1>검색결과</h1>
      <div>
        <h5>상품정보</h5>
        품목 id: {product_id}<br />
        상품명: {product_name}({product_unit},{product_spec})<br />
        QR코드: {qrcode_id} (생성일자: {qrcode_date})<br />
        (생략) 상품 id: {item_id}<br />
        상품 코드: {item_code}<br />
        상품 유통기한: {item_exp}<br />
      </div>
      <div>
        <h5>보관장소정보</h5>
        보관장소코드: {location_code}<br />
        보관장소명: {location_section_name}<br />
        보관장소별칭: {location_alias}<br />
        보관위치: {location_column} 열, {location_row} 행<br />
      </div>
      </>
    );
  }


export default QRSearchResultPage;
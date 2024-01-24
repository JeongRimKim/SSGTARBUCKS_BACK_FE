import React from 'react';
import { useLocation } from 'react-router-dom';


function QRSearchResultPage() {
  const { state } = useLocation();
  const searchResult = state?.storage;
  if (!searchResult) {
    // Handle the case where storage is undefined or null
    return <p>Loading... {searchResult}</p>; // Or any other loading state
  }
  const totalList = searchResult.map((item, index) => ({
    product_id: item.product_id,
    product_name: item.product_name,
    product_standard: item.product_standard,
    product_unit: item.product_unit,
    category_name: item.category_name,
    product_spec: item.product_spec,
    item_id: item.item_id,
    item_code: item.item_code,
    item_exp: item.item_exp,
    image_path: item.image_path,
    item_qrcode_value: item.item_qrcode_value,
    item_qrcode_path: item.item_qrcode_path,
    stock_quantity: item.stock_quantity,
    stock_date: item.stock_date,
    location_code: item.location_code,
    location_section_name: item.location_section_name,
    location_alias: item.location_alias,
    location_qrcode_value: item.location_qrcode_value,
    location_qrcode_path: item.location_qrcode_path,
  }));

  return (
    <>
      <h1>검색결과</h1>
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
  );
}


export default QRSearchResultPage;
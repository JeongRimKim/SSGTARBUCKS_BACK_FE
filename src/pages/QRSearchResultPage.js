import React from 'react';
import { useLocation } from 'react-router-dom';


function QRSearchResultPage() {
  const { state } = useLocation();
  const searchResult = state?.storage;
  if (!searchResult) {
    // Handle the case where storage is undefined or null
    return <p>Loading... {searchResult}</p>; // Or any other loading state
  }
  const resultMap = searchResult.map((item, index) => ({
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
      <table>
        <thead>
          <th> 상품정보</th>
          <th></th>
          <th>위치정보</th>
        </thead>
        <tbody>

          {resultMap.map((result, index) => (
            <tr key={index}>
              <td>
                {result.category_name}&nbsp;&nbsp;
                {result.product_id},&nbsp;&nbsp;
                {result.product_name}({result.product_standard} {result.product_unit})&nbsp;&nbsp;
                {result.item_code}&nbsp;&nbsp;
                {result.item_exp}&nbsp;&nbsp;
                {result.item_qrcode_value}
              </td>
              <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>
                {result.location_code},{result.stock_quantity},{result.location_section_name},{result.location_alias},{result.location_qrcode_value}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </>
  );
}


export default QRSearchResultPage;
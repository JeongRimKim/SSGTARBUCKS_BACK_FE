import React, { useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';
import axios from 'axios';

function StockListPage() {
  const initialStockList = useLoaderData();
  const [stockList, setStockList] = useState(initialStockList);
  const [selectedStorageType, setSelectedStorageType] = useState(''); 
  const [selectedStorageLocation, setSelectedLocation] = useState(''); 
  const [selectedStorageCol, setSelectedCol] = useState(''); 
  const [selectedStorageRow, setSelectedRow] = useState(''); 

  //보관개수수정
  const handleQuantityChange = async (index, delta,itemId) => {
    try {
      const updatedStockList = [...stockList];
      const updatedItem = { ...updatedStockList[index] };

      updatedItem.stock_quantity += delta;

      updatedStockList[index] = updatedItem;
      setStockList(updatedStockList);

      const token = getAuthToken();
      const branch_id = localStorage.getItem("branch_id");
      
      const response = await axios({
        method: "PUT",
        url: `http://localhost:8000/api/v1/stock/quantity/`,
        headers: {
          'Content-Type': 'application/json',
          'jwtauthtoken': token
        },
        params: {
          branch_id: branch_id
        },
        data: {
          item_id : itemId
          ,stock_quantity: updatedItem.stock_quantity
        }
      });

      console.log("Update Quantity Response:", response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }


  };

  console.log(selectedStorageLocation);
  
  //보관유형 셀렉트박스
  const filterStockList = () => {
    if (!selectedStorageType && !selectedStorageLocation && !selectedStorageCol && !selectedStorageRow) {
      return stockList; 
    }

    let filteredList = stockList;

    if (selectedStorageType) {
      filteredList = filteredList.filter(stockItem => stockItem.location_area === selectedStorageType);
    }

    if (selectedStorageLocation) {
      filteredList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
    } 

    if (selectedStorageCol) {
      filteredList = filteredList.filter(stockItem => stockItem.location_code.substring(6, 8) === selectedStorageCol);
    }

    if (selectedStorageRow) {
      filteredList = filteredList.filter(stockItem => stockItem.location_code.substring(9, 11) === selectedStorageRow);
    }
    
    return filteredList;
  };

  return (
    <>
      <h1>보관장소 목록</h1>
        보관유형
        <select onChange={(e) => setSelectedStorageType(e.target.value === '매장' ? 'FR' : e.target.value === '창고' ? 'BA' : '')}>
            <option>유형선택</option>
            <option>매장</option>
            <option>창고</option>
        </select>
        
        보관장소
        <select onChange={(e) => setSelectedLocation(e.target.value ==='구역선택'? '' : e.target.value)}>
            <option>구역선택</option>
            <option>상부장</option>
            <option>하부장</option>
            <option>냉장고</option>
            <option>냉동고</option>
            <option>쇼케이스</option>
            <option>매대</option>
            <option>진열대</option>
            <option>다용도랙</option>
            <option>기타</option>
        </select>

        세로열<input type="text" onKeyUp={(e) => setSelectedCol(e.target.value.padStart(2, '0'))}/>
        가로열<input type="text" onKeyUp={(e) => setSelectedRow(e.target.value.padStart(2, '0'))} />
        <input type="button" value="선택이동" />
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>보관장소번호</th>
            <th>보관장소코드</th>
            <th>보관유형</th>
            <th>보관장소</th>
            <th>보관장소별칭</th>
            <th>세로줄</th>
            <th>가로줄</th>
            <th>보관번호</th>
            <th>보관개수</th>
            <th>보관상품명</th>
            <th>보관상품 규격</th>
            <th>유통기한</th>
          </tr>
        </thead>
        <tbody>
          {filterStockList().map((stockItem, index) => (
            <tr key={`${stockItem.location_id}-${index}`}>
              <td><input type="checkbox" /></td>
              <td>{stockItem.location_id}</td>
              <td>{stockItem.location_code}</td>
              <td>{stockItem.location_area === 'FR' ? '매장' : stockItem.location_area === 'BA' ? '창고' : ''}</td>
              <td>{stockItem.location_section_name}</td>
              <td>{stockItem.location_alias}</td>
              <td><span>{stockItem.location_code.substring(6, 8)}</span></td>
              <td><span>{stockItem.location_code.substring(9, 11)}</span></td>
              <td>{stockItem.stock_id}</td>
              <td>
                <input type='hidden' value={stockItem.item_id} />
                <button onClick={() => handleQuantityChange(index, -1, stockItem.item_id)}>-</button>
                {stockItem.stock_quantity}
                <button onClick={() => handleQuantityChange(index, 1, stockItem.item_id)}>+</button>
              </td>
              <td>{stockItem.product_name}</td>
              <td>{stockItem.product_standard}</td>
              <td>{stockItem.item_exp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default StockListPage;


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
  console.log("StockListPage,loader>>>>>>>>>>>>.", request)
  const token = getAuthToken();
  const branch_id = localStorage.getItem("branch_id");
  console.log("token:", token);
  console.log("branch_id:", branch_id);

  const response = await axios({
    method: "GET",
    url: "http://localhost:8000/api/v1/stock/list/",
    headers: {
      'Content-Type': 'application/json',
      'jwtauthtoken': token
    },
    params: {
      branch_id: branch_id
    }
  });

  console.log("StockListPage.response >>>>>>>>>>>..", response);

  if (response.status !== 200) {
    throw json({ message: 'Could not save event.' }, { status: 500 });
  }

  const resData = response.data;
  console.log("resData", resData);
  return resData;
}

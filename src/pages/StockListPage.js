import React, { useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

import axios from 'axios';
import LocationForm from '../components/LocationForm';

function StockListPage() {
  const initialStockList = useLoaderData();
  const [stockList, setStockList] = useState(initialStockList);
  const [selectedStorageType, setSelectedStorageType] = useState('');
  const [selectedStorageLocation, setSelectedLocation] = useState('');
  const [selectedLocationAlias, setSelectedLocationAlias] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  //보관개수수정
  const handleQuantityChange = async (index, delta, itemId) => {
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
          item_id: itemId
          , stock_quantity: updatedItem.stock_quantity
        }
      });

      console.log("Update Quantity Response:", response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };


  //보관유형 셀렉트박스
  const filterStockList = () => {
    if (!selectedStorageType && !selectedStorageLocation && !selectedLocationAlias) {
      return stockList;
    }

    let filteredList = stockList;

    if (selectedStorageType) {
      filteredList = filteredList.filter(stockItem => stockItem.location_area === selectedStorageType);
    }

    if (selectedStorageLocation) {
      filteredList = filteredList.filter(stockItem => stockItem.location_section_name === selectedStorageLocation);
    }

    if (selectedLocationAlias) {
      filteredList = filteredList.filter(stockItem => stockItem.location_alias === selectedLocationAlias);
    }

    return filteredList;
  };
  //별칭종류 가져오기
  const aliasList = () => {
    const filteredList = filterStockList();
    if (Array.isArray(filteredList) && filteredList.length > 0) {
      const uniqueAliases = [...new Set(filteredList.map(item => item.location_alias))];
      //console.log("별칭종류 : ",uniqueAliases);
      return uniqueAliases;
    } else {
      return [];
    }
  };
  //체크박스 변경
  const handleCheckboxChange = (stockItem) => {
    const updatedSelectedItems = [...selectedItems];
    const index = updatedSelectedItems.findIndex(item => item.stock_id === stockItem.stock_id);

    if (index === -1) {
      updatedSelectedItems.push(stockItem);
    } else {
      updatedSelectedItems.splice(index, 1);
    }

    setSelectedItems(updatedSelectedItems);
  };

  //상품이동 모달 켜기
  const handleMoveItemsClick = () => {
    setShowLocationForm(true);
  };
  
  //선택해제
  const resetSelectedItems = () => {
    //데이터 삭제
    setSelectedItems([]);
    //체크해제

  };


  return (
    <>
      {showLocationForm && (
        <LocationForm selectedItems={selectedItems} stockList={initialStockList} />
      )}
      
      <h1>보관장소 목록</h1>
      보관유형
      <select onChange={(e) => setSelectedStorageType(e.target.value === '매장' ? 'FR' : e.target.value === '창고' ? 'BA' : '')}>
        <option>유형선택</option>
        <option>매장</option>
        <option>창고</option>
      </select>

      보관장소
      <select onChange={(e) => setSelectedLocation(e.target.value === '구역선택' ? '' : e.target.value)}>
        <option>구역선택</option>
        <option>상부장</option>
        <option>하부장</option>
        <option>냉장고</option>
        <option>냉동고</option>
        <option>쇼케이스</option>
        <option>매대</option>
        <option>진열대</option>
        <option>다용도렉</option>
        <option>기타</option>
      </select>

      소분류
      <select onChange={(e) => setSelectedLocationAlias(e.target.value === '별칭선택' ? '' : e.target.value)}>
        <option>명칭선택</option>
        {aliasList().map((alias, index) => (
          <option key={index}>{alias}</option>
        ))}
      </select>
      <br />
       <button onClick={handleMoveItemsClick}>상품이동</button>
      <button onClick={resetSelectedItems}>선택해제</button>
      <table border="1">
        <thead>
          <tr>
            <th></th>
            <th>보관장소번호</th>
            <th>보관장소코드</th>
            <th>보관유형</th>
            <th>보관장소</th>
            <th>보관장소별칭</th>
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
              <td><input type="checkbox" checked={selectedItems.includes(stockItem)} onChange={() => handleCheckboxChange(stockItem)} /></td>
              <td>{stockItem.location_id}</td>
              <td>{stockItem.location_code}</td>
              <td>{stockItem.location_area === 'FR' ? '매장' : stockItem.location_area === 'BA' ? '창고' : ''}</td>
              <td>{stockItem.location_section_name}</td>
              <td>{stockItem.location_alias}</td>
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




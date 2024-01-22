import { useState, redirect, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from '../util/auth';

const LocationForm = ({ selectedItems, stockList }) => {
    const [MoveItemsModal, setMoveItemsModal] = useState(true);
    const [moveItems, setMoveItems] = useState(selectedItems);
    const [selectedMoveStorageType, setSelectedMovedStorageType] = useState('');
    const [selectedMoveStorageLocation, setSelecteMovedLocation] = useState('');
    const [selectedMoveLocationAlias, setSelectedMoveLocationAlias] = useState('');
    // 별칭종류 가져오기
    const [aliasOptions, setAliasOptions] = useState([]);

    useEffect(() => {
        const fetchAliasList = async () => {
            try {
                const filteredList = await filterMoveStockList(); // 필터링된 목록을 기다림

                if (Array.isArray(filteredList) && filteredList.length > 0) {
                    const uniqueAliases = [...new Set(filteredList.map(item => item.location_alias))];
                    setAliasOptions(uniqueAliases);
                } else {
                    setAliasOptions([]);
                }
            } catch (error) {
                console.error("Error in fetchAliasList:", error);
                setAliasOptions([]);
            }
        };

        fetchAliasList();
    }, [selectedMoveStorageType, selectedMoveStorageLocation, selectedMoveLocationAlias, stockList]);

    const closeMoveItemsModal = () => {
        setMoveItemsModal(false);
    };

    useEffect(() => {
        // select 요소가 변경될 때마다 필터링을 다시 수행
        fetchAliasList();
    }, [selectedMoveStorageType, selectedMoveStorageLocation, selectedMoveLocationAlias, stockList]);


    // 이동 보관장소 셀렉트박스 필터링
    const filterMoveStockList = async () => {
        const movestockList = stockList; // 재고 정보 가져오기
        if (!selectedMoveStorageType && !selectedMoveStorageLocation && !selectedMoveLocationAlias) {
            return movestockList;
        }

        let filteredList = movestockList;

        if (selectedMoveStorageType) {
            filteredList = filteredList.filter(stockItem => stockItem.location_area === selectedMoveStorageType);
        }

        if (selectedMoveStorageLocation) {
            filteredList = filteredList.filter(stockItem => stockItem.location_section_name === selectedMoveStorageLocation);
        }

        if (selectedMoveLocationAlias) {
            filteredList = filteredList.filter(stockItem => stockItem.location_alias === selectedMoveLocationAlias);
        }

        return filteredList;
    };

    // 이동 보관장소 셀렉트박스 변경 이벤트 핸들러
    const handleMoveStorageTypeChange = (e) => {
        setSelectedMovedStorageType(e.target.value);
    };

    // 이동 보관장소 셀렉트박스 변경 이벤트 핸들러
    const handleMoveStorageLocationChange = (e) => {
        setSelecteMovedLocation(e.target.value);
    };

    // 이동 보관장소 셀렉트박스 변경 이벤트 핸들러
    const handleMoveLocationAliasChange = (e) => {
        setSelectedMoveLocationAlias(e.target.value);
    };

    // 별칭 종류 가져오기
    const fetchAliasList = async () => {
        try {
            const filteredList = await filterMoveStockList(); // 필터링된 목록을 기다림

            if (Array.isArray(filteredList) && filteredList.length > 0) {
                const uniqueAliases = [...new Set(filteredList.map(item => item.location_alias))];
                setAliasOptions(uniqueAliases);
            } else {
                setAliasOptions([]);
            }
        } catch (error) {
            console.error("Error in fetchAliasList:", error);
            setAliasOptions([]);
        }
    };


    //이동개수수정
    const handleQuantityChange = (index, delta, itemId) => {
        const updatedStockList = [...moveItems];
        const updatedItem = { ...moveItems[index] };
        const max_count = selectedItems[index].stock_quantity;

        console.log("updateItem : ", updatedItem, max_count);
        if (delta === 1 && updatedItem.stock_quantity < max_count) {
            // 증가 로직
            updatedItem.stock_quantity += delta;
            console.log("이동갯수조정", updatedStockList);
        } else if (delta === -1 && updatedItem.stock_quantity > 1) {
            // 감소 로직
            updatedItem.stock_quantity += delta;
            console.log("이동갯수조정", updatedStockList);
        }

        // 배열을 업데이트합니다.
        updatedStockList[index] = updatedItem;

        // setMoveItems를 호출하여 상태를 업데이트합니다.
        setMoveItems(updatedStockList);
    };


    return (
        <>
            {MoveItemsModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeMoveItemsModal}>&times;</span>

                        <h1>이동 장소 선택</h1>
                        보관유형
                        <select onChange={(e) => setSelectedMovedStorageType(e.target.value === '매장' ? 'FR' : e.target.value === '창고' ? 'BA' : '')}>
                            <option>유형선택</option>
                            <option>매장</option>
                            <option>창고</option>
                        </select>

                        보관장소
                        <select onChange={(e) => setSelecteMovedLocation(e.target.value === '구역선택' ? '' : e.target.value)}>
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
                        <select onChange={(e) => setSelectedMoveLocationAlias(e.target.value === '별칭선택' ? '' : e.target.value)}>
                            <option>명칭선택</option>
                            {aliasOptions.map((alias, index) => (
                                <option key={index}>{alias}</option>
                            ))}
                        </select>
                    </div>

                    <table border="1">
                        <thead>
                            <tr>
                                <th>보관장소번호</th>
                                <th>보관장소코드</th>
                                <th>보관유형</th>
                                <th>보관장소</th>
                                <th>보관장소별칭</th>
                                <th>보관번호</th>
                                <th>보관상품명</th>
                                <th>보관상품 규격</th>
                                <th>유통기한</th>
                                <th>이동개수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moveItems.map((stockItem, index) => (
                                <tr key={`${stockItem.location_id}-${index}`}>
                                    <td>{stockItem.location_id}</td>
                                    <td>{stockItem.location_code}</td>
                                    <td>{stockItem.location_area === 'FR' ? '매장' : stockItem.location_area === 'BA' ? '창고' : ''}</td>
                                    <td>{stockItem.location_section_name}</td>
                                    <td>{stockItem.location_alias}</td>
                                    <td>{stockItem.stock_id}</td>
                                    <td>{stockItem.product_name}</td>
                                    <td>{stockItem.product_standard}</td>
                                    <td>{stockItem.item_exp}</td>
                                    <td>
                                        <input type='hidden' value={stockItem.item_id} />
                                        <button onClick={() => handleQuantityChange(index, -1, stockItem.item_id)}>-</button>
                                        {stockItem.stock_quantity}
                                        <button onClick={() => handleQuantityChange(index, 1, stockItem.item_id)}>+</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>



                    <button onClick={() => action({ selectedMoveStorageType, selectedMoveLocationAlias, selectedItems })}>이동하기</button>
                </div>
            )}

        </>
    );
};

export default LocationForm;

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//장소이동 action
export async function action({ selectedMoveStorageType, selectedMoveLocationAlias, selectedItems }) {
    console.log("MoveItem.action");
    console.log(` "유형 ${selectedMoveStorageType} 소분류 ${selectedMoveLocationAlias}아아템  ${selectedItems}`);


    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    console.log("token:", token);
    console.log("branch_id:", branch_id);
    const location_area = `${selectedMoveStorageType}`;
    const location_alias = `${selectedMoveLocationAlias}`;
    const item_list = selectedItems.map(item => ({ item_id: item.item_id, stock_quantity: item.stock_quantity }));
    const jsonDataArray = {
        branch_id: branch_id,
        location_area: location_area,
        location_alias: location_alias,
        item_list: item_list,
    };

    console.log("jsonDataArray>>", jsonDataArray);
    console.log("jsonDataToString", JSON.stringify(jsonDataArray));
    let resData = '';
    try {
        const response = await axios({
            method: "put",
            url: 'http://localhost:8000/api/v1/stock/location/move/',
            headers: {
                'Content-Type': 'application/json',
                'jwtauthtoken': token,
            },
            params: {
                branch_id: branch_id
            },
            data: JSON.stringify(jsonDataArray),
        });

        console.log("response>>>>>>", response);
        resData = response.data;

    } catch (error) {
        console.log("error:", error);
        throw new Error("error 발생되었습니다");
    }

    return redirect('/');
}

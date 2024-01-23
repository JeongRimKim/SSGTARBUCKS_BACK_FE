import { useState, useEffect } from "react";
import axios from "axios";
import { getAuthToken } from '../util/auth';



const LocationForm = ({ selectedItems, stockList }) => {
    const [MoveItemsModal, setMoveItemsModal] = useState(true);
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
                            <option>다용도랙</option>
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
    const item_list = selectedItems.map(item => item.item_id);

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
}
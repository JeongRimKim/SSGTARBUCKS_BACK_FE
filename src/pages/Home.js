import React, { useState, useEffect } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { getAuthToken } from '../util/auth';

import axios from 'axios';


//지점-메인
const BranchMainRenderer = ({ onSelectDate, onLoadData }) => {

    //console.log("BranchMainRenderer.onLoadData>>>>>>>>>>>>>>>" ,  onLoadData);
    onLoadData = useLoaderData();
    const {expDataList, remainDataList } = onLoadData;
    const [ expData, setExpData ] = useState(expDataList);
    const [ remainData, setRemainData]= useState(remainDataList);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const resultMap = expData.map((item, index) => ({
            product_name: item.product_name,
            product_standard: item.product_standard,
            product_unit: item.product_unit,
            product_spec: item.product_spec,
            category_name: item.category_name,
            item_id: item.tem_id,
            item_exp: item.item_exp,
            item_status: item.item_status,
            location_code: item.location_code,
            location_area: item.location_area,
            location_section: item.location_section,
            location_section_name: item.location_section_name,
            location_alias: item.location_alias,
            stock_quantity: item.stock_quantity
        }));
    }, [expData]); 

    const handleDateChange = (daysToAdd) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + daysToAdd);
        setSelectedDate(newDate);
        onSelectDate(newDate);
    };

    const handleRetrieve = async () => {
        try {
            onSelectDate(selectedDate);
            console.log(selectedDate);

            const token = getAuthToken();
            const branch_id = localStorage.getItem("branch_id");

            const response = await axios({
                method: "GET",
                url: `http://localhost:8000/api/v1/branch/main/exp`,
                headers: {
                    'Content-Type': 'application/json',
                    'jwtauthtoken': token
                },
                params: {
                    branch_id: branch_id,
                    curDate: selectedDate
                }
            });

            console.log("select exp date :", response.data);

            setExpData(response.data); // expDataList 업데이트
        } catch (error) {
            console.error('Error selecting exp date:', error);
        }
    };



    return (
        <>  <h3>  유통기한 만료 상품 조회</h3>
             기준일 : <span>{selectedDate.toISOString().split('T')[0]}</span>
            <button onClick={() => handleDateChange(-1)}>전날</button>
            <button onClick={handleRetrieve}>조회</button>
            <button onClick={() => handleDateChange(1)}>다음날</button>
           

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
                    {expData.map((totalItem, index) => (
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

            <hr/><h3>발주 추천 상품</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>상품고유번호</th>
                        <th>상품명</th>
                        <th>규격</th>
                        <th>단위</th>
                        <th>수량</th>
                    </tr>
                </thead>
                <tbody>
                    {remainData.map((remainItem, index) => (
                        <tr key={`${remainItem.product_id}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{remainItem.product_code}</td>
                            <td>{remainItem.product_name}</td>
                            <td>{remainItem.product_standard}</td>
                            <td>{remainItem.product_unit}</td>
                            <td>{remainItem.total_product_quantity}</td>
                        </tr>
                    ))}

                </tbody>
            </table>

        </>
    );
};



//관리자-메인
const AdminMainRenderer = ({ onSelectDate }) => {


};

export default function HomePage() {

    const loaderDataHome = useLoaderData(); 
    //console.log("loaderDataHome>>>>>>>>", loaderDataHome);

    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");

    const handleSelectExpDateList = (newDate) => {
        console.log("Selected date:", newDate.toISOString().split('T')[0]);
    };

    return (
        <>
            <h1>지점 메인 페이지</h1>
            {branch_id && branch_id.startsWith('b') ? <BranchMainRenderer onLoadData={loaderDataHome} onSelectDate={handleSelectExpDateList} /> : <AdminMainRenderer />}
        </>
    );
}





//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
// axios 버전
export async function loader({ request }) {
    //console.log("HomePage,loader>>>>>>>>>>>>.", request)
    const token = getAuthToken();
    const branch_id = localStorage.getItem("branch_id");
    //console.log("token:", token);
    //console.log("branch_id:", branch_id);

    const expResponse = await axios({
        method: "GET",
        url: "http://localhost:8000/api/v1/branch/main/exp",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
            , curDate: null
        }
    });

    //console.log("HomePage.expResponse >>>>>>>>>>>..", expResponse);

    if (expResponse.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }


    const remainResponse = await axios({
        method: "GET",
        url: "http://localhost:8000/api/v1/branch/main/remain",
        headers: {
            'Content-Type': 'application/json',
            'jwtauthtoken': token
        },
        params: {
            branch_id: branch_id
            , curDate: null
        }
    });

    //console.log("HomePage.remainResponse >>>>>>>>>>>..", remainResponse);

    if (expResponse.status !== 200) {
        throw json({ message: 'Could not save event.' }, { status: 500 });
    }

    const expDataList = expResponse.data;
    const remainDataList = remainResponse.data;
    return { expDataList, remainDataList };
}

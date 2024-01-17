import { useState } from 'react';
import { Form, useNavigation } from 'react-router-dom';

function RegisterLocationForm() {

  const [rows, setRows] = useState([{ location_area: '', location_section_name: '', location_column: '', location_row: '', location_alias: '' }]);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'registering...';

  const handleInputChange = (index, name, value) => {
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const addRow = (event) => {
    event.preventDefault();
    setRows([...rows, { location_area: '', location_section_name: '', location_column: '', location_row: '', location_alias: '' }]);
  };

 
  const deleteRow = (event) => {
    event.preventDefault(); // 폼 전송 방지
    if (rows.length > 1) {
      const newRows = [...rows];
      newRows.pop(); // Remove the last row
      setRows(newRows);
    }
  };

  const handleRegisterLocation = (event) => {
   

    console.log('유효성 검사');
    for (const row of rows) {
      if (!row.location_area || !row.location_section_name) {
        console.warn('필수 정보를 입력하세요.');
        event.preventDefault(); // 폼 전송 방지
        return;
      }

      if (!/^[가-힣]+$/.test(row.location_area) || !/^[가-힣]+$/.test(row.location_section_name) || !/^[0-9]+$/.test(row.location_column) || !/^[0-9]+$/.test(row.location_row)) {
        console.warn('입력 형식이 올바르지 않습니다.');
        event.preventDefault(); // 폼 전송 방지
        return;
      }
    }


  
    
    const locations = rows.map(row => {
      return {
        location_area: row.location_area,
        location_section_name: row.location_section_name,
        location_column: row.location_column,
        location_row: row.location_row,
        location_alias: row.location_alias,
      };
    });

    console.log("입력 사항 완료: ", locations);
  };

  return (
    <>
      <Form method="post">
        <h1>보관장소 등록</h1>
        <table style={{ width: '200px' }}>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input name="location_area" type="text" value={row.location_area} onChange={(e) => handleInputChange(index, 'location_area', e.target.value)} placeholder="보관유형(위치)" />
                </td>
                <td>
                  <input name="location_section_name" type="text" value={row.location_section_name} onChange={(e) => handleInputChange(index, 'location_section_name', e.target.value)} placeholder="보관장소(구역)" />
                </td>
                <td>
                  <input name="location_column" type="text" value={row.location_column} onChange={(e) => handleInputChange(index, 'location_column', e.target.value)} placeholder="세로열" />
                </td>
                <td>
                  <input name="location_row" type="text" value={row.location_row} onChange={(e) => handleInputChange(index, 'location_row', e.target.value)} placeholder="가로행" />
                </td>
                <td>
                  <input name="location_alias" type="text" value={row.location_alias} onChange={(e) => handleInputChange(index, 'location_alias', e.target.value)} placeholder="구역명칭" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow}>행 추가</button>
        <button onClick={deleteRow}>행 삭제</button>
        <button onClick={handleRegisterLocation} disabled={isSubmitting}>
          {isSubmitting ? '전송중...' : '등록하기'}
        </button>
      </Form>
    </>
  );
}

export default RegisterLocationForm;
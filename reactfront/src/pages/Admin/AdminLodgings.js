import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './AdminLodgings.css';
import AdminSettingList from '../../components/AdminSettingList';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import { Button4 } from '../../components/Button.style';

// AdminLodgings Component
export default function AdminLodgings() {
  const navigate = useNavigate();
  const location = useLocation();
  const gridRef = useRef(null); // 그리드 참조 객체
  const [isAuthorized, setIsAuthorized] = useState(false); // 사용자 권한 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [rowData, setRowData] = useState([]); // 숙소 데이터 배열
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태

  const lodgingIDFilter = location.state?.lodgingID || '';

  // 저장 버튼 클릭 시 호출되는 함수
  const onSave = useCallback(
    async (params) => {
      const rowData = params.data; // 현재 행의 데이터 가져오기

      // 이미 저장 중이면 함수 종료
      if (isSaving) {
        return;
      }

      setIsSaving(true); // 저장 중 상태 설정

      try {
        const response = await fetch(
          `http://localhost:3000/api/admin/lodgings/${rowData.lodging_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
            },
            body: JSON.stringify({
              name: rowData.name, // 수정할 숙소 이름
              part: rowData.part, // 수정할 파트
              area: rowData.area, // 수정할 지역
              sigungu: rowData.sigungu, // 수정할 시군구
              address: rowData.address, // 수정할 주소
              rating: rowData.rating, // 수정할 평점
              tel: rowData.tel, // 수정할 전화번호
              main_image: rowData.main_image, // 수정할 메인 이미지
            }),
          },
        );

        if (!response.ok) {
          // 응답 상태에 따라 다른 오류 메시지 출력
          if (response.status === 400) {
            throw new Error('잘못된 요청입니다. 입력 데이터를 확인해주세요.');
          } else if (response.status === 401) {
            throw new Error('권한이 없습니다. 다시 로그인해주세요.');
          } else if (response.status === 404) {
            throw new Error('숙소를 찾을 수 없습니다.');
          } else {
            throw new Error('숙소 정보를 업데이트하는 중 오류가 발생했습니다.');
          }
        }

        const updatedLodging = await response.json(); // 업데이트된 숙소 정보 가져오기
        console.log('업데이트된 숙소:', updatedLodging); // 업데이트된 숙소 정보 출력
        alert('숙소 정보가 성공적으로 업데이트되었습니다.'); // 성공 메시지 출력
      } catch (error) {
        console.error('숙소 정보를 업데이트하는 중 오류가 발생했습니다.', error); // 오류 메시지 출력
        alert(`오류: ${error.message}`); // 오류 메시지 알림
      } finally {
        setIsSaving(false); // 저장 중 상태 해제
      }
    },
    [isSaving],
  );

  // 컬럼 정의 상수
  const colDefs = useMemo(
    () => [
      { headerName: 'ID', field: 'lodging_id', flex: 0.5 },
      {
        headerName: '숙소 이름',
        headerTooltip: '필수 항목',
        field: 'name',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 1.5,
      },
      {
        headerName: '파트',
        headerTooltip: '필수 항목',
        field: 'part',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [
            '한옥',
            '관광호텔',
            '펜션',
            '모텔',
            '게스트하우스',
            '관광단지',
            '민박',
            '콘도미니엄',
            '서비스드레지던스',
            '홈스테이',
            '야영장',
          ],
        },
      },
      {
        headerName: '지역',
        headerTooltip: '필수 항목',
        field: 'area',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 1,
      },
      {
        headerName: '시군구',
        field: 'sigungu',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 1,
      },
      {
        headerName: '주소',
        headerTooltip: '필수 항목',
        field: 'address',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 2,
      },
      {
        headerName: '평점',
        field: 'rating',
        editable: false, // 평점은 읽기 전용이므로 편집 불가능
        flex: 0.8,
      },
      {
        headerName: '전화번호',
        field: 'tel',
        filter: 'agTextColumnFilter',
        editable: true,
        flex: 1.5,
      },
      {
        headerName: '메인 이미지',
        field: 'main_image',
        flex: 2,
      },
      {
        headerName: '생성일',
        field: 'created_at',
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
        flex: 2,
      },
      {
        headerName: '수정일',
        field: 'updated_at',
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
        flex: 2,
      },
      {
        headerName: 'Action',
        width: 100,
        cellRenderer: (params) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: '1em',
            }}
          >
            <button
              className="actions-icon"
              style={{
                cursor: isSaving ? 'not-allowed' : 'pointer',
              }}
              onClick={() => !isSaving && onSave(params)}
              disabled={isSaving}
            >
              {isSaving ? (
                <CircularProgress size={20} style={{ color: 'white' }} />
              ) : (
                <span className="material-symbols-outlined" style={{ color: 'white' }}>
                  save
                </span>
              )}
            </button>
            <button
              className="actions-icon"
              onClick={() =>
                navigate(`/admin/rooms`, {
                  state: { lodgingName: params.data.name }, // 상태로 숙소 이름 전달
                })
              }
            >
              <span className="material-symbols-outlined">bed</span>
            </button>
          </div>
        ),
      },
    ],
    [isSaving, onSave, navigate],
  );

  // 필터 옵션 현지화 문자열 설정
  const filtercontext = useMemo(
    () => ({
      equals: '같음',
      notEqual: '같지 않음',
      lessThan: '이전',
      greaterThan: '초과',
      lessThanOrEqual: '이하',
      greaterThanOrEqual: '이상',
      inRange: '범위 내',
      contains: '포함',
      notContains: '포함하지 않음',
      startsWith: '시작 문자',
      endsWith: '끝 문자',
      filterOoo: '필터...',
      applyFilter: '필터 적용',
      resetFilter: '필터 초기화',
      andCondition: '그리고',
      orCondition: '또는',
      blank: '없음',
      notBlank: '있음',
    }),
    [],
  );

  // 컴포넌트가 마운트될 때 사용자 권한을 확인하는 함수
  useEffect(() => {
    const userPermission = sessionStorage.getItem('userPermission'); // 세션에서 사용자 권한 가져오기
    if (userPermission !== '관리자') {
      // 관리자가 아니면 접근을 제한하고 메인 페이지로 이동
      alert('해당 권한이 없습니다.');
      navigate('/');
    } else {
      setIsAuthorized(true); // 권한 부여
    }
    setIsLoading(false); // 로딩 완료
  }, [navigate]);

  // 권한이 있는 경우 숙소 데이터를 가져오는 함수
  useEffect(() => {
    if (isAuthorized) {
      const fetchLodgings = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/admin/lodgings', {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
            },
          });
          if (!response.ok) {
            throw new Error('데이터를 가져오는 중 오류가 발생했습니다.');
          }
          const data = await response.json();
          setRowData(data.lodgings); // 숙소 데이터 설정
        } catch (error) {
          console.error('데이터를 가져오는 중 오류가 발생했습니다.', error); // 오류 메시지 출력
        }
      };
      fetchLodgings(); // 숙소 데이터 가져오기 함수 호출
    }
  }, [isAuthorized]);

  // 필터 텍스트 박스의 값이 변경되었을 때 호출되는 함수
  const onFilterTextBoxChanged = useCallback(() => {
    // 필터 입력값을 그리드에 적용
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value,
    );
  }, []);

  useEffect(() => {
    const filterTextBox = document.getElementById('filter-text-box');
    if (lodgingIDFilter && filterTextBox) {
      filterTextBox.value = lodgingIDFilter;
      onFilterTextBoxChanged(); // Apply the filter immediately after setting the value
    }
  }, [lodgingIDFilter, onFilterTextBoxChanged]);

  // 컬럼의 기본 설정 (필터 적용 및 초기화 버튼 포함)
  const defaultColDef = useMemo(
    () => ({
      filterParams: {
        buttons: ['apply', 'reset'], // 필터 적용 및 초기화 버튼 표시
      },
    }),
    [],
  );

  // 그리드가 준비되었을 때 호출되는 함수
  const onGridReady = (params) => {
    gridRef.current.api = params.api; // 그리드 API를 참조 객체에 저장

    if (lodgingIDFilter) {
      // 그리드가 준비되면 필터 텍스트 박스의 값을 설정하고 필터를 적용
      document.getElementById('filter-text-box').value = lodgingIDFilter;
      onFilterTextBoxChanged(); // 필터 적용
    }
  };

  // 행 선택
  const rowSelection = useMemo(() => {
    return {
      mode: 'multiRow', // 여러 행 선택
      groupSelects: 'descendants',
    };
  }, []);

  const rowStyle = { color: 'rgba(0,0,0,0.6)' }; // 행 스타일 설정 (텍스트 색상 지정)

  // 선택된 행을 제거하는 함수
  const onRemove = useCallback(async () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes(); // 선택된 행 가져오기
    const selectedIDs = selectedNodes.map((node) => node.data.lodging_id); // 선택된 행의 lodging_id 추출
    const numberOfSelectedRows = selectedIDs.length; // 선택된 행의 수 저장

    if (numberOfSelectedRows === 0) {
      alert('삭제할 데이터를 선택해주세요.'); // 선택된 데이터가 없을 경우 알림 메시지
      return;
    }

    try {
      // 서버에서 해당 숙소 삭제 요청
      for (const lodging_id of selectedIDs) {
        const response = await fetch(`http://localhost:3000/api/admin/lodgings/${lodging_id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
          },
        });
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('잘못된 요청입니다. 입력 데이터를 확인해주세요.');
          } else if (response.status === 401) {
            throw new Error('권한이 없습니다. 다시 로그인해주세요.');
          } else if (response.status === 404) {
            throw new Error('숙소를 찾을 수 없습니다.');
          } else {
            throw new Error('숙소 삭제 중 오류가 발생했습니다.');
          }
        }
      }
      // 선택된 행을 제외한 나머지 데이터만 남겨서 업데이트
      const updatedRowData = rowData.filter((data) => !selectedIDs.includes(data.lodging_id));
      setRowData(updatedRowData); // 업데이트된 데이터 설정

      alert(`${numberOfSelectedRows}건의 데이터가 성공적으로 삭제되었습니다.`); // 삭제된 행의 수 알림
    } catch (error) {
      console.error('숙소 삭제 오류:', error); // 오류 메시지 출력
      alert(`오류: ${error.message}`); // 오류 메시지 알림
    }
  }, [rowData]);

  // 로딩 중이거나 권한이 없는 경우 컴포넌트를 렌더링하지 않음
  if (isLoading) {
    return null; // 로딩 중에는 아무것도 렌더링하지 않음
  }

  if (!isAuthorized) {
    return null; // 권한이 없는 경우에도 렌더링하지 않음
  }

  // UI 렌더링
  return (
    <div className="admin">
      <div className="admin-setting-container">
        <AdminSettingList /> {/* 관리자 설정 리스트 컴포넌트 */}
      </div>
      <div className="admin-lodgings">
        <div className="admin-lodgings-table-header">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter.."
            onChange={onFilterTextBoxChanged} // 필터 입력값 변경 시 호출
            defaultValue={lodgingIDFilter} // 필터 초기값 설정
          />
          <Button4 onClick={onRemove}>
            <span className="material-symbols-outlined" style={{ color: 'rgba(255,0,0,0.5)' }}>
              delete
            </span>
          </Button4>
        </div>
        <div className="ag-theme-quartz">
          <AgGridReact
            rowGroupPanelShow="always"
            ref={gridRef} // 그리드 참조 객체
            rowData={rowData} // 숙소 데이터 설정
            columnDefs={colDefs} // 데이터 속성 명, 형태
            rowSelection={rowSelection} // 다중 행 선택 가능
            onGridReady={onGridReady} // 그리드가 준비되었을 때 호출
            rowStyle={rowStyle} // 행 스타일 설정
            pagination={true} // 페이지네이션 사용
            paginationPageSize={20} // 페이지 당 항목 수 설정
            popupParent={document.body} // 필터 팝업의 부모 요소 설정
            domLayout="autoHeight" // 그리드의 높이를 자동으로 조정하여 필터 팝업이 보이도록 함
            localeText={filtercontext} // 현지화 문자열 설정
            defaultColDef={defaultColDef} // 컬럼 기본 설정 적용
          />
        </div>
      </div>
    </div>
  );
}

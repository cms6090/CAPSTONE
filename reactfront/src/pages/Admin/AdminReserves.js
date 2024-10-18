import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './AdminUsers.css';
import AdminSettingList from '../../components/AdminSettingList';
import dayjs from 'dayjs';
import { CircularProgress } from '@mui/material';
import { Button4 } from '../../components/Button.style';

// AdminUsers 컴포넌트
export default function AdminUsers() {
  const navigate = useNavigate();
  const gridRef = useRef(null); // 그리드 참조 객체
  const [isAuthorized, setIsAuthorized] = useState(false); // 사용자 권한 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [rowData, setRowData] = useState([]); // 사용자 데이터 배열
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태

  // 저장 버튼 클릭 시 호출되는 함수
  const onSave = useCallback(
    async (params) => {
      const rowData = params.data;

      if (isSaving) {
        return; // 이미 저장 중이면 중복 저장 방지
      }

      setIsSaving(true); // 저장 상태로 변경

      try {
        console.log('Saving reservation data:', rowData);
        const response = await fetch(
          `http://localhost:3000/api/admin/reservations/${rowData.reservation_id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
              check_in_date: dayjs(rowData.check_in_date).add(9, 'hour').toISOString(), // 체크인 날짜 ISO 포맷으로 변환
              check_out_date: dayjs(rowData.check_out_date).add(9, 'hour').toISOString(), // 체크아웃 날짜 ISO 포맷으로 변환
              total_price: rowData.total_price,
              status: rowData.status,
              user_id: rowData.user_id,
            }),
          },
        );

        if (!response.ok) {
          // 응답이 실패한 경우 오류 메시지 처리
          let errorMessage = '예약 정보를 업데이트하는 중 오류가 발생했습니다.';
          if (response.status === 400) {
            errorMessage = '잘못된 요청입니다. 입력 데이터를 확인해주세요.';
          } else if (response.status === 401) {
            errorMessage = '권한이 없습니다. 다시 로그인해주세요.';
          } else if (response.status === 404) {
            errorMessage = '예약 정보를 찾을 수 없습니다.';
          }
          throw new Error(errorMessage);
        }

        const updatedReservation = await response.json();
        console.log('Updated reservation:', updatedReservation);
        alert('예약 정보가 성공적으로 업데이트되었습니다.');
      } catch (error) {
        console.error('예약 정보 업데이트 중 오류 발생:', error);
        alert(`오류: ${error.message}`);
      } finally {
        setIsSaving(false); // 저장 상태 해제
      }
    },
    [isSaving],
  );

  // 날짜 필터 파라미터 정의
  const filterParams = useMemo(
    () => ({
      comparator: (filterLocalDateAtMidnight, cellValue) => {
        if (!cellValue) return -1;
        const cellDate = dayjs(cellValue, 'YYYY-MM-DD').toDate();
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
        return 0;
      },
    }),
    [],
  );

  // 컬럼 정의 상수
  const colDefs = useMemo(
    () => [
      { headerName: 'ID', field: 'reservation_id', flex: 0.7 },
      { headerName: '사용자 이메일', field: 'user_email', flex: 1.5 },
      { headerName: '숙소 이름', field: 'rooms.lodgings.name', flex: 1.5},
      { headerName: '객실 이름', field: 'rooms.room_name', flex: 1 },
      {
        headerName: '체크인 날짜',
        field: 'check_in_date',
        editable: true,
        flex: 1,
        filter: 'agDateColumnFilter',
        filterParams: filterParams, // 날짜 필터 파라미터 적용
        cellEditor: 'agDateStringCellEditor',
        valueGetter: (params) =>
          dayjs(params.data.check_in_date).isValid()
            ? dayjs(params.data.check_in_date).format('YYYY-MM-DD')
            : '', // 날짜 포맷 적용
      },
      {
        headerName: '체크아웃 날짜',
        field: 'check_out_date',
        editable: true,
        flex: 1,
        filter: 'agDateColumnFilter',
        filterParams: filterParams, // 날짜 필터 파라미터 적용
        cellEditor: 'agDateStringCellEditor',
        valueGetter: (params) =>
          dayjs(params.data.check_out_date).isValid()
            ? dayjs(params.data.check_out_date).format('YYYY-MM-DD')
            : '', // 날짜 포맷 적용
      },
      {
        headerName: '인원 수',
        field: 'person_num',
        filter: 'agNumberColumnFilter',
        editable: true,
        flex: 0.8,
      },
      {
        headerName: '총 가격',
        field: 'total_price',
        filter: 'agNumberColumnFilter',
        flex: 1,
        valueFormatter: (params) => Number(params.value).toLocaleString(), // 천 단위로 쉼표 추가
      },
      {
        headerName: '상태',
        field: 'status',
        editable: true,
        flex: 1,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['confirmed', 'canceled'] },
      },
      {
        headerName: '생성일',
        field: 'created_at',
        filter: 'agDateColumnFilter',
        filterParams: filterParams, // 날짜 필터 파라미터 적용
        valueGetter: (params) =>
          dayjs(params.data.created_at).isValid()
            ? dayjs(params.data.created_at).format('YYYY-MM-DD')
            : '', // 날짜 포맷 적용
        flex: 1,
      },
      {
        headerName: '수정일',
        field: 'updated_at',
        filter: 'agDateColumnFilter',
        filterParams: filterParams, // 날짜 필터 파라미터 적용
        valueGetter: (params) =>
          dayjs(params.data.updated_at).isValid()
            ? dayjs(params.data.updated_at).format('YYYY-MM-DD')
            : '', // 날짜 포맷 적용
        flex: 1,
      },
      {
        headerName: 'Actions',
        flex: 1.2,
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
              style={{ cursor: isSaving ? 'not-allowed' : 'pointer' }}
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
                  state: { lodgingName:  params.data.rooms.lodgings.name + " " + params.data.rooms.room_name }, // 상태로 숙소 이름 전달
                })
              }
            >
              <span className="material-symbols-outlined">bed</span>
            </button>
            <button
              className="actions-icon"
              onClick={() =>
                navigate(`/admin/users`, {
                  state: { user_email: params.data.user_email }, // 상태로 사용자 메일 전달
                })
              }
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        ),
      },
    ],
    [isSaving, onSave, navigate, filterParams],
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

  // 권한이 있는 경우 예약 데이터를 가져오는 함수
  useEffect(() => {
    if (isAuthorized) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/admin/reservations', {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
            },
          });
          if (!response.ok) {
            throw new Error('데이터를 가져오는 중 오류가 발생했습니다.');
          }
          const data = await response.json();
          setRowData(data); // 예약 데이터 설정
          console.log(data);
        } catch (error) {
          console.error('데이터를 가져오는 중 오류가 발생했습니다.', error); // 오류 메시지 출력
        }
      };
      fetchUsers(); // 사용자 데이터 가져오기 함수 호출
    }
  }, [isAuthorized]);

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
  };

  // 필터 텍스트 박스의 값이 변경되었을 때 호출되는 함수
  const onFilterTextBoxChanged = useCallback(() => {
    // 필터 입력값을 그리드에 적용
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value,
    );
  }, []);

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
    const selectedIDs = selectedNodes.map((node) => node.data.reservation_id); // 선택된 행의 ID 추출
    const numberOfSelectedRows = selectedIDs.length; // 선택된 행의 수 저장

    if (numberOfSelectedRows === 0) {
      alert('삭제할 데이터를 선택해주세요.'); // 선택된 데이터가 없을 경우 알림 메시지
      return;
    }

    try {
      // 서버에서 해당 사용자 삭제 요청
      for (const reservation_id of selectedIDs) {
        const response = await fetch(
          `http://localhost:3000/api/admin/reservations/${reservation_id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
            },
          },
        );
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error('잘못된 요청입니다. 입력 데이터를 확인해주세요.');
          } else if (response.status === 401) {
            throw new Error('권한이 없습니다. 다시 로그인해주세요.');
          } else if (response.status === 404) {
            throw new Error('사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('사용자 삭제 중 오류가 발생했습니다.');
          }
        }
      }
      // 선택된 행을 제외한 나머지 데이터만 남겨서 업데이트
      const updatedRowData = rowData.filter((data) => !selectedIDs.includes(data.reservation_id));
      setRowData(updatedRowData); // 업데이트된 데이터 설정

      alert(`${numberOfSelectedRows}건의 데이터가 성공적으로 삭제되었습니다.`); // 삭제된 행의 수 알림
    } catch (error) {
      console.error('예약 삭제 오류:', error); // 오류 메시지 출력
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
      <div className="admin-users">
        <div className="admin-users-table-header">
          <input
            type="text"
            id="filter-text-box"
            placeholder="Filter.."
            onChange={onFilterTextBoxChanged} // 필터 입력값 변경 시 호출
          />
          <Button4 onClick={onRemove}>
            <span className="material-symbols-outlined" style={{ color: 'rgba(255,0,0,0.5)' }}>
              delete
            </span>
          </Button4>
          {/* 선택된 행 제거 */}
        </div>
        <div className="ag-theme-quartz">
          <AgGridReact
            rowGroupPanelShow="always"
            ref={gridRef} // 그리드 참조 객체
            rowData={rowData} // 예약 데이터 설정
            columnDefs={colDefs} // 데이터 속성 명, 형태
            rowSelection={rowSelection} // 다중 행 선택 가능
            onGridReady={onGridReady} // 그리드가 준비되었을 때 호출
            pagination={true} // 페이지네이션 사용
            paginationPageSize={20} // 페이지 당 항목 수 설정
            popupParent={document.body} // 필터 팝업의 부모 요소 설정
            rowStyle={rowStyle} // 행 스타일 설정
            domLayout="autoHeight" // 그리드의 높이를 자동으로 조정하여 필터 팝업이 보이도록 함
            localeText={filtercontext} // 현지화 문자열 설정
            defaultColDef={defaultColDef} // 컬럼 기본 설정 적용
          />
        </div>
      </div>
    </div>
  );
}

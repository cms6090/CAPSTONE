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
      const rowData = params.data; // 현재 행의 데이터 가져오기
      console.log('저장된 데이터:', rowData); // 저장된 데이터 출력

      // 이미 저장 중이면 함수 종료
      if (isSaving) {
        return;
      }

      setIsSaving(true); // 저장 중 상태 설정

      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${rowData.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
          },
          body: JSON.stringify({
            user_name: rowData.user_name, // 수정할 사용자 이름
            phone_number: rowData.phone_number, // 수정할 전화번호
            gender: rowData.gender, // 수정할 성별
            birth: rowData.birth, // 수정할 생년월일
            permission: rowData.permission, // 수정할 권한
          }),
        });

        if (!response.ok) {
          // 응답 상태에 따라 다른 오류 메시지 출력
          if (response.status === 400) {
            throw new Error('잘못된 요청입니다. 입력 데이터를 확인해주세요.');
          } else if (response.status === 401) {
            throw new Error('권한이 없습니다. 다시 로그인해주세요.');
          } else if (response.status === 404) {
            throw new Error('사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.');
          }
        }

        const updatedUser = await response.json(); // 업데이트된 사용자 정보 가져오기
        console.log('업데이트된 사용자:', updatedUser); // 업데이트된 사용자 정보 출력
        alert('사용자 정보가 성공적으로 업데이트되었습니다.'); // 성공 메시지 출력
      } catch (error) {
        console.error('사용자 정보를 업데이트하는 중 오류가 발생했습니다.', error); // 오류 메시지 출력
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
      { headerName: 'ID', field: 'user_id', flex: 0.7 },
      {
        headerName: '이름',
        field: 'user_name',
        filter: 'agTextColumnFilter',
        editable: true,
        headerTooltip: '필수 항목',
        flex: 1,
      },
      { headerName: '이메일', field: 'email', filter: 'agTextColumnFilter', flex: 2.5 },
      {
        headerName: '전화번호',
        field: 'phone_number',
        filter: 'agTextColumnFilter',
        editable: true,
        headerTooltip: '필수 항목',
        flex: 1.7,
      },
      {
        headerName: '생년월일',
        field: 'birth',
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'),
        flex: 1.5,
        cellEditor: 'agDateInput',
      },
      {
        headerName: '성별',
        field: 'gender',
        editable: true,
        flex: 1,
        filter: 'agTextColumnFilter',
        cellEditor: 'agSelectCellEditor',
        headerTooltip: '필수 항목',
        cellEditorParams: { values: ['남성', '여성'] },
      },
      {
        headerName: '권한',
        field: 'permission',
        editable: true,
        headerTooltip: '필수 항목',
        flex: 1,
        filter: 'agTextColumnFilter',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: ['관리자', '유저'] },
      },
      {
        headerName: '생성일',
        field: 'created_at',
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
        flex: 2.3,
      },
      {
        headerName: '수정일',
        field: 'updated_at',
        valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'),
        flex: 2.3,
      },
      {
        headerName: 'Actions',
        flex: 0.8,
        cellRenderer: (params) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
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
          </div>
        ),
      },
    ],
    [isSaving, onSave],
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

  // 권한이 있는 경우 사용자 데이터를 가져오는 함수
  useEffect(() => {
    if (isAuthorized) {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`, // 인증 토큰 사용
            },
          });
          if (!response.ok) {
            throw new Error('데이터를 가져오는 중 오류가 발생했습니다.');
          }
          const data = await response.json();
          setRowData(data); // 사용자 데이터 설정
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
    const selectedIDs = selectedNodes.map((node) => node.data.user_id); // 선택된 행의 ID 추출
    const numberOfSelectedRows = selectedIDs.length; // 선택된 행의 수 저장

    if (numberOfSelectedRows === 0) {
      alert('삭제할 데이터를 선택해주세요.'); // 선택된 데이터가 없을 경우 알림 메시지
      return;
    }

    try {
      // 서버에서 해당 사용자 삭제 요청
      for (const user_id of selectedIDs) {
        const response = await fetch(`http://localhost:3000/api/admin/users/${user_id}`, {
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
            throw new Error('사용자를 찾을 수 없습니다.');
          } else {
            throw new Error('사용자 삭제 중 오류가 발생했습니다.');
          }
        }
      }
      // 선택된 행을 제외한 나머지 데이터만 남겨서 업데이트
      const updatedRowData = rowData.filter((data) => !selectedIDs.includes(data.user_id));
      setRowData(updatedRowData); // 업데이트된 데이터 설정

      alert(`${numberOfSelectedRows}건의 데이터가 성공적으로 삭제되었습니다.`); // 삭제된 행의 수 알림
    } catch (error) {
      console.error('사용자 삭제 오류:', error); // 오류 메시지 출력
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
            rowData={rowData} // 사용자 데이터 설정
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

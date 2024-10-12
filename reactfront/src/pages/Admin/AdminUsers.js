import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './AdminUsers.css';
import AdminSettingList from '../../components/AdminSettingList';
import dayjs from 'dayjs';

// AdminUsers 컴포넌트
export default function AdminUsers() {
  const navigate = useNavigate();
  const gridRef = useRef(null); // 그리드 참조 객체
  const [isAuthorized, setIsAuthorized] = useState(false); // 사용자 권한 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [rowData, setRowData] = useState([]); // 사용자 데이터 배열
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 정보
  const [searchText, setSearchText] = useState(''); // 검색 텍스트

  // 컴포넌트가 마운트될 때 권한을 확인
  useEffect(() => {
    const userPermission = sessionStorage.getItem('userPermission');
    if (userPermission !== '관리자') {
      // 관리자가 아니면 접근을 제한하고 메인 페이지로 이동
      alert('해당 권한이 없습니다.');
      navigate('/');
    } else {
      setIsAuthorized(true); // 권한 부여
    }
    setIsLoading(false); // 로딩 완료
  }, [navigate]);

  // 권한이 있는 경우 사용자 데이터를 가져오는 로직
  useEffect(() => {
    if (isAuthorized) {
      // 비동기 함수로 사용자 데이터를 가져옴
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
        } catch (error) {
          console.error('데이터를 가져오는 중 오류가 발생했습니다.', error);
        }
      };
      fetchUsers(); // 사용자 데이터를 가져옴
    }
  }, [isAuthorized]);

  // 그리드가 준비되었을 때 호출되는 함수
  const onGridReady = (params) => {
    gridRef.current.api = params.api; // 그리드 API 설정
  };

  // 그리드에서 행이 선택되었을 때 호출되는 함수
  const onSelectionChanged = () => {
    const selectedNode = gridRef.current.api.getSelectedNodes()[0]; // 선택된 노드 가져오기
    if (selectedNode) {
      const user = selectedNode.data;
      setSelectedUser({
        ...user,
        birth: dayjs(user.birth), // 생일 정보를 dayjs 형식으로 변환
      });
    }
  };

  // 필터 텍스트 박스의 값이 변경되었을 때 호출되는 함수
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value,
    );
  }, []);

  const rowSelection = useMemo(() => {
    return {
      mode: 'multiRow',
      groupSelects: 'descendants',
    };
  }, []);

  const rowStyle = { color: 'rgba(0,0,0,0.6)', fontFamily:'pretendard-extralight' };

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
        <input
          type="text"
          id="filter-text-box"
          placeholder="Filter.."
          onChange={onFilterTextBoxChanged} // 필터 입력값 변경 시 호출
        />
        <div className="ag-theme-quartz">
          <AgGridReact
            ref={gridRef} // 그리드 참조 객체
            rowData={rowData} // 사용자 데이터 설정
            columnDefs={[
              { headerName: 'ID', field: 'user_id', width: 50 },
              {
                headerName: '이름',
                field: 'user_name',
                filter: 'agTextColumnFilter', // 텍스트 필터 적용
                editable: true,
                width: 90,
              },
              {
                headerName: '이메일',
                field: 'email',
                filter: 'agTextColumnFilter',
                width: 230,
              },
              {
                headerName: '전화번호',
                field: 'phone_number',
                filter: 'agTextColumnFilter',
                editable: true,
                width: 140,
              },
              {
                headerName: '생년월일',
                field: 'birth',
                valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD'), // 날짜 형식 설정
                editable: true,
                width: 140,
                cellEditor: 'agDateInput',
              },
              {
                headerName: '성별',
                field: 'gender',
                editable: true,
                width: 100,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: { values: ['남성', '여성'] }, // 선택 가능한 값 설정
              },
              {
                headerName: '권한',
                field: 'permission',
                editable: true,
                width: 100,
                cellEditor: 'agSelectCellEditor',
                cellEditorParams: { values: ['관리자', '유저'] }, // 선택 가능한 권한 값 설정
              },
              {
                headerName: '생성일',
                field: 'created_at',
                valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'), // 생성일 형식 설정
                width: 180,
              },
              {
                headerName: '수정일',
                field: 'updated_at',
                valueFormatter: (params) => dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'), // 수정일 형식 설정
                width: 180,
              },
            ]}
            rowSelection={rowSelection} // 다중 행 선택 가능
            onGridReady={onGridReady} // 그리드가 준비되었을 때 호출
            onSelectionChanged={onSelectionChanged} // 행 선택이 변경되었을 때 호출
            pagination={true} // 페이지네이션 사용
            paginationPageSize={20} // 페이지 당 항목 수 설정
            popupParent={document.body} // 필터 팝업의 부모 요소 설정
            rowStyle={rowStyle}
            domLayout="autoHeight" // 그리드의 높이를 자동으로 조정하여 필터 팝업이 보이도록 함
            localeText={{
              // 필터 옵션에 대한 현지화 문자열 설정
              equals: '같음',
              notEqual: '같지 않음',
              lessThan: '미만',
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
            }}
          />
        </div>
      </div>
    </div>
  );
}

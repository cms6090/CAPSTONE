import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';

// 초기 데이터(행) 정의
const initialRows = [
  {
    id: 129067,
    title: '죽도마을',
    part: '민박',
    area: '전북특별자치도',
    sigungu: '고창군',
    addr: '전북특별자치도 고창군 부안면 봉암리 683',
    tel: '',
    firstimage: '',
    firstimage2: '',
  },
  {
    id: 129068,
    title: '해리마을',
    part: '민박',
    area: '전북특별자치도',
    sigungu: '고창군',
    addr: '전북특별자치도 고창군 해리면 동호리',
    tel: '',
    firstimage: 'http://tong.visitkorea.or.kr/cms/resource/10/3358010_image2_1.JPG',
    firstimage2: 'http://tong.visitkorea.or.kr/cms/resource/10/3358010_image3_1.JPG',
  },
  {
    id: 129104,
    title: '장촌마을',
    part: '민박',
    area: '전라남도',
    sigungu: '여수시',
    addr: '전라남도 여수시 삼산면 서도리',
    tel: '',
    firstimage: '',
    firstimage2: '',
  },
  {
    id: 136039,
    title: '서울올림픽파크텔',
    part: '유스호스텔',
    area: '서울특별시',
    sigungu: '송파구',
    addr: '서울특별시 송파구 올림픽로 448',
    tel: '02-410-2114',
    firstimage: '',
    firstimage2: '',
  },
  {
    id: 136060,
    title: '소노휴 양평',
    part: '',
    area: '경기도',
    sigungu: '양평군',
    addr: '경기도 양평군 개군면 신내길7번길 55',
    tel: '1588-4888',
    firstimage: '',
    firstimage2: '',
  },
];

function EditToolbar(props) {
  const { setRows, existingIDs, onSearch, saveChanges } = props;

  const generateUniqueContentID = (existingIDs) => {
    let newID;
    do {
      newID = Math.floor(100000 + Math.random() * 900000);
    } while (existingIDs.includes(newID));
    return newID;
  };

  const handleClick = () => {
    const newID = generateUniqueContentID(existingIDs);
    setRows((oldRows) => {
      const newRows = [
        ...oldRows,
        {
          id: newID,
          title: '',
          part: '',
          area: '',
          sigungu: '',
          addr: '',
          tel: '',
          firstimage: '',
          firstimage2: '',
          isNew: true,
        },
      ];
      return newRows;
    });
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Record
      </Button>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ fileName: 'customerDataBase', utf8WithBom: true }} />
      <Button color="primary" startIcon={<SaveIcon />} onClick={saveChanges}>
        Save Changes
      </Button>
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarFilterButton />
      <TextField
        variant="outlined"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          marginLeft: 'auto',
          width: '200px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            border: '1px solid primary',
            backgroundColor: 'white',
          },
          '& .MuiOutlinedInput-input': { padding: '10px' },
        }}
      />
    </GridToolbarContainer>
  );
}

export default function CombinedDataGrid() {
  const [rows, setRows] = React.useState(() => {
    const savedRows = localStorage.getItem('rows');
    return savedRows ? JSON.parse(savedRows) : initialRows; // 로컬 스토리지에서 데이터 불러오기
  });
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [searchText, setSearchText] = React.useState('');

  const existingIDs = rows.map((row) => row.id);

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id) => () => {
    setRows((prevRows) => {
      const newRows = prevRows.filter((row) => row.id !== id); // 해당 ID의 행을 삭제
      return newRows;
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows((prevRows) => {
        const newRows = prevRows.filter((row) => row.id !== id); // 새로 추가된 행이면 삭제
        return newRows;
      });
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) => {
      const newRows = prevRows.map((row) => (row.id === newRow.id ? updatedRow : row));
      return newRows;
    });
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleCellEditCommit = (params) => {
    setRowModesModel({ ...rowModesModel, [params.id]: { mode: GridRowModes.Edit } });
  };

  const saveChanges = () => {
    localStorage.setItem('rows', JSON.stringify(rows)); // 모든 변경 사항을 로컬 스토리지에 저장
    alert('Changes saved!'); // 사용자에게 저장 완료 메시지
  };

  const columns = [
    { field: 'id', headerName: 'Content ID', editable: false },
    { field: 'title', headerName: 'Title', width: 180, editable: true },
    { field: 'part', headerName: 'Part', width: 120, editable: true },
    { field: 'area', headerName: 'Area', width: 150, editable: true },
    { field: 'sigungu', headerName: 'Sigungu', width: 150, editable: true },
    { field: 'addr', headerName: 'Address', width: 250, editable: true },
    { field: 'tel', headerName: 'Telephone', width: 120, editable: true },
    { field: 'firstimage', headerName: 'Image 1', width: 120, editable: true },
    { field: 'firstimage2', headerName: 'Image 2', width: 120, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={saveChanges} />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  // 검색 기능
  const filteredRows = rows.filter((row) => {
    return (
      row.title.toLowerCase().includes(searchText.toLowerCase()) ||
      row.part.toLowerCase().includes(searchText.toLowerCase()) ||
      row.area.toLowerCase().includes(searchText.toLowerCase()) ||
      row.sigungu.toLowerCase().includes(searchText.toLowerCase()) ||
      row.addr.toLowerCase().includes(searchText.toLowerCase()) ||
      row.tel.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        onCellEditCommit={handleCellEditCommit}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, existingIDs, onSearch: setSearchText, saveChanges }, // saveChanges를 props로 추가
        }}
      />
    </Box>
  );
}

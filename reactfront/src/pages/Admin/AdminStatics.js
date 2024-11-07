import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AdminSettingList from '../../components/AdminSettingList';
import Statistic from './Statistic';
import MonthReservationsChart from './MonthReservationsChart';
import PopularArea from './PopularArea';
import GenderAge from './GenderAge';
import Top10Lodgings from './Top10Lodgings';
import './AdminStatics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function StatisticsPage() {
  return (
    <div className="admin">
      <div className="admin-setting-container">
        <AdminSettingList /> {/* 관리자 설정 리스트 컴포넌트 */}
      </div>
      <div className="admin-dashboard">
        <div style={{ margin: '1em 0' }}>
          <div style={{ marginBottom: '1em' }}>
            <Statistic />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.5fr',
              gap: '1em',
              marginBottom: '1em',
            }}
          >
            <MonthReservationsChart />
            <PopularArea />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr', gap: '1em' }}>
            <GenderAge />
            <Top10Lodgings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;

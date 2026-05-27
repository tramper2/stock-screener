import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import BreadthChart from '../../components/Charts/BreadthChart';
import BreadthGroupAttribution from '../components/BreadthGroupAttribution';
import { useStaticManifest, fetchStaticJson, resolveStaticMarketEntry } from '../dataClient';
import { useStaticMarket } from '../StaticMarketContext';

const RANGE_DAYS = { '1M': 31, '3M': 90 };

function MetricCard({ label, value }) {
  return (
    <Paper elevation={0} sx={{ p: 1.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" sx={{ fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'text.disabled' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.25, fontFamily: 'monospace', fontWeight: 600 }}>
        {value ?? '-'}
      </Typography>
    </Paper>
  );
}

function StaticBreadthPage() {
  const manifestQuery = useStaticManifest();
  const { selectedMarket } = useStaticMarket();
  const marketEntry = useMemo(
    () => resolveStaticMarketEntry(manifestQuery.data, selectedMarket),
    [manifestQuery.data, selectedMarket],
  );
  const breadthQuery = useQuery({
    queryKey: ['staticBreadth', marketEntry.pages?.breadth?.path],
    queryFn: () => fetchStaticJson(marketEntry.pages.breadth.path),
    enabled: Boolean(marketEntry.pages?.breadth?.path),
    staleTime: Infinity,
  });
  const [timeRange, setTimeRange] = useState('1M');
  const [selectedTab, setSelectedTab] = useState(0);

  const payload = breadthQuery.data?.payload || {};
  const groupAttribution = payload.group_attribution || null;
  const attributionAvailable = Boolean(groupAttribution?.available);
  const displayName = marketEntry.display_name;
  const filteredChartData = useMemo(() => {
    const allData = payload.chart_data || payload.history_90d || [];
    return allData.slice(-(RANGE_DAYS[timeRange] || 31));
  }, [payload.chart_data, payload.history_90d, timeRange]);
  const filteredSpyData = useMemo(() => {
    const allSpy = payload.benchmark_overlay ?? payload.spy_overlay ?? [];
    return allSpy.slice(-(RANGE_DAYS[timeRange] || 31));
  }, [payload.benchmark_overlay, payload.spy_overlay, timeRange]);
  const benchmarkLabel = payload.benchmark_symbol || (marketEntry.market === 'US' ? 'SPY' : 'Benchmark');

  if (manifestQuery.isLoading || breadthQuery.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (manifestQuery.isError || breadthQuery.isError) {
    return <Alert severity="error">시장 심도 데이터를 불러오지 못했습니다.</Alert>;
  }

  if (breadthQuery.data?.available === false) {
    return <Alert severity="info">{breadthQuery.data?.message || '사용 가능한 시장 심도 스냅샷이 없습니다.'}</Alert>;
  }

  const current = payload.current || {};
  const history = payload.history_90d || [];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px', mb: 0.5 }}>
        {displayName} 시장 심도 (Breadth)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '12px' }}>
        시장 심도 스냅샷 발행일시: {breadthQuery.data.published_at || breadthQuery.data.generated_at}
      </Typography>

      <Tabs
        value={selectedTab}
        onChange={(_event, value) => setSelectedTab(value)}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', minHeight: 36 }}
      >
        <Tab label="개요" sx={{ minHeight: 36, fontSize: '12px' }} />
        <Tab
          label="업종별 기여도"
          sx={{ minHeight: 36, fontSize: '12px' }}
          disabled={!attributionAvailable && groupAttribution == null}
        />
      </Tabs>

      {selectedTab === 0 && (
        <>
          <Grid container spacing={1.5} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="일자" value={current.date} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="4% 이상 상승 종목 수" value={current.stocks_up_4pct} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="4% 이상 하락 종목 수" value={current.stocks_down_4pct} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard label="10일 비율 (10-day Ratio)" value={current.ratio_10day?.toFixed?.(2) ?? '-'} />
            </Grid>
          </Grid>

          <BreadthChart
            breadthData={filteredChartData}
            spyData={filteredSpyData}
            benchmarkLabel={benchmarkLabel}
            isLoading={false}
            error={null}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            availableRanges={['1M', '3M']}
          />

          <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
              최근 거래일 추이
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>일자</TableCell>
                    <TableCell align="right">4%+ 상승</TableCell>
                    <TableCell align="right">4%+ 하락</TableCell>
                    <TableCell align="right">5일 비율</TableCell>
                    <TableCell align="right">10일 비율</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.slice(0, 20).map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell align="right">{row.stocks_up_4pct}</TableCell>
                      <TableCell align="right">{row.stocks_down_4pct}</TableCell>
                      <TableCell align="right">{row.ratio_5day?.toFixed?.(2) ?? '-'}</TableCell>
                      <TableCell align="right">{row.ratio_10day?.toFixed?.(2) ?? '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {selectedTab === 1 && <BreadthGroupAttribution attribution={groupAttribution} />}
    </Box>
  );
}

export default StaticBreadthPage;

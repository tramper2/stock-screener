import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useStaticManifest, fetchStaticJson, resolveStaticMarketEntry } from '../dataClient';
import { useStaticChartIndex } from '../chartClient';
import StaticGroupDetailModal from '../StaticGroupDetailModal';
import RankChangeCell from '../../components/shared/RankChangeCell';
import TickerCell from '../../components/common/TickerCell';
import { useStaticMarket } from '../StaticMarketContext';

function MoversCard({ title, rows }) {
  return (
    <Paper elevation={0} sx={{ p: 1.5, height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>업종</TableCell>
              <TableCell align="right">순위</TableCell>
              <TableCell align="right">변동</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rows || []).slice(0, 5).map((row) => (
              <TableRow key={`${title}-${row.industry_group}`}>
                <TableCell>{row.industry_group}</TableCell>
                <TableCell align="right">{row.rank}</TableCell>
                <TableCell align="right">
                  <RankChangeCell value={row.rank_change_1w} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function StaticGroupsPage() {
  const manifestQuery = useStaticManifest();
  const { selectedMarket } = useStaticMarket();
  const marketEntry = useMemo(
    () => resolveStaticMarketEntry(manifestQuery.data, selectedMarket),
    [manifestQuery.data, selectedMarket],
  );
  const groupsQuery = useQuery({
    queryKey: ['staticGroups', marketEntry.pages?.groups?.path],
    queryFn: () => fetchStaticJson(marketEntry.pages.groups.path),
    enabled: Boolean(marketEntry.pages?.groups?.path),
    staleTime: Infinity,
  });
  const chartIndexQuery = useStaticChartIndex(marketEntry.assets?.charts?.path);
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (manifestQuery.isLoading || groupsQuery.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (manifestQuery.isError || groupsQuery.isError) {
    return <Alert severity="error">업종/테마 순위를 불러오지 못했습니다.</Alert>;
  }

  if (!groupsQuery.data?.available) {
    return <Alert severity="info">{groupsQuery.data?.message || '사용 가능한 업종/테마 순위가 없습니다.'}</Alert>;
  }

  const payload = groupsQuery.data.payload || {};
  const rankings = payload.rankings?.rankings || [];
  const movers = payload.movers || {};
  const moversPeriod = payload.movers_period || movers.period || '1w';
  const groupDetails = payload.group_details || {};

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px', mb: 0.5 }}>
        {marketEntry.display_name} 업종/테마 순위 (Group Rankings)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '12px' }}>
        최신 순위 업데이트 일자: {payload.rankings?.date || '-'}
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <MoversCard title={`가장 많이 오른 업종 (${moversPeriod.toUpperCase()})`} rows={movers.gainers} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MoversCard title={`가장 많이 내린 업종 (${moversPeriod.toUpperCase()})`} rows={movers.losers} />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
          현재 업종 순위
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">순위</TableCell>
                <TableCell>업종</TableCell>
                <TableCell align="center">평균 RS</TableCell>
                <TableCell align="center">종목 수</TableCell>
                <TableCell align="right">1주</TableCell>
                <TableCell align="right">1달</TableCell>
                <TableCell align="right">3달</TableCell>
                <TableCell align="right">6달</TableCell>
                <TableCell>주도 종목</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.map((row) => (
                <TableRow
                  key={row.industry_group}
                  hover
                  onClick={() => setSelectedGroup(row.industry_group)}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedGroup(row.industry_group);
                    }
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.rank}</TableCell>
                  <TableCell>{row.industry_group}</TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'monospace' }}>{row.avg_rs_rating?.toFixed?.(1) ?? '-'}</TableCell>
                  <TableCell align="center" sx={{ fontFamily: 'monospace' }}>{row.num_stocks}</TableCell>
                  <TableCell align="right"><RankChangeCell value={row.rank_change_1w} /></TableCell>
                  <TableCell align="right"><RankChangeCell value={row.rank_change_1m} /></TableCell>
                  <TableCell align="right"><RankChangeCell value={row.rank_change_3m} /></TableCell>
                  <TableCell align="right"><RankChangeCell value={row.rank_change_6m} /></TableCell>
                  <TableCell sx={{ fontSize: '12px' }}>
                    <TickerCell symbol={row.top_symbol} companyName={row.top_symbol_name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <StaticGroupDetailModal
        group={selectedGroup}
        detail={selectedGroup ? groupDetails[selectedGroup] : null}
        chartIndex={chartIndexQuery.data}
        open={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </Box>
  );
}

export default StaticGroupsPage;

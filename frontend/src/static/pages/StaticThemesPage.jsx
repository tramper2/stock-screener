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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useStaticManifest, fetchStaticJson } from '../dataClient';

function SummaryMetric({ label, value }) {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  );
}

function StaticThemesPage() {
  const manifestQuery = useStaticManifest();
  const themesIndexQuery = useQuery({
    queryKey: ['staticThemesIndex', manifestQuery.data?.pages?.themes?.path],
    queryFn: () => fetchStaticJson(manifestQuery.data.pages.themes.path),
    enabled: Boolean(manifestQuery.data?.pages?.themes?.path),
    staleTime: Infinity,
  });
  const [pipeline, setPipeline] = useState('technical');
  const [themeView, setThemeView] = useState('grouped');
  const variantKey = `${pipeline}:${themeView}`;
  const variants = themesIndexQuery.data?.variants ?? null;
  const variantMeta = variants?.[variantKey];
  const fallbackVariantKey = useMemo(() => {
    if (variantMeta?.available) {
      return variantKey;
    }

    const variantEntries = variants ? Object.entries(variants) : [];
    const samePipelineVariant = variantEntries.find(
      ([key, meta]) => meta?.available && key.startsWith(`${pipeline}:`)
    );
    if (samePipelineVariant) {
      return samePipelineVariant[0];
    }

    const firstAvailableVariant = variantEntries.find(([_key, meta]) => meta?.available);
    return firstAvailableVariant?.[0] || null;
  }, [pipeline, variantKey, variantMeta?.available, variants]);
  const activeVariantKey = variantMeta?.available ? variantKey : fallbackVariantKey;
  const activeVariantMeta = activeVariantKey ? variants?.[activeVariantKey] : null;
  const activeThemeView = activeVariantKey?.split(':')[1] || themeView;
  const isFallbackActive = Boolean(activeVariantKey && activeVariantKey !== variantKey);
  const variantQuery = useQuery({
    queryKey: ['staticThemesVariant', activeVariantMeta?.path],
    queryFn: () => fetchStaticJson(activeVariantMeta.path),
    enabled: Boolean(activeVariantMeta?.available && activeVariantMeta?.path),
    staleTime: Infinity,
  });

  const rankings = useMemo(() => {
    const payload = variantQuery.data?.payload || {};
    if (activeThemeView === 'grouped') {
      return payload.l1_rankings?.rankings || [];
    }
    return payload.rankings?.rankings || [];
  }, [activeThemeView, variantQuery.data]);

  if (manifestQuery.isLoading || themesIndexQuery.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (manifestQuery.isError || themesIndexQuery.isError) {
    return <Alert severity="error">테마 데이터를 불러오지 못했습니다.</Alert>;
  }

  if (!themesIndexQuery.data?.available) {
    return <Alert severity="info">이 정적 빌드에서는 테마 정보를 사용할 수 없습니다.</Alert>;
  }

  if (!activeVariantMeta?.available) {
    return <Alert severity="warning">이 정적 빌드에서는 테마 뷰 정보를 내보내지 않았습니다.</Alert>;
  }

  if (variantQuery.isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (variantQuery.isError) {
    return <Alert severity="error">선택한 테마 뷰를 불러오지 못했습니다.</Alert>;
  }

  const payload = variantQuery.data?.payload || {};
  const emerging = payload.emerging?.themes || [];
  const fallbackLabel = activeVariantKey
    ? activeVariantKey
        .split(':')
        .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
        .join(' / ')
    : null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        테마 탐색 (Themes)
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        발행일시: {variantQuery.data?.published_at || variantQuery.data?.generated_at}. 정적 사이트에서는 테마 조회만 가능합니다.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <ToggleButtonGroup
          value={pipeline}
          exclusive
          onChange={(_event, value) => value && setPipeline(value)}
          size="small"
        >
          <ToggleButton value="technical">기술적 분석</ToggleButton>
          <ToggleButton value="fundamental">기본적 분석</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={themeView}
          exclusive
          onChange={(_event, value) => value && setThemeView(value)}
          size="small"
        >
          <ToggleButton value="grouped">그룹화</ToggleButton>
          <ToggleButton value="flat">단일 목록</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {isFallbackActive && fallbackLabel && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          선택한 테마 뷰가 이번 내보내기에 없습니다. 대신 {fallbackLabel}을(를) 표시합니다.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <SummaryMetric label="신흥 테마" value={payload.emerging?.count ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryMetric label="대기 중인 머지 제안" value={payload.pending_merge_count ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryMetric label="재시도 가능한 실패 건수" value={payload.failed_items_count?.failed_count ?? 0} />
        </Grid>
      </Grid>

      {emerging.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            신흥 테마 (Emerging Themes)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>테마</TableCell>
                  <TableCell align="right">7일 언급 횟수</TableCell>
                  <TableCell align="right">속도 (Velocity)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emerging.slice(0, 10).map((row) => (
                  <TableRow key={row.theme}>
                    <TableCell>{row.theme}</TableCell>
                    <TableCell align="right">{row.mentions_7d}</TableCell>
                    <TableCell align="right">{row.velocity?.toFixed?.(2) ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {activeThemeView === 'grouped' ? '그룹화 순위' : '단일 순위 목록'}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">순위</TableCell>
                <TableCell>테마</TableCell>
                <TableCell align="right">모멘텀</TableCell>
                <TableCell align="right">7일 언급 횟수</TableCell>
                <TableCell align="right">구성 종목 수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rankings.slice(0, 50).map((row) => (
                <TableRow key={row.id ?? row.theme_cluster_id}>
                  <TableCell align="right">{row.rank ?? '-'}</TableCell>
                  <TableCell>{row.display_name || row.theme}</TableCell>
                  <TableCell align="right">{row.momentum_score?.toFixed?.(2) ?? '-'}</TableCell>
                  <TableCell align="right">{row.mentions_7d ?? '-'}</TableCell>
                  <TableCell align="right">{row.num_constituents ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default StaticThemesPage;

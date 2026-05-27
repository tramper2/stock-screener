import { Grid } from '@mui/material';
import {
  CompactRangeInput,
  CompactSelect,
  CompactCheckbox,
  FilterSection,
} from '../../../../components/Scan/filters';
import { STAGE_OPTIONS } from './constants';

function TechnicalFiltersSection({
  filters,
  updateFilter,
  updateRangeFilter,
  activeCount,
  defaultExpanded,
}) {
  return (
    <FilterSection
      title="기술적 분석 (Technical)"
      category="technical"
      activeCount={activeCount}
      defaultExpanded={defaultExpanded}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="일일 변동성 (ADR %)"
            minValue={filters.adrPercent?.min}
            maxValue={filters.adrPercent?.max}
            onChange={(range) => updateRangeFilter('adrPercent', range)}
            step={0.5}
            minLimit={0}
            suffix="%"
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1.5}>
          <CompactSelect
            label="주가 단계 (Stage)"
            value={filters.stage}
            options={STAGE_OPTIONS}
            onChange={(value) => updateFilter('stage', value)}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="상대강도 등급 (RS Rating)"
            minValue={filters.rsRating?.min}
            maxValue={filters.rsRating?.max}
            onChange={(range) => updateRangeFilter('rsRating', range)}
            step={5}
            minLimit={0}
            maxLimit={100}
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="RS 1개월"
            minValue={filters.rs1m?.min}
            maxValue={filters.rs1m?.max}
            onChange={(range) => updateRangeFilter('rs1m', range)}
            step={5}
            minLimit={0}
            maxLimit={100}
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="RS 3개월"
            minValue={filters.rs3m?.min}
            maxValue={filters.rs3m?.max}
            onChange={(range) => updateRangeFilter('rs3m', range)}
            step={5}
            minLimit={0}
            maxLimit={100}
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="RS 12개월"
            minValue={filters.rs12m?.min}
            maxValue={filters.rs12m?.max}
            onChange={(range) => updateRangeFilter('rs12m', range)}
            step={5}
            minLimit={0}
            maxLimit={100}
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="베타지수 (Beta)"
            minValue={filters.beta?.min}
            maxValue={filters.beta?.max}
            onChange={(range) => updateRangeFilter('beta', range)}
            step={0.1}
            minLimit={0}
            maxLimit={5}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="베타 조절 RS"
            minValue={filters.betaAdjRs?.min}
            maxValue={filters.betaAdjRs?.max}
            onChange={(range) => updateRangeFilter('betaAdjRs', range)}
            step={5}
            minLimit={0}
            maxLimit={100}
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1}>
          <CompactCheckbox
            label="이평 정배열"
            value={filters.maAlignment}
            onChange={(value) => updateFilter('maAlignment', value)}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1}>
          <CompactCheckbox
            label="포켓 피봇"
            value={filters.pocketPivot}
            onChange={(value) => updateFilter('pocketPivot', value)}
          />
        </Grid>
        <Grid item xs={6} sm={3} md={1}>
          <CompactCheckbox
            label="파워 트렌드"
            value={filters.powerTrend}
            onChange={(value) => updateFilter('powerTrend', value)}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="1일 수익률"
            minValue={filters.perfDay?.min}
            maxValue={filters.perfDay?.max}
            onChange={(range) => updateRangeFilter('perfDay', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="1주 수익률"
            minValue={filters.perfWeek?.min}
            maxValue={filters.perfWeek?.max}
            onChange={(range) => updateRangeFilter('perfWeek', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="1달 수익률"
            minValue={filters.perfMonth?.min}
            maxValue={filters.perfMonth?.max}
            onChange={(range) => updateRangeFilter('perfMonth', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="3달 수익률"
            minValue={filters.perf3m?.min}
            maxValue={filters.perf3m?.max}
            onChange={(range) => updateRangeFilter('perf3m', range)}
            step={5}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="6달 수익률"
            minValue={filters.perf6m?.min}
            maxValue={filters.perf6m?.max}
            onChange={(range) => updateRangeFilter('perf6m', range)}
            step={10}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="갭 상승률 (%)"
            minValue={filters.gapPercent?.min}
            maxValue={filters.gapPercent?.max}
            onChange={(range) => updateRangeFilter('gapPercent', range)}
            step={1}
            suffix="%"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="거래량 폭증"
            minValue={filters.volumeSurge?.min}
            maxValue={filters.volumeSurge?.max}
            onChange={(range) => updateRangeFilter('volumeSurge', range)}
            step={0.5}
            minLimit={0}
            suffix="x"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="EMA10 이격도"
            minValue={filters.ema10Distance?.min}
            maxValue={filters.ema10Distance?.max}
            onChange={(range) => updateRangeFilter('ema10Distance', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="EMA20 이격도"
            minValue={filters.ema20Distance?.min}
            maxValue={filters.ema20Distance?.max}
            onChange={(range) => updateRangeFilter('ema20Distance', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="EMA50 이격도"
            minValue={filters.ema50Distance?.min}
            maxValue={filters.ema50Distance?.max}
            onChange={(range) => updateRangeFilter('ema50Distance', range)}
            step={1}
            suffix="%"
            minOnly
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="52주 신고가 대비"
            minValue={filters.week52HighDistance?.min}
            maxValue={filters.week52HighDistance?.max}
            onChange={(range) => updateRangeFilter('week52HighDistance', range)}
            step={1}
            suffix="%"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={1.5}>
          <CompactRangeInput
            label="52주 신저가 대비"
            minValue={filters.week52LowDistance?.min}
            maxValue={filters.week52LowDistance?.max}
            onChange={(range) => updateRangeFilter('week52LowDistance', range)}
            step={1}
            suffix="%"
          />
        </Grid>
      </Grid>
    </FilterSection>
  );
}

export default TechnicalFiltersSection;

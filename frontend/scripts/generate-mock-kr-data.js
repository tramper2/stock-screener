import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target directory paths
const outputDir = path.join(__dirname, '..', 'public', 'static-data');
const marketsDir = path.join(outputDir, 'markets', 'kr');
const scanDir = path.join(marketsDir, 'scan');
const scanChunksDir = path.join(scanDir, 'chunks');
const chartsDir = path.join(marketsDir, 'charts');
const chartsSubDir = path.join(chartsDir, 'charts');

// Ensure directories exist
[outputDir, marketsDir, scanDir, scanChunksDir, chartsDir, chartsSubDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper: Get the last N trading days (excluding weekends) ending today
const getTradingDays = (count) => {
  const dates = [];
  const current = new Date();
  while (dates.length < count) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Exclude Sat/Sun
      dates.push(current.toISOString().split('T')[0]);
    }
    current.setDate(current.getDate() - 1);
  }
  return dates.reverse();
};

const TRADING_DAYS = getTradingDays(120);
const latestDate = TRADING_DAYS[TRADING_DAYS.length - 1];

// Generate index data (KOSPI Benchmark ^KS11)
const generateKOSPI = () => {
  const baseValue = 2650;
  const history = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < TRADING_DAYS.length; i++) {
    const date = TRADING_DAYS[i];
    const change = (Math.random() - 0.48) * 30; // slightly positive bias
    currentValue += change;
    history.push({ date, close: parseFloat(currentValue.toFixed(2)) });
  }
  
  return {
    symbol: '^KS11',
    display_name: 'KOSPI',
    latest_close: history[history.length - 1].close,
    change_1d: parseFloat(((history[history.length - 1].close - history[history.length - 2].close) / history[history.length - 2].close * 100).toFixed(2)),
    currency: 'KRW',
    history
  };
};

const kospiBenchmark = generateKOSPI();

// Korean Stocks definitions
const STOCKS = [
  { symbol: '005930.KS', name: '삼성전자', englishName: 'Samsung Electronics', sector: 'IT', industry: '반도체', group: 'AI 반도체', basePrice: 75000, trendType: 'up', cap: 462e12, rsRating: 88, epsRating: 92, salesGrowth: 18, epsGrowth: 24, stage: 2 },
  { symbol: '000660.KS', name: 'SK하이닉스', englishName: 'SK Hynix', sector: 'IT', industry: '반도체', group: 'AI 반도체', basePrice: 175000, trendType: 'up', cap: 138e12, rsRating: 95, epsRating: 97, salesGrowth: 45, epsGrowth: 78, stage: 2 },
  { symbol: '247540.KQ', name: '에코프로비엠', englishName: 'EcoPro BM', sector: '소재', industry: '이차전지 소재', group: '이차전지', basePrice: 220000, trendType: 'down', cap: 19e12, rsRating: 24, epsRating: 48, salesGrowth: -12, epsGrowth: -35, stage: 4 },
  { symbol: '035420.KS', name: 'NAVER', englishName: 'NAVER', sector: '서비스업', industry: '인터넷 플랫폼', group: '인터넷', basePrice: 185000, trendType: 'flat', cap: 28e12, rsRating: 55, epsRating: 72, salesGrowth: 9, epsGrowth: 11, stage: 1 },
  { symbol: '035720.KS', name: '카카오', englishName: 'Kakao', sector: '서비스업', industry: '인터넷 플랫폼', group: '인터넷', basePrice: 47000, trendType: 'down', cap: 20e12, rsRating: 35, epsRating: 50, salesGrowth: 4, epsGrowth: -15, stage: 4 },
  { symbol: '005380.KS', name: '현대차', englishName: 'Hyundai Motor', sector: '운수장비', industry: '자동차 제조', group: '자동차', basePrice: 245000, trendType: 'up', cap: 51e12, rsRating: 89, epsRating: 85, salesGrowth: 10, epsGrowth: 14, stage: 2 },
  { symbol: '000270.KS', name: '기아', englishName: 'Kia', sector: '운수장비', industry: '자동차 제조', group: '자동차', basePrice: 118000, trendType: 'up', cap: 46e12, rsRating: 90, epsRating: 86, salesGrowth: 12, epsGrowth: 16, stage: 2 },
  { symbol: '068270.KS', name: '셀트리온', englishName: 'Celltrion', sector: '의약품', industry: '바이오의약품', group: '바이오 헬스케어', basePrice: 192000, trendType: 'up', cap: 42e12, rsRating: 81, epsRating: 69, salesGrowth: 28, epsGrowth: 35, stage: 2 },
  { symbol: '005490.KS', name: 'POSCO홀딩스', englishName: 'POSCO Holdings', sector: '철강금속', industry: '철강 제조', group: '이차전지', basePrice: 385000, trendType: 'flat', cap: 31e12, rsRating: 42, epsRating: 60, salesGrowth: -2, epsGrowth: 2, stage: 3 },
  { symbol: '105560.KS', name: 'KB금융', englishName: 'KB Financial Group', sector: '금융업', industry: '은행/금융지주', group: '금융', basePrice: 76000, trendType: 'up', cap: 30e12, rsRating: 91, epsRating: 82, salesGrowth: 6, epsGrowth: 10, stage: 2 },
  { symbol: '055550.KS', name: '신한지주', englishName: 'Shinhan Financial Group', sector: '금융업', industry: '은행/금융지주', group: '금융', basePrice: 47500, trendType: 'up', cap: 24e12, rsRating: 87, epsRating: 80, salesGrowth: 5, epsGrowth: 8, stage: 2 },
  { symbol: '006400.KS', name: '삼성SDI', englishName: 'Samsung SDI', sector: '화학', industry: '배터리 제조', group: '이차전지', basePrice: 410000, trendType: 'down', cap: 27e12, rsRating: 30, epsRating: 58, salesGrowth: -8, epsGrowth: -18, stage: 4 },
  { symbol: '012330.KS', name: '현대모비스', englishName: 'Hyundai Mobis', sector: '운수장비', industry: '자동차 부품', group: '자동차', basePrice: 222000, trendType: 'flat', cap: 21e12, rsRating: 62, epsRating: 70, salesGrowth: 4, epsGrowth: 6, stage: 1 },
  { symbol: '032830.KS', name: '삼성생명', englishName: 'Samsung Life Insurance', sector: '보험', industry: '생명보험', group: '금융', basePrice: 84000, trendType: 'up', cap: 16e12, rsRating: 80, epsRating: 75, salesGrowth: 3, epsGrowth: 7, stage: 2 }
];

// Helper to calculate EMA
const calculateEMA = (prices, period) => {
  const k = 2 / (period + 1);
  let ema = prices[0];
  const emaList = [ema];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
    emaList.push(ema);
  }
  return emaList;
};

// Generate Stock history, charts and summary rows
const stockDatabase = {};
const chartIndexSymbols = [];

STOCKS.forEach((s, idx) => {
  const basePrice = s.basePrice;
  const drift = s.trendType === 'up' ? 0.0012 : s.trendType === 'down' ? -0.0012 : 0;
  const volatility = 0.018;
  
  const history = [];
  const prices = [];
  let price = basePrice * 0.9; // Start a bit lower
  
  for (let i = 0; i < TRADING_DAYS.length; i++) {
    const date = TRADING_DAYS[i];
    const rand = (Math.random() - 0.48) * 2; // -0.96 to 1.04
    const pctChange = drift + rand * volatility;
    const open = price * (1 + (Math.random() - 0.5) * 0.005);
    const close = price * (1 + pctChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.008);
    const low = Math.min(open, close) * (1 - Math.random() * 0.008);
    const volume = Math.floor(100000 + Math.random() * 900000);
    
    price = close;
    prices.push(close);
    
    history.push({
      date,
      open: parseFloat(open.toFixed(0)),
      high: parseFloat(high.toFixed(0)),
      low: parseFloat(low.toFixed(0)),
      close: parseFloat(close.toFixed(0)),
      volume
    });
  }

  // Calculate EMAs
  const ema50 = calculateEMA(prices, 50);
  const ema150 = calculateEMA(prices, 150);
  const ema200 = calculateEMA(prices, 200);
  
  // Format bars for CandlestickChart (with EMA fields)
  const bars = history.map((h, i) => ({
    ...h,
    ma_50: parseFloat(ema50[i].toFixed(0)),
    ma_150: parseFloat(ema150[i].toFixed(0)),
    ma_200: parseFloat(ema200[i].toFixed(0))
  }));

  const lastBar = bars[bars.length - 1];
  const secondLastBar = bars[bars.length - 2];
  const pct1d = parseFloat(((lastBar.close - secondLastBar.close) / secondLastBar.close * 100).toFixed(2));
  
  const compositeScore = parseFloat((s.rsRating * 0.4 + s.epsRating * 0.4 + (s.trendType === 'up' ? 20 : s.trendType === 'down' ? -10 : 10)).toFixed(1));

  // Fundamentals details
  const fundamentals = {
    eps_rating: s.epsRating,
    rs_rating: s.rsRating,
    sales_growth_qq: s.salesGrowth,
    sales_growth_yy: s.salesGrowth + 3,
    eps_growth_qq: s.epsGrowth,
    eps_growth_yy: s.epsGrowth + 5,
    adr_percent: parseFloat((2.0 + Math.random() * 3.5).toFixed(2)),
    market_cap_usd: s.cap / 1400 // approx exchange rate
  };

  const stockData = {
    symbol: s.symbol,
    company_name: s.name,
    english_name: s.englishName,
    current_price: lastBar.close,
    price_change_1d: pct1d,
    currency: 'KRW',
    gics_sector: s.sector,
    gics_industry: s.industry,
    ibd_industry_group: s.group,
    ibd_group_rank: s.group === 'AI 반도체' ? 1 : s.group === '자동차' ? 2 : s.group === '금융' ? 4 : s.group === '바이오 헬스케어' ? 8 : s.group === '인터넷' ? 15 : 45,
    stage: s.stage,
    rating: compositeScore >= 80 ? 'Strong Buy' : compositeScore >= 60 ? 'Buy' : 'Hold',
    composite_score: compositeScore
  };

  // Save to chart indexes
  const chartPath = `charts/${s.symbol}.json`;
  chartIndexSymbols.push({
    symbol: s.symbol,
    rank: idx + 1,
    path: chartPath
  });

  // Complete stock json payload
  stockDatabase[s.symbol] = {
    generated_at: new Date().toISOString(),
    as_of_date: latestDate,
    symbol: s.symbol,
    stock_data: stockData,
    fundamentals: fundamentals,
    bars
  };
});

// Write Chart Index and individual Stock Charts
const chartIndexPayload = {
  schema_version: 'static-charts-v1',
  generated_at: new Date().toISOString(),
  as_of_date: latestDate,
  limit: 200,
  symbols_total: chartIndexSymbols.length,
  skipped_symbols: [],
  symbols: chartIndexSymbols
};
fs.writeFileSync(path.join(chartsDir, 'index.json'), JSON.stringify(chartIndexPayload, null, 2));

Object.keys(stockDatabase).forEach(symbol => {
  fs.writeFileSync(path.join(chartsSubDir, `${symbol}.json`), JSON.stringify(stockDatabase[symbol], null, 2));
});

// Prepare groups rankings data
const GROUPS = [
  { group: 'AI 반도체', rank: 1, prevRank: 2, avgRs: 91.5, numStocks: 2, topSymbol: '000660.KS', topName: 'SK하이닉스' },
  { group: '자동차', rank: 2, prevRank: 3, avgRs: 87.2, numStocks: 3, topSymbol: '000270.KS', topName: '기아' },
  { group: '금융', rank: 4, prevRank: 7, avgRs: 82.8, numStocks: 3, topSymbol: '105560.KS', topName: 'KB금융' },
  { group: '바이오 헬스케어', rank: 8, prevRank: 6, avgRs: 81.0, numStocks: 1, topSymbol: '068270.KS', topName: '셀트리온' },
  { group: '인터넷', rank: 15, prevRank: 12, avgRs: 48.0, numStocks: 2, topSymbol: '035420.KS', topName: 'NAVER' },
  { group: '이차전지', rank: 45, prevRank: 40, avgRs: 28.5, numStocks: 3, topSymbol: '247540.KQ', topName: '에코프로비엠' }
];

const generateGroups = () => {
  const rankings = GROUPS.map(g => ({
    industry_group: g.group,
    rank: g.rank,
    avg_rs_rating: g.avgRs,
    num_stocks: g.numStocks,
    rank_change_1w: g.prevRank - g.rank,
    rank_change_1m: g.prevRank + 2 - g.rank,
    rank_change_3m: g.prevRank + 5 - g.rank,
    top_symbol: g.topSymbol,
    top_symbol_name: g.topName
  }));

  const groupDetails = {};
  GROUPS.forEach(g => {
    // Collect stock constituent profiles
    const constituents = STOCKS.filter(s => s.group === g.group).map(s => {
      const db = stockDatabase[s.symbol];
      return {
        symbol: s.symbol,
        company_name: s.name,
        price: db.stock_data.current_price,
        price_change_1d: db.stock_data.price_change_1d,
        price_trend: db.stock_data.stage === 2 ? 1 : db.stock_data.stage === 4 ? -1 : 0,
        price_sparkline_data: db.bars.slice(-30).map(b => parseFloat((b.close / db.bars[db.bars.length - 30].close).toFixed(4))),
        rs_sparkline_data: db.bars.slice(-30).map((b, idx) => {
          const kospiClose = kospiBenchmark.history[kospiBenchmark.history.length - 30 + idx].close;
          return parseFloat((b.close / kospiClose).toFixed(4));
        }),
        rs_trend: s.trendType === 'up' ? 1 : s.trendType === 'down' ? -1 : 0,
        rs_rating: s.rsRating,
        rs_rating_1m: Math.max(1, s.rsRating - 3),
        rs_rating_3m: Math.max(1, s.rsRating - 5),
        eps_growth_qq: s.epsGrowth,
        eps_growth_yy: s.epsGrowth + 5,
        sales_growth_qq: s.salesGrowth,
        sales_growth_yy: s.salesGrowth + 3,
        stage: s.stage
      };
    });

    // History of group rankings
    const history = [];
    let currentRank = g.rank;
    for (let i = 0; i < 6; i++) {
      const year = 2026;
      const month = 5 - i;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-28`;
      history.push({
        date: dateStr,
        rank: currentRank,
        avg_rs_rating: parseFloat((g.avgRs + (Math.random() - 0.5) * 4).toFixed(1)),
        num_stocks: g.numStocks
      });
      currentRank = Math.min(197, Math.max(1, currentRank + Math.floor((Math.random() - 0.5) * 6)));
    }

    groupDetails[g.group] = {
      industry_group: g.group,
      current_rank: g.rank,
      current_avg_rs: g.avgRs,
      num_stocks: g.numStocks,
      top_symbol: g.topSymbol,
      top_rs_rating: g.avgRs + 5,
      rank_change_1w: g.prevRank - g.rank,
      rank_change_1m: g.prevRank + 2 - g.rank,
      rank_change_3m: g.prevRank + 5 - g.rank,
      rank_change_6m: g.prevRank + 8 - g.rank,
      stocks: constituents,
      history
    };
  });

  return {
    available: true,
    published_at: new Date().toISOString(),
    payload: {
      movers_period: '1w',
      rankings: {
        date: latestDate,
        rankings: rankings
      },
      movers: {
        gainers: rankings.filter(r => r.rank_change_1w > 0).sort((a,b) => b.rank_change_1w - a.rank_change_1w),
        losers: rankings.filter(r => r.rank_change_1w < 0).sort((a,b) => a.rank_change_1w - b.rank_change_1w)
      },
      group_details: groupDetails
    }
  };
};

const groupsPayload = generateGroups();
fs.writeFileSync(path.join(marketsDir, 'groups.json'), JSON.stringify(groupsPayload, null, 2));

// Generate breadth metrics
const generateBreadth = () => {
  const history_90d = [];
  for (let i = 0; i < TRADING_DAYS.length; i++) {
    const date = TRADING_DAYS[i];
    // Create random breadth moves
    const up = Math.floor(5 + Math.random() * 45);
    const down = Math.floor(2 + Math.random() * 25);
    history_90d.push({
      date,
      stocks_up_4pct: up,
      stocks_down_4pct: down,
      ratio_5day: parseFloat((up / (down || 1)).toFixed(2)),
      ratio_10day: parseFloat((up * 1.2 / (down || 1)).toFixed(2))
    });
  }

  const latestBreadth = history_90d[history_90d.length - 1];

  // Mock group attribution history
  const attributionHistory = [];
  // Take last 10 sessions
  const recentDays = TRADING_DAYS.slice(-10).reverse();
  recentDays.forEach(date => {
    const dayBreadth = history_90d.find(h => h.date === date) || latestBreadth;
    
    // Distribute up/down stocks among mock groups
    const dayGroups = GROUPS.map(g => {
      const gUp = Math.floor(Math.random() * 4);
      const gDown = Math.floor(Math.random() * 2);
      
      const upConstituents = STOCKS.filter(s => s.group === g.group).slice(0, gUp).map(s => {
        const db = stockDatabase[s.symbol];
        const dayBar = db.bars.find(b => b.date === date) || db.bars[db.bars.length - 1];
        return {
          symbol: s.symbol,
          name: s.name,
          pct_change: parseFloat(((Math.random() * 3) + 4).toFixed(2)), // 4%+
          close: dayBar.close
        };
      });

      const downConstituents = STOCKS.filter(s => s.group === g.group).slice(0, gDown).map(s => {
        const db = stockDatabase[s.symbol];
        const dayBar = db.bars.find(b => b.date === date) || db.bars[db.bars.length - 1];
        return {
          symbol: s.symbol,
          name: s.name,
          pct_change: parseFloat((-(Math.random() * 3) - 4).toFixed(2)), // -4%+
          close: dayBar.close
        };
      });

      return {
        group: g.group,
        up_count: upConstituents.length,
        down_count: downConstituents.length,
        net: upConstituents.length - downConstituents.length,
        up_stocks: upConstituents,
        down_stocks: downConstituents
      };
    });

    attributionHistory.push({
      date,
      stocks_up_4pct: dayBreadth.stocks_up_4pct,
      stocks_down_4pct: dayBreadth.stocks_down_4pct,
      groups: dayGroups
    });
  });

  return {
    available: true,
    published_at: new Date().toISOString(),
    payload: {
      current: {
        date: latestDate,
        stocks_up_4pct: latestBreadth.stocks_up_4pct,
        stocks_down_4pct: latestBreadth.stocks_down_4pct,
        ratio_10day: latestBreadth.ratio_10day
      },
      chart_data: history_90d,
      benchmark_overlay: kospiBenchmark.history.slice(-90),
      benchmark_symbol: '^KS11',
      history_90d: history_90d,
      group_attribution: {
        available: true,
        history: attributionHistory
      }
    }
  };
};

const breadthPayload = generateBreadth();
fs.writeFileSync(path.join(marketsDir, 'breadth.json'), JSON.stringify(breadthPayload, null, 2));

// Generate home dashboard
const generateHome = () => {
  const scanSummaryResults = STOCKS.map(s => {
    const db = stockDatabase[s.symbol];
    return {
      symbol: s.symbol,
      company_name: s.name,
      composite_score: db.stock_data.composite_score,
      current_price: db.stock_data.current_price,
      rating: db.stock_data.rating,
      currency: 'KRW'
    };
  }).sort((a,b) => b.composite_score - a.composite_score).slice(0, 5);

  return {
    generated_at: new Date().toISOString(),
    as_of_date: latestDate,
    market: 'KR',
    market_display_name: '한국 (KOSPI/KOSDAQ)',
    freshness: {
      scan_as_of_date: latestDate,
      scan_run_id: 1,
      breadth_latest_date: latestDate,
      groups_latest_date: latestDate
    },
    key_markets: [
      {
        symbol: '^KS11',
        display_name: 'KOSPI 종합지수',
        latest_close: kospiBenchmark.latest_close,
        change_1d: kospiBenchmark.change_1d,
        currency: 'KRW',
        history: kospiBenchmark.history.slice(-30)
      },
      {
        symbol: '069500.KS',
        display_name: 'KODEX 200 (ETF)',
        latest_close: parseFloat((kospiBenchmark.latest_close * 15).toFixed(0)), // approximate ETF price mapping
        change_1d: kospiBenchmark.change_1d,
        currency: 'KRW',
        history: kospiBenchmark.history.slice(-30).map(h => ({ date: h.date, close: parseFloat((h.close * 15).toFixed(0)) }))
      }
    ],
    scan_summary: {
      top_results: scanSummaryResults
    },
    top_groups: GROUPS.map(g => ({
      rank: g.rank,
      industry_group: g.group,
      rank_change_1w: g.prevRank - g.rank,
      rank_change_1m: g.prevRank + 2 - g.rank,
      top_symbol: g.topSymbol,
      top_symbol_name: g.topName
    }))
  };
};

const homePayload = generateHome();
fs.writeFileSync(path.join(marketsDir, 'home.json'), JSON.stringify(homePayload, null, 2));

// Generate scan manifest & rows chunk
const generateScan = () => {
  const scanRows = STOCKS.map(s => {
    const db = stockDatabase[s.symbol];
    return {
      symbol: s.symbol,
      company_name: s.name,
      english_name: s.englishName,
      composite_score: db.stock_data.composite_score,
      current_price: db.stock_data.current_price,
      price_change_1d: db.stock_data.price_change_1d,
      currency: 'KRW',
      market_cap_usd: db.fundamentals.market_cap_usd,
      rating: db.stock_data.rating,
      price_sparkline_data: db.bars.slice(-30).map(b => parseFloat((b.close / db.bars[db.bars.length - 30].close).toFixed(4))),
      price_trend: db.stock_data.stage === 2 ? 1 : db.stock_data.stage === 4 ? -1 : 0,
      ibd_industry_group: db.stock_data.ibd_industry_group,
      ibd_group_rank: db.stock_data.ibd_group_rank,
      rs_sparkline_data: db.bars.slice(-30).map((b, idx) => {
        const kospiClose = kospiBenchmark.history[kospiBenchmark.history.length - 30 + idx].close;
        return parseFloat((b.close / kospiClose).toFixed(4));
      }),
      rs_trend: s.trendType === 'up' ? 1 : s.trendType === 'down' ? -1 : 0,
      
      // Filter helper fields
      eps_rating: s.epsRating,
      rs_rating: s.rsRating,
      sales_growth_qq: s.salesGrowth,
      sales_growth_yy: s.salesGrowth + 3,
      eps_growth_qq: s.epsGrowth,
      eps_growth_yy: s.epsGrowth + 5,
      adr_percent: db.fundamentals.adr_percent,
      stage: s.stage
    };
  });

  const manifest = {
    generated_at: new Date().toISOString(),
    as_of_date: latestDate,
    run_id: 1,
    sort: { field: 'composite_score', order: 'desc' },
    default_page_size: 50,
    rows_total: scanRows.length,
    filter_options: {
      ibd_industries: GROUPS.map(g => g.group),
      gics_sectors: [...new Set(STOCKS.map(s => s.sector))],
      ratings: ['Strong Buy', 'Buy', 'Hold']
    },
    initial_rows: scanRows.slice(0, 5), // Put first 5 rows inside manifest for quick load
    preset_screens: [
      {
        id: 'minervini',
        name: '미네르비니 트렌드 템플릿',
        short_name: '미네르비니',
        description: '상승 2단계(Stage 2) 진행 종목',
        tier: 1,
        filters: { minerviniScore: { min: 70, max: null }, stage: 2 },
        sort_by: 'minervini_score',
        sort_order: 'desc'
      },
      {
        id: 'strong_rs',
        name: '강한 상대강도(RS 80+)',
        short_name: '시장주도주',
        description: '지수 대비 상대강도가 매우 우수한 시장 주도주',
        tier: 1,
        filters: { rsRating: { min: 80, max: null } },
        sort_by: 'rs_rating',
        sort_order: 'desc'
      }
    ],
    chunks: [{ path: 'markets/kr/scan/chunks/chunk-0001.json', count: scanRows.length }],
    charts: {
      path: 'markets/kr/charts/index.json',
      limit: 200,
      symbols_total: scanRows.length,
      available: true
    }
  };

  const chunk = {
    rows: scanRows
  };

  fs.writeFileSync(path.join(scanDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(scanChunksDir, 'chunk-0001.json'), JSON.stringify(chunk, null, 2));
};

generateScan();

// Generate root manifest.json
const rootManifest = {
  schema_version: 'static-site-v2',
  generated_at: new Date().toISOString(),
  as_of_date: latestDate,
  default_market: 'KR',
  supported_markets: ['KR'],
  features: {
    scan: true,
    breadth: true,
    groups: true
  },
  markets: {
    KR: {
      display_name: '한국 (KOSPI/KOSDAQ)',
      pages: {
        home: { path: 'markets/kr/home.json' },
        scan: { path: 'markets/kr/scan/manifest.json' },
        breadth: { path: 'markets/kr/breadth.json' },
        groups: { path: 'markets/kr/groups.json' }
      },
      assets: {
        charts: { path: 'markets/kr/charts/index.json' }
      }
    }
  },
  warnings: []
};
fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(rootManifest, null, 2));

console.log('Successfully generated Korean mock data in public/static-data!');

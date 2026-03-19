# Python 量化金融架构推荐 (2026)

### 数据处理框架对比

| 框架 | 性能 | 内存效率 | 语法 | 适用场景 |
|------|------|----------|------|----------|
| **Polars** | 最快 (Rust核心) | 极优 (惰性求值) | 表达式链式 | 大规模数据、回测 |
| **Pandas 2.x** | 良好 (PyArrow后端) | 中等 | 传统熟悉 | 小数据、快速原型 |
| **DuckDB** | 极快 (OLAP优化) | 优秀 | SQL + Python | 分析查询、临时分析 |

### 方案一：Polars + 轻量化回测 (推荐给新项目)

**架构组合:**

```text
Python 3.12+
├── 数据层
│   ├── Polars 1.x (主力数据处理)
│   ├── DuckDB (复杂SQL查询)
│   └── PyArrow (数据交换格式)
├── 量化框架
│   ├── VectorBT Pro (向量化回测)
│   │   或 Zipline-Reloaded (事件驱动回测)
│   ├── QuantStats (绩效分析)
│   └── ta-lib / pandas-ta (技术指标)
├── 机器学习
│   ├── LightGBM / XGBoost (传统ML)
│   ├── PyTorch (深度学习)
│   └── Optuna (超参优化)
├── 数据源
│   ├── yfinance / akshare (免费数据)
│   ├── CCXT (加密货币)
│   └── Arctic / QuestDB (时序数据库)
└── 可视化
    ├── Plotly (交互图表)
    └── mplfinance (K线图)
```

**Polars vs Pandas 性能对比:**

| 操作 | Polars | Pandas 2.x |
|------|--------|------------|
| 读取 10GB CSV | ~3s | ~45s |
| GroupBy 聚合 | ~0.5s | ~8s |
| 内存占用 | 1x | 3-5x |
| 多核利用 | 自动并行 | 需手动 |

**Polars 量化示例:**

```python
import polars as pl

# 惰性求值 - 自动优化查询计划
df = (
    pl.scan_parquet("ohlcv_data/*.parquet")
    .filter(pl.col("date") >= "2024-01-01")
    .with_columns([
        # 技术指标计算
        pl.col("close").rolling_mean(20).alias("sma_20"),
        pl.col("close").rolling_mean(50).alias("sma_50"),
        pl.col("close").pct_change().alias("returns"),
    ])
    .with_columns([
        # 信号生成
        (pl.col("sma_20") > pl.col("sma_50")).alias("signal")
    ])
    .collect()  # 执行
)
```

### 方案二：VeighNa (vnpy) - 全栈量化平台 (推荐给国内实盘)

**项目地址:** [github.com/vnpy/vnpy](https://github.com/vnpy/vnpy)

**架构组合:**

```text
VeighNa 4.0+ (Python 3.10-3.13)
├── 核心引擎
│   ├── 事件驱动引擎 (Event Engine)
│   ├── 主引擎 (Main Engine)
│   └── OMS 订单管理系统
├── 交易接口 (Gateway)
│   ├── 国内: CTP, Mini, XTP, TORA, EMT (期货/期权/A股)
│   ├── 国际: Interactive Brokers, Esunny
│   └── 加密货币: 通过 CCXT 扩展
├── 策略引擎
│   ├── CTA策略 (趋势跟踪)
│   ├── 价差交易 (Spread Trading)
│   ├── 组合策略 (Portfolio Strategy)
│   ├── 算法交易 (TWAP, Iceberg, Sniper)
│   └── vnpy.alpha (多因子ML策略)
├── 数据服务
│   ├── RQData, TuShare, Wind, iFinD
│   └── 数据库: SQLite/MySQL/PostgreSQL/MongoDB/TDengine
└── GUI
    └── PyQt6 界面 (可选)
```

**关键优势:**

- **国内券商/期货全覆盖**: CTP/XTP/TORA 等主流接口
- **事件驱动**: 精确模拟实盘执行逻辑
- **模块化设计**: Gateway/App/Database 独立安装
- **vnpy.alpha**: 内置多因子ML (Lasso, LightGBM, MLP)
- **活跃社区**: 中文文档��善，商业支持可选

**安装:**

```bash
pip install vnpy vnpy_ctp vnpy_ctastrategy vnpy_datamanager
```

**CTA策略示例:**

```python
from vnpy_ctastrategy import CtaTemplate

class DoubleMaStrategy(CtaTemplate):
    fast_window = 10
    slow_window = 20

    def on_bar(self, bar):
        am = self.am  # ArrayManager
        am.update_bar(bar)
        if not am.inited:
            return

        fast_ma = am.sma(self.fast_window)
        slow_ma = am.sma(self.slow_window)

        if fast_ma > slow_ma and self.pos == 0:
            self.buy(bar.close_price, 1)
        elif fast_ma < slow_ma and self.pos > 0:
            self.sell(bar.close_price, 1)
```

### 方案三：向量化回测 (VectorBT)

**架构组合:**

```text
Python 3.11+
├── VectorBT Pro 2.x (向量化回测)
│   └── 内置 Numba JIT 加速
├── Polars (数据预处理)
└── Dash/Streamlit (可视化面板)
```

**关键优势:**
- 比事件驱动回测快 100-1000x
- 内置 1000+ 技术指标
- 支持多参数组合网格搜索

**示例:**

```python
import vectorbt as vbt

price = vbt.YFData.download("BTC-USD", period="2y").get("Close")

fast_ma = vbt.MA.run(price, window=10)
slow_ma = vbt.MA.run(price, window=50)

entries = fast_ma.ma_crossed_above(slow_ma)
exits = fast_ma.ma_crossed_below(slow_ma)

portfolio = vbt.Portfolio.from_signals(price, entries, exits)
print(portfolio.stats())
```

### 量化框架选型指南

| 需求 | 推荐方案 | 原因 |
|------|----------|------|
| **国内期货/A股实盘** | VeighNa (vnpy) | CTP/XTP原生支持，中文社区 |
| **快速研究/回测** | Polars + VectorBT | 向量化极速，Jupyter友好 |
| **多因子ML策略** | vnpy.alpha 或 自建 | 内置完整ML流程 |
| **加密货币** | CCXT + VectorBT | 交易所API统一 |
| **海外市场** | Zipline + IB | 事件驱动精确模拟 |

### 量化工具生态

| 类别 | 工具 | 描述 |
|------|------|------|
| **全栈平台** | VeighNa, QUANTAXIS | 完整交易系统 |
| **回测引擎** | VectorBT, Zipline, Backtrader | 策略回测 |
| **实盘交易** | CCXT, IBApi, Alpaca | 交易所API |
| **技术指标** | ta-lib, pandas-ta, tulipy | 指标库 |
| **绩效分析** | QuantStats, Pyfolio, empyrical | 风险指标 |
| **因子研究** | Alphalens, FactorLab | 因子分析 |
| **数据存储** | Arctic, QuestDB, TDengine | 时序数据库 |

### 开发环境配置

**pyproject.toml 示例:**

```toml
[project]
name = "quant-strategy"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "polars>=1.0.0",
    "duckdb>=1.0.0",
    "vectorbt>=0.26.0",
    "quantstats>=0.0.62",
    "ta-lib>=0.4.28",
    "yfinance>=0.2.40",
    "plotly>=5.20.0",
]

[project.optional-dependencies]
vnpy = [
    "vnpy>=4.0.0",
    "vnpy_ctp",
    "vnpy_ctastrategy",
]
ml = [
    "lightgbm>=4.3.0",
    "optuna>=3.6.0",
    "torch>=2.2.0",
]
```

**LSP插件:** `pyright-lsp`

**Claude Code Hook (Ruff格式化):**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write\\(.*\\.py\\)",
        "command": "ruff format \"$CLAUDE_FILE_PATH\" && ruff check --fix \"$CLAUDE_FILE_PATH\" 2>&1 | head -10"
      }
    ]
  }
}
```

### 量化项目结构推荐

```text
quant-project/
├── data/
│   ├── raw/              # 原始数据
│   └── processed/        # 处理后数据 (Parquet)
├── src/
│   ├── data/             # 数据获取/清洗
│   ├── features/         # 特征工程
│   ├── strategies/       # 策略实现
│   ├── backtest/         # 回测逻辑
│   └── live/             # 实盘交易
├── notebooks/            # 研究笔记本
├── tests/                # 策略测试
├── configs/              # 策略参数配置
└── pyproject.toml
```

---

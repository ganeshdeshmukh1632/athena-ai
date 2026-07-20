import yfinance as yf


def get_stock_snapshot(symbol: str) -> dict:
    """
    Fetch a basic price + fundamentals snapshot for an NSE-listed stock.
    `symbol` should be the plain ticker, e.g. "RELIANCE" — .NS is added here.
    Falls back across a few possible field names since yfinance's `info`
    dict isn't perfectly consistent across all tickers.
    """
    ticker = yf.Ticker(f"{symbol.upper()}.NS")
    info = ticker.info

    current_price = (
        info.get("currentPrice")
        or info.get("regularMarketPrice")
        or info.get("previousClose")
    )

    return {
        "symbol": symbol.upper(),
        "current_price": current_price,
        "previous_close": info.get("previousClose") or info.get("regularMarketPreviousClose"),
        "day_high": info.get("dayHigh") or info.get("regularMarketDayHigh"),
        "day_low": info.get("dayLow") or info.get("regularMarketDayLow"),
        "market_cap": info.get("marketCap"),
        "pe_ratio": info.get("trailingPE"),
        "fifty_two_week_high": info.get("fiftyTwoWeekHigh"),
        "fifty_two_week_low": info.get("fiftyTwoWeekLow"),
    }

import yfinance as yf


def get_stock_snapshot(symbol: str) -> dict:
    """
    Fetch a basic price + fundamentals snapshot for an NSE-listed stock.
    `symbol` should be the plain ticker, e.g. "RELIANCE" — .NS is added here.
    """
    ticker = yf.Ticker(f"{symbol.upper()}.NS")
    info = ticker.info

    return {
        "symbol": symbol.upper(),
        "current_price": info.get("currentPrice"),
        "previous_close": info.get("previousClose"),
        "day_high": info.get("dayHigh"),
        "day_low": info.get("dayLow"),
        "market_cap": info.get("marketCap"),
        "pe_ratio": info.get("trailingPE"),
        "fifty_two_week_high": info.get("fiftyTwoWeekHigh"),
        "fifty_two_week_low": info.get("fiftyTwoWeekLow"),
    }

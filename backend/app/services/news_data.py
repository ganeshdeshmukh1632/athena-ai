import feedparser

# Free, no-key RSS feeds covering Indian markets
NEWS_FEEDS = [
    "https://www.moneycontrol.com/rss/marketreports.xml",
    "https://www.moneycontrol.com/rss/business.xml",
]


def get_recent_news(company_aliases: list[str], limit: int = 5) -> list[dict]:
    """
    Pulls recent headlines from free market news RSS feeds and filters
    to ones mentioning any of the given company name aliases.
    """
    matches = []
    for feed_url in NEWS_FEEDS:
        try:
            parsed = feedparser.parse(feed_url)
        except Exception:
            continue

        for entry in parsed.entries:
            title = getattr(entry, "title", "")
            title_lower = title.lower()
            if any(alias in title_lower for alias in company_aliases):
                matches.append({
                    "title": title,
                    "link": getattr(entry, "link", ""),
                    "published": getattr(entry, "published", ""),
                })
            if len(matches) >= limit:
                break
        if len(matches) >= limit:
            break

    return matches

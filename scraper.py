import requests
from bs4 import BeautifulSoup

def scrape_website_text(url: str, timeout: int = 5) -> str:
    """Scrapes visible text from a URL to feed to the AI."""
    try:
        # Use a standard User-Agent so websites don't block our bot
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=timeout)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove invisible elements (JavaScript, CSS styling)
        for script in soup(["script", "style", "noscript", "meta", "header", "footer"]):
            script.extract()
            
        # Extract the remaining text cleanly
        text = soup.get_text(separator=' ', strip=True)
        
        # Limit to the first 4000 characters to prevent overloading the Nebius AI token limit
        return text[:4000]
        
    except Exception as e:
        print(f"Scraper Error for {url}: {e}")
        return ""
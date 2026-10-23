import whois
import tldextract
from datetime import datetime

def analyze_domain_age(url: str):
    """
    Extracts the domain from a URL, checks its creation date,
    and flags it if it is younger than 30 days.
    """
    # 1. Safely extract the base domain
    extracted = tldextract.extract(url)
    domain = f"{extracted.domain}.{extracted.suffix}"
    
    # Catch invalid URLs early
    if not extracted.suffix:
        return {"domain": domain, "flagged": True, "reason": "Invalid or missing domain extension"}

    try:
        # 2. Query WHOIS records
        domain_info = whois.whois(domain)
        creation_date = domain_info.creation_date
        
        # WHOIS sometimes returns a list of dates; we just need the first one
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
            
        if not creation_date:
             return {"domain": domain, "flagged": True, "reason": "WHOIS data is completely hidden or missing"}

        # 3. Calculate how many days old the domain is
        age_days = (datetime.now() - creation_date).days
        
        # 4. The Security Heuristic: Flag if younger than 30 days
        is_flagged = age_days < 30
        
        if is_flagged:
            reason = f"HIGH RISK: Domain was registered only {age_days} days ago."
        else:
            reason = f"Domain age looks established ({age_days} days old)."

        return {
            "domain": domain,
            "age_days": age_days,
            "flagged": is_flagged,
            "reason": reason
        }

    except Exception as e:
        # If the WHOIS lookup fails (e.g., unsupported TLD or connection error)
        return {"domain": domain, "flagged": True, "reason": "WHOIS lookup failed or timed out"}
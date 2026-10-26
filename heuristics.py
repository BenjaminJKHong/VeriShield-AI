import whois
import tldextract
from datetime import datetime
# NEW: Required for Mehrunisha's SSL function
import ssl
import socket
import time
from urllib.parse import urlparse

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

def analyze_ssl(domain: str, timeout: float = 5.0) -> dict:
    host = urlparse(domain).hostname or domain.strip().strip("/")

    def result(has_ssl, days, flagged, severity, reason):
        return {"has_ssl": has_ssl, "days_until_expiry": days, "flagged": flagged,
                "severity": severity, "reason": reason}

    try:
        ctx = ssl.create_default_context()
        with socket.create_connection((host, 443), timeout=timeout) as sock:
            with ctx.wrap_socket(sock, server_hostname=host) as tls:
                cert = tls.getpeercert()

        expiry = ssl.cert_time_to_seconds(cert["notAfter"])
        days = int((expiry - time.time()) // 86400)

        if days < 0:
            return result(True, days, True, "Critical", "SSL certificate has expired")
        if days < 30:
            return result(True, days, True, "Warning", f"SSL expires in {days} days")
        return result(True, days, False, "OK", "SSL is valid")

    except ssl.SSLCertVerificationError as e:
        return result(True, None, True, "Critical", f"SSL certificate invalid: {e.verify_message}")
    except (ssl.SSLError, ConnectionRefusedError, socket.timeout, socket.gaierror, OSError):
        return result(False, None, True, "Critical", "No SSL certificate / HTTPS unavailable")
    except Exception as e:
        return result(False, None, False, "Warning", f"SSL check failed: {type(e).__name__}")
def calculate_trust_score(domain_data: dict, ssl_data: dict, ai_data: dict):
    """
    Calculates the final Trust Score based on deterministic heuristics and AI risk.
    Returns the final score (0-100) and a combined list of threat flags.
    """
    score = 100
    combined_flags = []

    # 1. Deduct for Domain Age (Mehrunisha's data)
    if domain_data.get("flagged"):
        score -= 30
        combined_flags.append(domain_data.get("reason"))

    # 2. Deduct for SSL/TLS Issues (Mehrunisha's data)
    if ssl_data and ssl_data.get("flagged"):
        score -= 40
        combined_flags.append(ssl_data.get("reason"))

    # 3. Deduct for AI Risk (Umair's Nemotron data)
    # If the AI says it's an 80% risk, we subtract a weighted portion (e.g., 80 * 0.6 = 48 points)
    ai_risk = ai_data.get("ai_risk_score", 0)
    if ai_risk > 0:
        score -= (ai_risk * 0.6) 
    
    if ai_data.get("is_synthetic_content"):
        score -= 20
        combined_flags.append("AI-generated synthetic content detected")
        
    combined_flags.extend(ai_data.get("manipulation_tactics", []))

    # Ensure score stays strictly within 0-100 boundaries
    final_score = max(0, min(100, int(score)))
    
    return final_score, combined_flags
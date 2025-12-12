from fastapi import FastAPI, HTTPException, UploadFile, File, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
from datetime import datetime
import os

from services.scanner import ContractScanner
from services.report_generator import PDFReportGenerator
from services.ai_explainer import AIExplainer
from services.monitor import ContractMonitor
from services.similarity import CodeSimilarityDetector
from services.ml_model import SecurityMLModel
from services.rate_limiter import RateLimiter
from services.webhook import WebhookService
from services.rule_engine import CustomRuleEngine
from services.user_service import UserService
from services.team_service import TeamService
from services.payment_service import PaymentService

app = FastAPI(title="Pamrae AI - Smart Contract Security Scanner API", version="3.0.0")

# CORS middleware
# Update this with your production frontend URL after deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        # Add your Vercel frontend URL here after deployment
        # "https://your-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
scanner = ContractScanner()
report_generator = PDFReportGenerator()
ai_explainer = AIExplainer()
monitor = ContractMonitor()
similarity_detector = CodeSimilarityDetector()
ml_model = SecurityMLModel()
rate_limiter = RateLimiter()
webhook_service = WebhookService()
rule_engine = CustomRuleEngine()
user_service = UserService()
team_service = TeamService()
payment_service = PaymentService()


class ScanRequest(BaseModel):
    contract_address: str
    chain: str = "ethereum"  # ethereum, base, polygon, solana
    contract_type: Optional[str] = None  # token, nft, defi, etc.
    enable_ml: bool = False  # Enable ML predictions
    enable_custom_rules: bool = False  # Enable custom rules


class ScanResponse(BaseModel):
    contract_address: str
    chain: str
    safety_score: int
    risk_level: str
    vulnerabilities: List[dict]
    rug_pull_indicators: List[dict]
    gas_optimizations: Optional[List[dict]] = []
    ai_explanation: str
    timestamp: str
    recommendations: List[str]
    scan_id: Optional[str] = None


@app.get("/")
async def root():
    return {
        "message": "Pamrae AI - Smart Contract Security Scanner API",
        "version": "3.0.0",
        "company": "Pamrae AI",
        "founded": "December 2025",
        "founders": ["Ugorume Henry", "Pamela Odunna"],
        "endpoints": {
            "scan": "/api/v1/scan",
            "upload": "/api/v1/upload",
            "report": "/api/v1/report",
            "auth": "/api/v1/auth/register",
            "teams": "/api/v1/teams"
        }
    }


async def get_api_key(x_api_key: Optional[str] = Header(None)) -> Optional[str]:
    """Extract API key from header"""
    return x_api_key

@app.post("/api/v1/scan", response_model=ScanResponse)
async def scan_contract(
    request: ScanRequest,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Scan a smart contract by address
    """
    try:
        # Check rate limits
        rate_check = rate_limiter.check_rate_limit(x_api_key, 'scan')
        if not rate_check['allowed']:
            raise HTTPException(
                status_code=429,
                detail={
                    "error": "Rate limit exceeded",
                    "tier": rate_check['tier'],
                    "reason": rate_check.get('reason'),
                    "reset_time": rate_check.get('reset_time_hourly')
                }
            )
        
        # Perform comprehensive scan
        scan_results = await scanner.scan_contract(
            address=request.contract_address,
            chain=request.chain,
            contract_type=request.contract_type
        )
        
        # ML predictions if enabled
        ml_predictions = None
        if request.enable_ml:
            try:
                ml_predictions = ml_model.predict_risk(scan_results)
                # Train model on this scan
                ml_model.train_on_scan(scan_results)
            except Exception as e:
                print(f"ML prediction error: {e}")
        
        # Custom rules if enabled
        custom_rule_violations = []
        if request.enable_custom_rules and x_api_key:
            try:
                custom_rule_violations = rule_engine.evaluate_rules(
                    x_api_key,
                    scan_results
                )
            except Exception as e:
                print(f"Custom rule evaluation error: {e}")
        
        # Generate AI explanation
        ai_explanation = await ai_explainer.explain_risks(scan_results)
        
        # Determine risk level
        risk_level = _determine_risk_level(scan_results['safety_score'])
        
        # Generate recommendations
        recommendations = _generate_recommendations(scan_results)
        
        # Save scan for historical tracking
        scan_id = monitor.save_scan(
            request.contract_address,
            request.chain,
            scan_results
        )
        
        # Record usage
        rate_limiter.record_usage(x_api_key)
        
        # Prepare response
        response_data = ScanResponse(
            contract_address=request.contract_address,
            chain=request.chain,
            safety_score=scan_results['safety_score'],
            risk_level=risk_level,
            vulnerabilities=scan_results['vulnerabilities'],
            rug_pull_indicators=scan_results['rug_pull_indicators'],
            gas_optimizations=scan_results.get('gas_optimizations', []),
            ai_explanation=ai_explanation,
            timestamp=datetime.utcnow().isoformat(),
            recommendations=recommendations,
            scan_id=scan_id
        )
        
        # Trigger webhooks
        if x_api_key:
            try:
                await webhook_service.trigger_webhooks(
                    x_api_key,
                    'scan.complete',
                    response_data.dict()
                )
                
                # Trigger high-risk webhook if applicable
                if scan_results['safety_score'] < 50:
                    await webhook_service.trigger_webhooks(
                        x_api_key,
                        'scan.high_risk',
                        response_data.dict()
                    )
            except Exception as e:
                print(f"Webhook error: {e}")
        
        # Add ML predictions and custom rules to response if present
        response_dict = response_data.dict()
        if ml_predictions:
            response_dict['ml_predictions'] = ml_predictions
        if custom_rule_violations:
            response_dict['custom_rule_violations'] = custom_rule_violations
        
        return response_dict
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/upload")
async def upload_contract(file: UploadFile = File(...), chain: str = "ethereum"):
    """
    Upload and scan Solidity source code
    """
    try:
        # Read file content
        content = await file.read()
        solidity_code = content.decode('utf-8')
        
        # Scan the code
        scan_results = await scanner.scan_solidity_code(
            code=solidity_code,
            chain=chain
        )
        
        # Generate AI explanation
        ai_explanation = await ai_explainer.explain_risks(scan_results)
        
        # Determine risk level
        risk_level = _determine_risk_level(scan_results['safety_score'])
        
        # Generate recommendations
        recommendations = _generate_recommendations(scan_results)
        
        # Save scan for historical tracking
        scan_id = monitor.save_scan(
            "uploaded_file",
            chain,
            scan_results
        )
        
        return ScanResponse(
            contract_address="uploaded_file",
            chain=chain,
            safety_score=scan_results['safety_score'],
            risk_level=risk_level,
            vulnerabilities=scan_results['vulnerabilities'],
            rug_pull_indicators=scan_results['rug_pull_indicators'],
            gas_optimizations=scan_results.get('gas_optimizations', []),
            ai_explanation=ai_explanation,
            timestamp=datetime.utcnow().isoformat(),
            recommendations=recommendations,
            scan_id=scan_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/report")
async def generate_pdf_report(scan_data: ScanResponse):
    """
    Generate PDF security report (paid feature)
    """
    try:
        # Convert ScanResponse to dict for PDF generation
        scan_dict = scan_data.dict()
        
        pdf_path = await report_generator.generate_report(
            scan_id=scan_data.contract_address[:10],
            scan_data=scan_dict
        )
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="Report not found")
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"security_report_{scan_data.contract_address[:10]}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


class BatchScanRequest(BaseModel):
    contracts: List[dict]  # [{"address": str, "chain": str}]


@app.post("/api/v1/batch-scan")
async def batch_scan(request: BatchScanRequest):
    """
    Scan multiple contracts in batch
    """
    results = []
    
    for contract in request.contracts:
        try:
            scan_result = await scanner.scan_contract(
                address=contract['address'],
                chain=contract.get('chain', 'ethereum'),
                contract_type=contract.get('contract_type')
            )
            
            ai_explanation = await ai_explainer.explain_risks(scan_result)
            risk_level = _determine_risk_level(scan_result['safety_score'])
            recommendations = _generate_recommendations(scan_result)
            
            scan_id = monitor.save_scan(
                contract['address'],
                contract.get('chain', 'ethereum'),
                scan_result
            )
            
            results.append({
                "contract_address": contract['address'],
                "chain": contract.get('chain', 'ethereum'),
                "safety_score": scan_result['safety_score'],
                "risk_level": risk_level,
                "vulnerabilities": scan_result['vulnerabilities'],
                "rug_pull_indicators": scan_result['rug_pull_indicators'],
                "gas_optimizations": scan_result.get('gas_optimizations', []),
                "ai_explanation": ai_explanation,
                "recommendations": recommendations,
                "scan_id": scan_id,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "contract_address": contract['address'],
                "chain": contract.get('chain', 'ethereum'),
                "status": "error",
                "error": str(e)
            })
    
    return {
        "total": len(request.contracts),
        "successful": len([r for r in results if r.get('status') == 'success']),
        "failed": len([r for r in results if r.get('status') == 'error']),
        "results": results
    }


@app.get("/api/v1/history/{chain}/{contract_address}")
async def get_contract_history(chain: str, contract_address: str):
    """
    Get historical scan data for a contract
    """
    history = monitor.get_contract_history(contract_address, chain)
    return {
        "contract_address": contract_address,
        "chain": chain,
        "total_scans": len(history),
        "history": history
    }


@app.get("/api/v1/trends/{chain}/{contract_address}")
async def get_contract_trends(
    chain: str,
    contract_address: str,
    days: int = 30
):
    """
    Get trends for a contract over specified days
    """
    trends = monitor.get_trends(contract_address, chain, days)
    return trends


@app.post("/api/v1/compare")
async def compare_scans(scan_id_1: str, scan_id_2: str):
    """
    Compare two scans
    """
    comparison = monitor.compare_scans(scan_id_1, scan_id_2)
    return comparison


class SimilarityRequest(BaseModel):
    code: str
    reference_contracts: Optional[List[dict]] = None  # [{"address": str, "code": str, "name": str}]


@app.post("/api/v1/similarity")
async def detect_similarity(request: SimilarityRequest):
    """
    Detect code similarity with known contracts
    """
    if request.reference_contracts:
        matches = similarity_detector.detect_code_reuse(
            request.code,
            request.reference_contracts
        )
    else:
        # Use default known contracts (could be loaded from database)
        matches = []
    
    fingerprint = similarity_detector.generate_code_fingerprint(request.code)
    
    return {
        "fingerprint": fingerprint,
        "matches": matches,
        "total_matches": len(matches)
    }


def _determine_risk_level(score: int) -> str:
    """Determine risk level based on safety score"""
    if score >= 80:
        return "Low Risk"
    elif score >= 50:
        return "Moderate Risk"
    else:
        return "Severe Risk"


def _generate_recommendations(scan_results: dict) -> List[str]:
    """Generate recommendations based on scan results"""
    recommendations = []
    
    for vuln in scan_results.get('vulnerabilities', []):
        if vuln['severity'] == 'high':
            recommendations.append(f"Address {vuln['type']}: {vuln.get('recommendation', 'Review contract security')}")
    
    for indicator in scan_results.get('rug_pull_indicators', []):
        if indicator['risk'] == 'high':
            recommendations.append(f"Warning: {indicator['description']}")
    
    if not recommendations:
        recommendations.append("No critical issues detected. Continue monitoring contract activity.")
    
    return recommendations


# Phase 3 Endpoints - User Accounts

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/v1/auth/register")
async def register_user(request: RegisterRequest):
    """
    Register a new user account
    """
    try:
        result = user_service.create_user(
            request.email,
            request.password,
            request.name
        )
        return {
            "user_id": result['user_id'],
            "api_key": result['api_key'],
            "tier": result['tier'],
            "message": "User created successfully"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/auth/login")
async def login_user(request: LoginRequest):
    """
    Login and get session token
    """
    result = user_service.authenticate_user(request.email, request.password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return result


@app.get("/api/v1/user/profile")
async def get_profile(x_api_key: Optional[str] = Depends(get_api_key)):
    """
    Get user profile
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove sensitive data
    user.pop('password_hash', None)
    return user


class UpdatePreferencesRequest(BaseModel):
    preferences: Dict


@app.put("/api/v1/user/preferences")
async def update_preferences(
    request: UpdatePreferencesRequest,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Update user preferences
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    success = user_service.update_preferences(user['user_id'], request.preferences)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update preferences")
    
    return {"status": "updated"}


@app.get("/api/v1/user/favorites")
async def get_favorites(x_api_key: Optional[str] = Depends(get_api_key)):
    """
    Get favorite contracts
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    favorites = user_service.get_favorite_contracts(user['user_id'])
    return {"favorites": favorites}


@app.post("/api/v1/user/favorites")
async def add_favorite(
    contract_address: str,
    chain: str,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Add contract to favorites
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    success = user_service.add_favorite_contract(user['user_id'], contract_address, chain)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to add favorite")
    
    return {"status": "added"}


@app.get("/api/v1/user/history")
async def get_user_history(
    limit: int = 50,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Get user's scan history
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    history = user_service.get_scan_history(user['user_id'], limit)
    return {"history": history}


# Phase 3 Endpoints - Team Collaboration

class CreateTeamRequest(BaseModel):
    name: str
    description: Optional[str] = None


@app.post("/api/v1/teams")
async def create_team(
    request: CreateTeamRequest,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Create a new team
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    team_id = team_service.create_team(
        user['user_id'],
        request.name,
        request.description
    )
    
    return {"team_id": team_id, "status": "created"}


@app.get("/api/v1/teams")
async def get_teams(x_api_key: Optional[str] = Depends(get_api_key)):
    """
    Get user's teams
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    teams = team_service.get_user_teams(user['user_id'])
    return {"teams": teams}


@app.get("/api/v1/teams/{team_id}")
async def get_team(team_id: str, x_api_key: Optional[str] = Depends(get_api_key)):
    """
    Get team details
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    team = team_service.get_team(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if user is member
    user = user_service.get_user_by_api_key(x_api_key)
    if not user or not any(m['user_id'] == user['user_id'] for m in team['members']):
        raise HTTPException(status_code=403, detail="Not a team member")
    
    return team


class AddMemberRequest(BaseModel):
    user_id: str
    role: str = "member"


@app.post("/api/v1/teams/{team_id}/members")
async def add_team_member(
    team_id: str,
    request: AddMemberRequest,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Add member to team
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    success = team_service.add_member(team_id, request.user_id, request.role)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to add member")
    
    return {"status": "added"}


@app.post("/api/v1/teams/{team_id}/share")
async def share_scan(
    team_id: str,
    scan_id: str,
    contract_address: str,
    chain: str,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Share scan with team
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    success = team_service.share_scan(team_id, scan_id, contract_address, chain, user['user_id'])
    if not success:
        raise HTTPException(status_code=400, detail="Failed to share scan")
    
    return {"status": "shared"}


@app.get("/api/v1/teams/{team_id}/scans")
async def get_team_scans(
    team_id: str,
    limit: int = 50,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Get shared scans for team
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    scans = team_service.get_shared_scans(team_id, limit)
    return {"scans": scans}


# Payment endpoints
class PaymentRequest(BaseModel):
    plan: str  # 'free', 'basic', 'pro', 'enterprise'
    currency: str  # 'NGN', 'USD', 'BTC'
    amount: Optional[float] = None  # Required for enterprise


@app.post("/api/v1/payments/create")
async def create_payment(
    request: PaymentRequest,
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Create a payment intent
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        payment = payment_service.create_payment_intent(
            user_id=user['user_id'],
            plan=request.plan,
            currency=request.currency,
            amount=request.amount
        )
        return payment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/v1/payments/{payment_id}/verify")
async def verify_payment(payment_id: str):
    """
    Verify payment status
    """
    try:
        payment = payment_service.verify_payment(payment_id)
        
        # If payment completed, upgrade user tier
        if payment['status'] == 'completed':
            user_service.upgrade_tier(payment['user_id'], payment['plan'])
        
        return payment
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/api/v1/payments/history")
async def get_payment_history(
    x_api_key: Optional[str] = Depends(get_api_key)
):
    """
    Get user's payment history
    """
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    user = user_service.get_user_by_api_key(x_api_key)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    payments = payment_service.get_payment_history(user['user_id'])
    return {"payments": payments}


# Admin endpoints
@app.post("/api/v1/admin/create")
async def create_admin(
    email: str,
    password: str,
    name: str,
    admin_secret: str = Header(None, alias="X-Admin-Secret")
):
    """
    Create an admin account
    Requires X-Admin-Secret header: pamrae_admin_2025
    """
    # In production, use secure secret from environment
    if admin_secret != "pamrae_admin_2025":
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    try:
        user_data = user_service.create_user(
            email=email,
            password=password,
            name=name,
            tier="enterprise"  # Admins get enterprise tier
        )
        
        # Mark as admin (in production, add role field)
        user = user_service.get_user(user_data['user_id'])
        user['is_admin'] = True
        user['role'] = 'admin'
        
        user_file = user_service.storage_path / f"user_{user_data['user_id']}.json"
        with open(user_file, 'w') as f:
            import json
            json.dump(user, f, indent=2)
        
        return {
            "message": "Admin account created",
            "user_id": user_data['user_id'],
            "api_key": user_data['api_key'],
            "email": email
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


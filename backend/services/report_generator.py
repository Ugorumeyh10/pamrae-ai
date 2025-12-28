from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas
from datetime import datetime
import os
from typing import Dict

class PDFReportGenerator:
    """
    Generate professional PDF security audit reports
    """
    
    def __init__(self):
        self.reports_dir = "reports"
        os.makedirs(self.reports_dir, exist_ok=True)
    
    def _header_footer(self, canvas_obj, doc):
        """Add header and footer to each page"""
        canvas_obj.saveState()
        
        # Header
        canvas_obj.setFillColor(colors.HexColor('#09090b'))
        canvas_obj.rect(0, letter[1] - 60, letter[0], 60, fill=1)
        
        # Header text
        canvas_obj.setFillColor(colors.HexColor('#f59e0b'))
        canvas_obj.setFont("Helvetica-Bold", 20)
        canvas_obj.drawString(40, letter[1] - 35, "Pamrae AI")
        
        canvas_obj.setFillColor(colors.whitesmoke)
        canvas_obj.setFont("Helvetica", 10)
        canvas_obj.drawString(40, letter[1] - 50, "Smart Contract Security Scanner")
        
        # Footer
        canvas_obj.setFillColor(colors.HexColor('#6b7280'))
        canvas_obj.setFont("Helvetica", 8)
        canvas_obj.drawString(40, 30, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        canvas_obj.drawRightString(letter[0] - 40, 30, f"Page {canvas_obj.getPageNumber()}")
        
        canvas_obj.restoreState()
    
    async def generate_report(self, scan_id: str, scan_data: Dict = None) -> str:
        """
        Generate PDF security report with modern design
        """
        filename = f"{self.reports_dir}/security_report_{scan_id}.pdf"
        doc = SimpleDocTemplate(
            filename, 
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=80,
            bottomMargin=50
        )
        story = []
        
        # Custom styles
        styles = getSampleStyleSheet()
        
        # Title style
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#09090b'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Subtitle style
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#6b7280'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        # Section heading style
        heading_style = ParagraphStyle(
            'SectionHeading',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#09090b'),
            spaceAfter=12,
            spaceBefore=20,
            fontName='Helvetica-Bold',
            borderWidth=0,
            borderPadding=0,
            leftIndent=0
        )
        
        # Score style
        score_style = ParagraphStyle(
            'ScoreStyle',
            parent=styles['Heading1'],
            fontSize=48,
            textColor=colors.HexColor('#f59e0b'),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        # Risk level style
        risk_style = ParagraphStyle(
            'RiskStyle',
            parent=styles['Normal'],
            fontSize=16,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        # Body text style
        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#374151'),
            alignment=TA_JUSTIFY,
            leading=14,
            spaceAfter=10
        )
        
        # Title
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("Security Audit Report", title_style))
        story.append(Paragraph("Smart Contract Security Analysis", subtitle_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Contract Information Box
        if scan_data:
            contract_info_data = [
                ["Contract Address", scan_data.get('contract_address', 'N/A')],
                ["Blockchain Network", scan_data.get('chain', 'N/A').upper()],
                ["Report Date", datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")]
            ]
            
            contract_table = Table(contract_info_data, colWidths=[2*inch, 4.5*inch])
            contract_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f9fafb')),
                ('BACKGROUND', (1, 0), (1, -1), colors.white),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#374151')),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb'))
            ]))
            story.append(contract_table)
            story.append(Spacer(1, 0.4*inch))
        
        # Safety Score Card
        if scan_data:
            safety_score = scan_data.get('safety_score', 0)
            
            # Determine score color
            if safety_score >= 80:
                score_color = colors.HexColor('#10b981')  # Green
                score_bg = colors.HexColor('#d1fae5')
            elif safety_score >= 50:
                score_color = colors.HexColor('#f59e0b')  # Yellow/Amber
                score_bg = colors.HexColor('#fef3c7')
            else:
                score_color = colors.HexColor('#ef4444')  # Red
                score_bg = colors.HexColor('#fee2e2')
            
            score_style_dynamic = ParagraphStyle(
                'ScoreStyleDynamic',
                parent=score_style,
                textColor=score_color
            )
            
            score_box_data = [
                [Paragraph(f"{safety_score}", score_style_dynamic)],
                [Paragraph(f"Safety Score / 100", risk_style)],
                [Paragraph(f"{scan_data.get('risk_level', 'Unknown Risk')}", risk_style)]
            ]
            
            score_table = Table(score_box_data, colWidths=[6.5*inch])
            score_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), score_bg),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
                ('TOPPADDING', (0, 0), (-1, -1), 15),
                ('LEFTPADDING', (0, 0), (-1, -1), 20),
                ('RIGHTPADDING', (0, 0), (-1, -1), 20),
                ('ROWBACKGROUNDS', (0, 0), (-1, -1), [score_bg, score_bg, score_bg])
            ]))
            story.append(score_table)
            story.append(Spacer(1, 0.4*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        summary_text = f"""
        This comprehensive security audit report analyzes the smart contract deployed at address 
        <b>{scan_data.get('contract_address', 'N/A') if scan_data else 'N/A'}</b> on the 
        <b>{scan_data.get('chain', 'N/A').upper() if scan_data else 'N/A'}</b> blockchain network.
        
        The contract has been analyzed using advanced AI-powered security scanning technology to identify 
        vulnerabilities, rug-pull patterns, and potential security risks. The analysis includes pattern 
        detection, code analysis, and risk assessment based on industry best practices.
        """
        story.append(Paragraph(summary_text, body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Key Findings Summary
        if scan_data:
            vuln_count = len(scan_data.get('vulnerabilities', []))
            rug_count = len(scan_data.get('rug_pull_indicators', []))
            
            findings_data = [
                ["Total Vulnerabilities Found", str(vuln_count)],
                ["Rug-Pull Indicators", str(rug_count)],
                ["Overall Risk Level", scan_data.get('risk_level', 'N/A')]
            ]
            
            findings_table = Table(findings_data, colWidths=[4*inch, 2.5*inch])
            findings_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#09090b')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.HexColor('#374151')),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f9fafb')),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb'))
            ]))
            story.append(findings_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Vulnerabilities Section
        if scan_data and scan_data.get('vulnerabilities'):
            story.append(PageBreak())
            story.append(Paragraph("Security Vulnerabilities", heading_style))
            
            vuln_data = [["Type", "Severity", "Description"]]
            for vuln in scan_data['vulnerabilities']:
                severity = vuln.get('severity', 'low').upper()
                vuln_data.append([
                    vuln.get('type', 'Unknown'),
                    severity,
                    vuln.get('description', 'No description available')
                ])
            
            vuln_table = Table(vuln_data, colWidths=[1.8*inch, 1*inch, 3.7*inch])
            vuln_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#ef4444')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('TOPPADDING', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
            ]))
            story.append(vuln_table)
            story.append(Spacer(1, 0.3*inch))
            
            # Add recommendations for vulnerabilities
            story.append(Paragraph("Vulnerability Remediation", ParagraphStyle(
                'SubHeading',
                parent=heading_style,
                fontSize=14
            )))
            for i, vuln in enumerate(scan_data['vulnerabilities'][:5], 1):  # Limit to first 5
                if vuln.get('recommendation'):
                    rec_text = f"<b>{vuln.get('type', 'Vulnerability')}:</b> {vuln.get('recommendation')}"
                    story.append(Paragraph(rec_text, body_style))
                    story.append(Spacer(1, 0.1*inch))
        
        # Rug-Pull Indicators Section
        if scan_data and scan_data.get('rug_pull_indicators'):
            story.append(Paragraph("Rug-Pull Risk Indicators", heading_style))
            
            rug_data = [["Indicator Type", "Risk Level", "Description"]]
            for indicator in scan_data['rug_pull_indicators']:
                risk = indicator.get('risk', 'low').upper()
                rug_data.append([
                    indicator.get('type', 'Unknown'),
                    risk,
                    indicator.get('description', 'No description available')
                ])
            
            rug_table = Table(rug_data, colWidths=[1.8*inch, 1*inch, 3.7*inch])
            rug_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('TOPPADDING', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
                ('TOPPADDING', (0, 1), (-1, -1), 8),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')])
            ]))
            story.append(rug_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Recommendations Section
        if scan_data and scan_data.get('recommendations'):
            story.append(Paragraph("Recommendations", heading_style))
            rec_style = ParagraphStyle(
                'RecommendationStyle',
                parent=body_style,
                leftIndent=20,
                bulletIndent=10
            )
            for i, rec in enumerate(scan_data['recommendations'], 1):
                story.append(Paragraph(f"<b>{i}.</b> {rec}", rec_style))
                story.append(Spacer(1, 0.15*inch))
        
        # AI Explanation Section
        if scan_data and scan_data.get('ai_explanation'):
            story.append(PageBreak())
            story.append(Paragraph("AI-Generated Risk Analysis", heading_style))
            
            explanation_style = ParagraphStyle(
                'ExplanationStyle',
                parent=body_style,
                fontSize=10,
                leading=16,
                backColor=colors.HexColor('#f9fafb'),
                borderWidth=1,
                borderColor=colors.HexColor('#e5e7eb'),
                borderPadding=15
            )
            story.append(Paragraph(scan_data['ai_explanation'].replace('\n', '<br/>'), explanation_style))
            story.append(Spacer(1, 0.3*inch))
        
        # Gas Optimizations (if available)
        if scan_data and scan_data.get('gas_optimizations'):
            story.append(Paragraph("Gas Optimization Opportunities", heading_style))
            gas_data = [["Optimization Type", "Severity", "Description"]]
            for opt in scan_data['gas_optimizations']:
                gas_data.append([
                    opt.get('type', 'Unknown'),
                    opt.get('severity', 'info').upper(),
                    opt.get('description', 'No description available')
                ])
            
            gas_table = Table(gas_data, colWidths=[1.8*inch, 1*inch, 3.7*inch])
            gas_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('LEFTPADDING', (0, 0), (-1, -1), 10),
                ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb'))
            ]))
            story.append(gas_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Footer Disclaimer
        story.append(Spacer(1, 0.4*inch))
        disclaimer_style = ParagraphStyle(
            'DisclaimerStyle',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            fontName='Helvetica-Oblique',
            borderWidth=1,
            borderColor=colors.HexColor('#e5e7eb'),
            borderPadding=12,
            backColor=colors.HexColor('#f9fafb')
        )
        disclaimer_text = """
        <b>Important Disclaimer:</b> This report was generated by Pamrae AI's automated security scanning system. 
        While our AI-powered analysis is comprehensive, this report should not be considered a substitute for a 
        professional security audit conducted by certified auditors. Always conduct your own research (DYOR) before 
        interacting with or investing in smart contracts. Pamrae AI is not responsible for any losses incurred 
        from interacting with audited contracts.
        """
        story.append(Paragraph(disclaimer_text, disclaimer_style))
        
        # Build PDF with header/footer
        doc.build(story, onFirstPage=self._header_footer, onLaterPages=self._header_footer)
        return filename

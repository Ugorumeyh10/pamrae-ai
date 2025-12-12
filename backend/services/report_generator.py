from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
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
    
    async def generate_report(self, scan_id: str, scan_data: Dict = None) -> str:
        """
        Generate PDF security report
        """
        filename = f"{self.reports_dir}/security_report_{scan_id}.pdf"
        doc = SimpleDocTemplate(filename, pagesize=letter)
        story = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a1a1a'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=12
        )
        
        # Title
        story.append(Paragraph("Smart Contract Security Audit Report", title_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Report metadata
        if scan_data:
            metadata = [
                ["Contract Address:", scan_data.get('contract_address', 'N/A')],
                ["Blockchain:", scan_data.get('chain', 'N/A').upper()],
                ["Safety Score:", f"{scan_data.get('safety_score', 0)}/100"],
                ["Risk Level:", scan_data.get('risk_level', 'N/A')],
                ["Report Date:", datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")]
            ]
            
            metadata_table = Table(metadata, colWidths=[2*inch, 4*inch])
            metadata_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey)
            ]))
            story.append(metadata_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Executive Summary
        story.append(Paragraph("Executive Summary", heading_style))
        summary_text = f"""
        This security audit report provides a comprehensive analysis of the smart contract at address 
        {scan_data.get('contract_address', 'N/A') if scan_data else 'N/A'}. The contract has been analyzed 
        for common vulnerabilities, rug-pull patterns, and security best practices.
        
        <b>Safety Score: {scan_data.get('safety_score', 0)}/100</b> - {scan_data.get('risk_level', 'Unknown Risk') if scan_data else 'Unknown Risk'}
        """
        story.append(Paragraph(summary_text, styles['Normal']))
        story.append(Spacer(1, 0.2*inch))
        
        # Vulnerabilities Section
        if scan_data and scan_data.get('vulnerabilities'):
            story.append(PageBreak())
            story.append(Paragraph("Security Vulnerabilities", heading_style))
            
            vuln_data = [["Type", "Severity", "Description"]]
            for vuln in scan_data['vulnerabilities']:
                severity_color = {
                    'high': colors.red,
                    'medium': colors.orange,
                    'low': colors.yellow
                }.get(vuln.get('severity', 'low'), colors.grey)
                
                vuln_data.append([
                    vuln.get('type', 'Unknown'),
                    vuln.get('severity', 'unknown').upper(),
                    vuln.get('description', 'No description')
                ])
            
            vuln_table = Table(vuln_data, colWidths=[1.5*inch, 1*inch, 3.5*inch])
            vuln_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
            ]))
            story.append(vuln_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Rug-Pull Indicators Section
        if scan_data and scan_data.get('rug_pull_indicators'):
            story.append(Paragraph("Rug-Pull Risk Indicators", heading_style))
            
            rug_data = [["Indicator", "Risk Level", "Description"]]
            for indicator in scan_data['rug_pull_indicators']:
                rug_data.append([
                    indicator.get('type', 'Unknown'),
                    indicator.get('risk', 'unknown').upper(),
                    indicator.get('description', 'No description')
                ])
            
            rug_table = Table(rug_data, colWidths=[1.5*inch, 1*inch, 3.5*inch])
            rug_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')])
            ]))
            story.append(rug_table)
            story.append(Spacer(1, 0.3*inch))
        
        # Recommendations Section
        if scan_data and scan_data.get('recommendations'):
            story.append(Paragraph("Recommendations", heading_style))
            for i, rec in enumerate(scan_data['recommendations'], 1):
                story.append(Paragraph(f"{i}. {rec}", styles['Normal']))
                story.append(Spacer(1, 0.1*inch))
        
        # AI Explanation Section
        if scan_data and scan_data.get('ai_explanation'):
            story.append(PageBreak())
            story.append(Paragraph("AI-Generated Risk Analysis", heading_style))
            story.append(Paragraph(scan_data['ai_explanation'].replace('\n', '<br/>'), styles['Normal']))
        
        # Footer
        story.append(Spacer(1, 0.5*inch))
        footer_text = """
        <i>This report was generated by AI Smart Contract Threat Scanner. 
        This is an automated analysis and should not be considered a substitute for a professional security audit. 
        Always conduct your own research (DYOR) before interacting with smart contracts.</i>
        """
        story.append(Paragraph(footer_text, styles['Italic']))
        
        # Build PDF
        doc.build(story)
        return filename


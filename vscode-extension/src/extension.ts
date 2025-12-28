import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
    console.log('Contract Security Scanner extension activated');

    // Register scan command
    const scanCommand = vscode.commands.registerCommand('contractScanner.scan', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'solidity') {
            vscode.window.showErrorMessage('Current file is not a Solidity file');
            return;
        }

        await scanDocument(document);
    });

    // Register scan file command
    const scanFileCommand = vscode.commands.registerCommand('contractScanner.scanFile', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }

        await scanDocument(editor.document);
    });

    context.subscriptions.push(scanCommand, scanFileCommand);
}

async function scanDocument(document: vscode.TextEditor) {
    const config = vscode.workspace.getConfiguration('contractScanner');
    const apiUrl = config.get<string>('apiUrl', 'http://localhost:8000');
    const apiKey = config.get<string>('apiKey', '');

    const code = document.getText();

    vscode.window.showInformationMessage('Scanning contract...');

    try {
        const headers: any = {
            'Content-Type': 'multipart/form-data'
        };

        if (apiKey) {
            headers['X-API-Key'] = apiKey;
        }

        const formData = new FormData();
        const blob = new Blob([code], { type: 'text/plain' });
        formData.append('file', blob, document.fileName);
        formData.append('chain', 'ethereum');

        const response = await axios.post(`${apiUrl}/api/v1/upload`, formData, { headers });

        const result = response.data;
        displayResults(result, document);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Scan failed: ${error.message}`);
    }
}

function displayResults(result: any, document: vscode.TextEditor) {
    const panel = vscode.window.createWebviewPanel(
        'contractScanner',
        'Security Scan Results',
        vscode.ViewColumn.Beside,
        {}
    );

    const scoreColor = result.safety_score >= 80 ? 'green' : result.safety_score >= 50 ? 'orange' : 'red';

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
                .score { text-align: center; padding: 20px; border: 3px solid ${scoreColor}; border-radius: 12px; margin: 20px 0; }
                .score-value { font-size: 48px; font-weight: bold; }
                .vuln-item { background: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ffc107; }
            </style>
        </head>
        <body>
            <h1>Security Scan Results</h1>
            <div class="score">
                <div class="score-value">${result.safety_score}</div>
                <div>Safety Score</div>
                <div>${result.risk_level}</div>
            </div>
            <h2>Vulnerabilities (${result.vulnerabilities.length})</h2>
            ${result.vulnerabilities.map((v: any) => `
                <div class="vuln-item">
                    <strong>${v.type}</strong> (${v.severity})
                    <p>${v.description}</p>
                </div>
            `).join('')}
            <h2>Rug-Pull Indicators (${result.rug_pull_indicators.length})</h2>
            ${result.rug_pull_indicators.map((r: any) => `
                <div class="vuln-item">
                    <strong>${r.type}</strong> (${r.risk})
                    <p>${r.description}</p>
                </div>
            `).join('')}
        </body>
        </html>
    `;
}

export function deactivate() {}



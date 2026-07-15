---
name: strix
description: Use Strix, the open-source AI penetration testing tool, to find and fix vulnerabilities in applications. Use when the user wants to run a security assessment, penetration test, vulnerability scan, or security audit on a codebase, web application, or API.
allowed-tools: AskUserQuestion, Bash, Read, Write, Skill
---

# strix

Strix is an autonomous AI penetration testing tool that acts like a real hacker — it runs code dynamically, finds vulnerabilities, and validates them through actual proof-of-concept exploits. This skill guides you through installing, configuring, and running Strix against a target, then interpreting the results.

## Quick Reference

| Action | Command |
|---|---|
| Install (pip) | `pip install strix-agent` |
| Install (curl) | `curl -sSL https://strix.ai/install \| bash` |
| Basic scan | `strix -t <target>` |
| Quick CI scan | `strix -n -t ./ --scan-mode quick` |
| Authenticated scan | `strix -t <url> --instruction "Use creds: user:pass"` |
| Multi-target | `strix -t <target1> -t <target2>` |
| Non-interactive | `strix -n -t <target>` |
| Diff-scope PR scan | `strix -n -t ./ --scan-mode quick --scope-mode diff` |

## Prerequisites

- **Docker** must be installed and running (Strix uses Docker for its sandbox)
- An **LLM API key** from a supported provider (OpenAI, Anthropic, Google, etc.)
- Network access to pull the sandbox Docker image on first run
- **Python 3.11+** if installing via pip

## Installation Instructions

Before running any command, check which OS the user is on. If it's Windows, translate the shell syntax to PowerShell.

### Option A: pip install (recommended if Python is available)

```bash
pip install strix-agent
```

Verify:
```bash
strix --version
```

### Option B: curl install (standalone binary)

**macOS / Linux:**
```bash
curl -sSL https://strix.ai/install | bash
```

**Windows (PowerShell):**
```powershell
curl -sSL https://strix.ai/install -o install.ps1
powershell -ExecutionPolicy Bypass -File install.ps1
```

Then verify:
```bash
strix --version
```

## Configuration

Strix needs an LLM provider to power its AI pentesting agents. Configure via environment variables:

### Required
```bash
# Set the LLM model (required)
export STRIX_LLM="openai/gpt-5.4"

# Set the API key (required)
export LLM_API_KEY="sk-your-api-key"
```

### Optional
```bash
# Custom API base URL (for local/Ollama/LMStudio endpoints)
export LLM_API_BASE="https://your-api-base-url.com/v1"

# Perplexity API key for research capabilities
export PERPLEXITY_API_KEY="your-api-key"

# Reasoning effort (default: high, quick scan: medium)
export STRIX_REASONING_EFFORT="high"
```

> **Note:** Strix automatically saves configuration to `~/.strix/cli-config.json` after the first run, so the user won't need to re-enter it every time.

### Recommended Models

| Provider | Model String | Best For |
|---|---|---|
| OpenAI | `openai/gpt-5.4` | General pentesting |
| Anthropic | `anthropic/claude-sonnet-4-6` | Code analysis |
| Google | `vertex_ai/gemini-3-pro-preview` | Web app testing |

Full list of supported providers: https://docs.strix.ai/llm-providers/overview

## Usage Instructions

### 1. Understand the Target

First, ask the user what they want to test:
- A local codebase (provide path)
- A GitHub repository (provide URL)
- A deployed web application (provide URL)
- An API endpoint (provide URL)

Also ask about:
- Any authentication credentials needed
- Scope limitations (what's in/out of bounds)
- The type of testing (full pentest vs quick vulnerability scan)

### 2. Select Scan Mode

Choose the appropriate scan mode based on context:

| Mode | Flag | When to Use |
|---|---|---|
| **Standard** | *(default)* | Full pentest against a codebase or web app |
| **Quick** | `--scan-mode quick` | CI/CD, PR reviews, fast feedback |
| **Focus** | `--instruction "..."` | Targeted testing (specific vuln classes) |

### 3. Run the Scan

**Basic codebase scan:**
```bash
strix --target /path/to/app
```

**Web application black-box test:**
```bash
strix --target https://example.com
```

**GitHub repository review:**
```bash
strix --target https://github.com/org/repo
```

**Authenticated grey-box test:**
```bash
strix --target https://app.com --instruction "Authenticated testing using test@example.com / TestPass123!"
```

**Focused testing with custom instructions:**
```bash
strix --target ./api --instruction "Focus on SSRF, IDOR, and rate limiting bypass"
```

**Multi-target assessment:**
```bash
strix --target https://github.com/org/app --target https://app.example.com
```

**Targets from a file:**
```bash
strix --target-list ./targets.txt
```

### 4. Non-Interactive Mode (CI / Automation)

For server environments and automated pipelines where there is no interactive terminal:

```bash
strix --non-interactive --target https://your-app.com
```

In non-interactive mode:
- Results print to stdout in real-time
- Final report is printed before exit
- Exit code is non-zero when vulnerabilities are found
- No interactive UI is shown

### 5. CI/CD Integration (GitHub Actions)

For automated scanning on pull requests:

```yaml
name: strix-penetration-test

on:
  pull_request:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - name: Install Strix
        run: curl -sSL https://strix.ai/install | bash
      - name: Run Strix
        env:
          STRIX_LLM: ${{ secrets.STRIX_LLM }}
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
        run: strix -n -t ./ --scan-mode quick
```

> In CI PR runs, Strix automatically scopes quick reviews to changed files. If diff-scope fails, ensure checkout uses `fetch-depth: 0` or pass `--diff-base` explicitly.

### 6. Interpreting Results

Strix outputs findings in a structured format. Each finding typically includes:

| Field | Description |
|---|---|
| **Vulnerability** | Name and type (e.g., SQL Injection, XSS, IDOR) |
| **CVSS Score** | Severity rating (Critical/High/Medium/Low) |
| **OWASP Category** | OWASP Top 10 classification |
| **Location** | File, endpoint, or component affected |
| **Description** | How the vulnerability manifests |
| **PoC** | Proof-of-concept exploit or reproduction steps |
| **Remediation** | Recommended fix or mitigation |
| **References** | Links to relevant CWE/CVE entries |

Results are saved to `strix_runs/<run-name>/` in the working directory.

### 7. Generating Reports

Ask the user if they want:
- A **summary report** (Markdown) with key findings and severity breakdown
- A **detailed pentest report** (Markdown or PDF) suitable for compliance (SOC 2, ISO 27001, PCI DSS)
- **Remediation guidance** — AI-generated patches or configuration fixes
- Results exported for **Jira, Linear, or Slack** integration

Generate a summary from the run output:

```bash
Bash("cat strix_runs/<run-name>/report.json")
```

Then format into a readable report for the user.

### 8. Autofix (when vulnerabilities are found)

If Strix identified fixable vulnerabilities, ask the user if they want:
1. AI-generated patches for each finding
2. A multi-remediation PR with all fixes
3. A detailed remediation plan with manual steps

Strix can generate patches as ready-to-merge pull requests for GitHub repositories.

## Best Practices

### Scope and Authorization

⚠️ **Only test applications you own or have explicit permission to test.** Strix performs active exploitation — it sends payloads, attempts SQL injection, and exercises attack vectors. The user is responsible for using Strix ethically and legally.

### Scan Performance

- **Quick mode** (`--scan-mode quick`) is ideal for CI/CD — it runs faster but covers less depth
- **Standard mode** is thorough but takes longer
- For large codebases, consider targeting specific directories or endpoints
- Multi-target scans run in parallel (agent team orchestration)

### First Run

The first run automatically pulls the Strix sandbox Docker image, which may take a few minutes depending on network speed. Inform the user about this.

### Configuration Persistence

Strix saves config to `~/.strix/cli-config.json`. If the user plans to run Strix regularly, suggest they set the environment variables in their shell profile (`.bashrc`, `.zshrc`, or PowerShell profile).

## Troubleshooting

| Issue | Likely Cause | Fix |
|---|---|---|
| `docker: command not found` | Docker not installed | Install Docker Desktop / Docker Engine |
| `LLM_API_KEY not set` | Missing API key env var | Set `LLM_API_KEY` |
| Sandbox pull fails | Network issue / Docker not running | Check Docker is running, check proxy settings |
| Scan hangs | Large codebase / slow LLM | Use `--scan-mode quick`, reduce target scope |
| No vulnerabilities found | Secure app, or limited LLM capability | Try with a different model provider, increase `STRIX_REASONING_EFFORT` |
| Exit code non-zero | Vulnerabilities were found | This is expected — review results |

## Further Reading

- **Documentation:** https://docs.strix.ai
- **LLM Providers:** https://docs.strix.ai/llm-providers/overview
- **GitHub:** https://github.com/usestrix/strix
- **Website:** https://strix.ai

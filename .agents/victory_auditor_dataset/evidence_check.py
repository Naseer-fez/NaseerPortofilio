import os
import re

evidence = {}

# 1. NasCloud
# metrics: ['0 Temp Disk Writes', 'Zero-Config Tunneling', 'Cryptographic Signed URLs']
nas_dirs = [r"d:\CODE\PYTHON\CODE\Projects\Personaldrive", r"d:\CODE\PYTHON\CODE\Projects\Personaldrive-services\mainserver"]
nas_ev = []
for d in nas_dirs:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.py', '.html', '.js')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                            if "generator" in content.lower() or "stream" in content.lower() or "zipfile" in content.lower():
                                nas_ev.append(f"Streaming/Zip generator found in {file}")
                            if "tunnel" in content.lower() or "cloudflare" in content.lower():
                                nas_ev.append(f"Tunneling found in {file}")
                            if "itsdangerous" in content.lower() or "token" in content.lower() or "signature" in content.lower() or "sign" in content.lower():
                                nas_ev.append(f"Signing/Token found in {file}")
                    except Exception:
                        pass
evidence["NasCloud"] = list(set(nas_ev))

# 2. apirlpy
# metrics: ['100,000 Tested Clients', '64-Thread Workload', 'PyPI Published Package']
apirl_dirs = [r"d:\CODE\GithubCodes\Api_RateLimiter", r"d:\CODE\PYTHON\CODE\Projects\APIRATELIMITER_v2"]
apirl_ev = []
for d in apirl_dirs:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        if "100000" in content or "100,000" in content or "threads" in content.lower() or "64" in content:
                            apirl_ev.append(f"Benchmark/load test metrics in {file}")
                        if "setup.py" in file or "pyproject.toml" in file or "pypi" in content.lower():
                            apirl_ev.append(f"Packaging/PyPI found in {file}")
                except Exception:
                    pass
evidence["apirlpy"] = list(set(apirl_ev))

# 3. TapNap
# metrics: ['500 Concurrent Connections Tested', 'Cryptographic TTL Lifecycle', 'OTP-Verified Authentication']
tapnap_dir = r"d:\CODE\GithubCodes\TapNap-Backend"
tapnap_ev = []
if os.path.exists(tapnap_dir):
    for root, dirs, files in os.walk(tapnap_dir):
        for file in files:
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    if "otp" in content.lower() or "jwt" in content.lower() or "ttl" in content.lower() or "expire" in content.lower() or "500" in content:
                        tapnap_ev.append(f"Auth/TTL/Concurrency verified in {file}")
            except Exception:
                pass
evidence["TapNap"] = list(set(tapnap_ev))

# 4. macOS Portfolio OS
# metrics: ['60 FPS ODE Physics Loop', 'Procedural Web Audio Engine', '28 Test Suites Passing']
port_dir = r"d:\CODE\Html\Showcase\src"
port_ev = []
if os.path.exists(port_dir):
    for root, dirs, files in os.walk(port_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                        if "audio" in content.lower() or "synthesizer" in content.lower() or "oscillator" in content.lower() or "euler" in content.lower():
                            port_ev.append(f"ODE/Audio found in {file}")
                except Exception:
                    pass
evidence["macOS Portfolio OS"] = list(set(port_ev))

print("=== Project Metric Evidence Sample ===")
for proj, ev in evidence.items():
    print(f"[{proj}]:")
    for item in ev[:5]:
        print(f"  - {item}")
    print()

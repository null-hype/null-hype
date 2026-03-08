# SECURITY.md

## You are seeing traffic from my automated agents.

This is expected. Please read the following before escalating.

---

### 0x00: Who is doing this?

This infrastructure belongs to the **null-hype** ($H_0$) research project based in Sydney, APAC.

All scanning and network activity originates from automated agents running as part of an ongoing, non-commercial vulnerability research programme.

---

### 0x01: What are the agents doing?

The agents perform:
- **Passive reconnaissance:** DNS enumeration, banner grabbing, port scanning
- **Vulnerability assessment:** CVE validation against exposed services
- **Web surface auditing:** HTTP crawling, header analysis, exposed endpoint enumeration

All activity is intended to be **non-destructive and read-only**. The agents do not:
- Exploit or weaponise vulnerabilities
- Exfiltrate data
- Persist on any scanned system
- Attempt authentication brute-force

---

### 0x02: Opt-Out

If you operate the IP range or asset being scanned and wish to be excluded from future scans, send an email to:

```
security [at] null-hype [dot] net
```

Include the relevant IP range(s) or ASN in CIDR notation. Exclusions are processed within **72 hours** and are permanent.

---

### 0x03: Responsible Disclosure

If you have identified a vulnerability in assets controlled by this project, please disclose responsibly:

1. **Do not** publish or share details publicly before notifying us.
2. Email: `security [at] null-hype [dot] net`
3. PGP key available on request.
4. We aim to acknowledge receipt within **48 hours** and resolve within **90 days**.

We operate under a **good-faith principle**: researchers who follow this process will not face legal action.

---

### 0x04: Legality

All scanning activity is conducted in accordance with applicable law. Targets are either:
- Publicly exposed services with no access restrictions
- Systems for which explicit written authorisation has been obtained

If you believe scanning activity has exceeded these bounds, contact us immediately using the details above.

---

### 0x05: The Null Hypothesis

> The null hypothesis ($H_0$): the system is insecure by default.

We scan to disprove $H_0$. We report findings to asset owners. We do not hype the results.

---

*Last updated: 2026-03-08*

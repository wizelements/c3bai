# Cod3BlackAgency — Intelligent Environment Automation Pilot

**Status:** PILOT / qualification-only  
**Channel:** Cod3BlackAgency / c3bai  
**Primary runtime:** OPEE / OpenClaw-compatible orchestration  
**External adapter target:** Google Home MCP Early Access  
**Commercial rule:** Do not represent Google Home MCP access or unsupported device actions as generally available.

## Objective

Sell governed automation for homes, properties, and suitable small-business environments where reliable observation, policy-gated action, verification, and monitoring have clear operational value.

This is **not** a generic smart-home installation service. The differentiator is governed agent execution:

**observe → reason → policy check → approval when required → execute → verify → evidence**

## Initial customer profiles

Prioritize use cases where automation protects revenue, reduces repeated labor, or prevents operational misses:

- short-term rental / property operations
- small retail or office opening/closing checks
- environmental and equipment-state monitoring
- family/property monitoring with explicit consent
- multi-location owner/operator workflows
- businesses already using Google Home-compatible devices and needing structured automation

## Pilot offer

### 1. Environment Automation Readiness Audit — $500

Deliverables:

- inventory of supported devices and current automations
- network/account/access readiness review
- workflow opportunity map
- risk classification for proposed actions
- approval-policy design
- event/history availability assessment
- OPEE/OpenClaw integration feasibility
- 30-day implementation roadmap

The audit is read-only unless the customer separately authorizes controlled testing.

### 2. Governed Automation Implementation — from $1,500

Quoted from the audit. Typical scope:

- connect approved external adapter(s)
- define device/action allowlists
- build observation and event workflows
- implement approval gates
- implement execution verification
- evidence logging
- alerts and escalation
- dashboard/reporting integration where useful

Hardware, vendor subscriptions, electrician/installer work, and third-party fees are excluded unless explicitly quoted.

### 3. Managed Environment AgentOps — from $250/mo

Candidate recurring scope:

- adapter health
- workflow failures
- automation drift
- permission/policy drift
- failed or unverified actions
- scheduled operational checks
- evidence retention/summary
- monthly optimization review

Do not promise 24/7 human response unless separately contracted.

## Safety boundary

The pilot must fail closed.

Do not automate or market unsupported high-risk actions, including:

- unlocking exterior doors unless the upstream platform explicitly supports it and an approved policy exists
- disabling life-safety systems
- bypassing alarms or security controls
- actions affecting gas, fire suppression, medical devices, or other life-safety systems
- surveillance without lawful notice/consent
- unrestricted autonomous purchases

High-impact actions require explicit approval policy, audit evidence, and platform support.

## Product architecture

Keep the commercial product runtime-neutral:

```text
Customer workflow
      ↓
Cod3Black/OPEE policy layer
      ↓
Adapter interface
      ↓
Google Home MCP / future providers
      ↓
Physical device or event
      ↓
Verification + evidence
```

The core workflow must not depend on Google-specific semantics. Provider-specific behavior belongs in the adapter.

## Revenue progression

1. Sell the $500 readiness audit only to qualified prospects.
2. Use the audit to identify a bounded implementation.
3. Convert successful implementations into Managed Environment AgentOps.
4. Extract repeated checks/actions into reusable MCP/Skill capabilities.
5. Productize only after repeated paid demand.

## Qualification gate

Before accepting a pilot customer, verify:

- customer controls the relevant property/account
- supported devices are present
- Google Home MCP access is available to the customer/operator where required
- requested actions are technically supported
- required permissions and consent exist
- there is a measurable operational outcome
- a safe manual fallback exists

## Success metrics

Track:

- paid audits
- audit → implementation conversion
- implementation revenue
- recurring AgentOps revenue
- number of reusable workflows created
- manual hours eliminated or operational incidents prevented where measurable
- workflow success / verified execution rate

Do not fabricate savings or ROI.

## Current decision

This offer is approved for **pilot qualification and capability development**, not broad public claims of general availability.

The current primary Cod3Black revenue path remains the OpenClaw Command Center Audit. Intelligent Environment Automation is an adjacent higher-value service line that should reuse OPEE governance and AgentOps infrastructure rather than create a separate platform.

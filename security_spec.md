# Security Specification: IPL Auction Engine

This document outlines the Zero-Trust security rules, data invariants, and defensive validation assertions governing the IPL Auction Firestore collections.

## 1. Zero-Trust Data Invariants

1. **Purse Constraint**: Any franchise's cumulative spend on drafted players `sum(draftedPlayerValue)` must NOT exceed their allocated starting budget (e.g., ₹100 Crore / 10000 Lakhs).
2. **Category Count Ceiling**: A franchise cannot buy more players of a specific category than the configured roster limit (e.g., maximum 5 Batsmen, 5 Bowlers, 1 Wicketkeeper, 3 All-Rounders).
3. **Auction Flow Isolation**: Only the room's host or an active player is permitted to interact. Non-members cannot view private elements (like signaling channels).
4. **Temporal Ticking**: Timer expiration (`timerExpiresAt`) must be set via high-precision servers, or validated against active bounds.
5. **Bid Increments**: Every new bid must be higher than the previous bid by the category increment minimum (e.g., + ₹10 Lakhs, + ₹20 Lakhs, or + ₹50 Lakhs depending on the bidding range).
6. **No Retroactive Gaps**: Sold transactions logged inside `logs` are immutable once sealed.
7. **Identity Match**: Message authors, bid buyers, and signal senders must have ID fields matching `request.auth.uid`.

---

## 2. The "Dirty Dozen" Attack Payloads

Below are the 12 malicious payloads seeking to breach the integrity of the active sports ledger.

### Payload 1: Infinite Purse Spoofing (Budget Theft)
An attacker attempts to set their remaining budget to an arbitrarily large value.
```json
{
  "members": {
    "attacker_uid": {
      "budget": 99999999,
      "name": "Attacker Franchise",
      "slots": {}
    }
  }
}
```
*   **Result**: `PERMISSION_DENIED` (State mutations verified against mathematical ledger invariants).

### Payload 2: Ghost Field Privilege Escalation (Shadow Admin Entry)
An attacker attempts to inject a shadow admin key inside their user profile.
```json
{
  "id": "attacker_uid",
  "isAdmin": true,
  "role": "admin"
}
```
*   **Result**: `PERMISSION_DENIED` (Strict affected keys matching forbid shadow headers).

### Payload 3: Retroactive Bid Hijacking
A user tries to overwrite a previous historic log transaction to transfer a top-tier player (e.g., Virat Kohli) to their franchise for ₹20 Lakhs.
```json
{
  "id": "saved_log_id",
  "type": "sold",
  "buyerId": "attacker_uid",
  "playerId": "virat_kohli",
  "amount": 20
}
```
*   **Result**: `PERMISSION_DENIED` (Logs collection is strictly write-once, delete-deny, read-all members).

### Payload 4: Invalid Format Path Poisoning
An attacker attempts to write signaling payloads under malicious ID format tags like `../../hacks`.
*   **Result**: `PERMISSION_DENIED` (IDs enforced with regex matches `^[a-zA-Z0-9_\-]+$`).

### Payload 5: Negative Bid Theft
An attacker attempts to place a bidding offer with a NEGATIVE value to drain opponents or reset prices.
```json
{
  "currentBid": -500,
  "currentBidderId": "attacker_uid"
}
```
*   **Result**: `PERMISSION_DENIED` (Inbound bid numeric checks `currentBid > existing().currentBid`).

### Payload 6: Roster Over-Draft Constraint Exploit
An attacker attempts to buy an 8th batsman when the room's config restricts the roster slots to 5 maximum.
```json
{
  "members": {
    "attacker_uid": {
      "slots": {
        "BAT": ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]
      }
    }
  }
}
```
*   **Result**: `PERMISSION_DENIED` (Validation blocks array size exceeds configured limit).

### Payload 7: Fake Clock Injection (Premature Timer Reset)
An attacker attempts to force-expire an active bid timer to immediately win a player.
```json
{
  "timerExpiresAt": 0
}
```
*   **Result**: `PERMISSION_DENIED` (Timer validations require valid bounds or server ticking synchronizations).

### Payload 8: Identity Audio Hijack (Signaling Spoofing)
An attacker attempts to send candidate signaling paths pretending to be the room host.
```json
{
  "senderId": "room_host_uid",
  "targetId": "member_uid",
  "type": "offer",
  "payload": "..."
}
```
*   **Result**: `PERMISSION_DENIED` (Identity verification mandates `senderId == request.auth.uid`).

### Payload 9: Bypassing Verified Email Security
An attacker logs in using an unverified sandbox email and tries to create an active public room.
*   **Result**: `PERMISSION_DENIED` (Lobby creation demands verified email where appropriate).

### Payload 10: Double Room Seizure
An attacker tries to mutate `hostId` to seize room controls.
```json
{
  "hostId": "attacker_uid"
}
```
*   **Result**: `PERMISSION_DENIED` (`hostId` marked as immutable `incoming().hostId == existing().hostId`).

### Payload 11: System Log Injection
An attacker inserts a mock log declaring a player sold to them, bypassing the room's state machine.
```json
{
  "id": "fraudulent_log",
  "type": "sold",
  "message": "Virat Kohli was sold to Attacker FC for ₹20 Lakhs!"
}
```
*   **Result**: `PERMISSION_DENIED` (Relational matching requires log entries to trace to room member keys synchronously).

### Payload 12: Chat Message Flood & Oversized Payload
An attacker attempts to send a 5MB text string as chat to exhaust resources of other players.
*   **Result**: `PERMISSION_DENIED` (Chat texts strictly restricted to `incoming().text.size() <= 250`).

---

## 3. Test Architecture Plan

All operations are validated to return `PERMISSION_DENIED` under incorrect authentication or state violations. Room bounds and identity restrictions are strictly enforced inside `/firestore.rules`.

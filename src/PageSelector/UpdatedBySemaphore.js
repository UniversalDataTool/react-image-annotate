import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

export function isUpdatedByAggregator(updatedBy) {
  if (updatedBy == null) return false;
  return String(updatedBy).trim() === 'AGGREGATOR';
}

/** Non-empty lease string or null (treat undefined / "" / whitespace as no lock). */
export function normalizeMediaPresenterLeaseUntil(raw) {
  if (raw == null) return null;
  const s = String(raw).trim();
  return s === '' ? null : s;
}

/**
 * True when Dynamo `mediaPresenterLeaseUntil` (ISO UTC string) is still in the future.
 * Matches the media-presenter webhook lease written by BasicLinkingFunction.
 */
export function isMediaPresenterLockActive(mediaPresenterLeaseUntil) {
  const s = normalizeMediaPresenterLeaseUntil(mediaPresenterLeaseUntil);
  if (s == null) return false;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return false;
  return t > Date.now();
}

/**
 * Case "Ready" state shared by the semaphore and controls gated by it.
 * While a lease string is present, re-evaluates every second so expiry clears without a parent refetch.
 */
export function useCaseReady(updatedBy, mediaPresenterLeaseUntil) {
  const leaseStr = useMemo(
    () => normalizeMediaPresenterLeaseUntil(mediaPresenterLeaseUntil),
    [mediaPresenterLeaseUntil]
  );

  const [, setLeasePulse] = useState(0);

  useEffect(() => {
    if (leaseStr == null) return undefined;
    const id = window.setInterval(() => setLeasePulse(n => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [leaseStr]);

  const lockActive = isMediaPresenterLockActive(leaseStr);
  return {
    leaseStr,
    lockActive,
    ready: isUpdatedByAggregator(updatedBy) && !lockActive,
  };
}

/**
 * Case-level "UPDATED BY" indicator for the page strip (left panel).
 * Green lit only when `updatedBy` is exactly AGGREGATOR and the media-presenter Dynamo lease is not active.
 * `selectionKey` should change per selected page so the control remounts when paging.
 */
export default function UpdatedBySemaphore({ updatedBy, mediaPresenterLeaseUntil, selectionKey }) {
  const { leaseStr, lockActive, ready: green } = useCaseReady(updatedBy, mediaPresenterLeaseUntil);
  const source = updatedBy == null || updatedBy === '' ? '—' : String(updatedBy);
  const leaseHint = lockActive ? ` Media presenter lock active (lease until ${leaseStr}).` : '';
  const statusLabel = green ? 'Ready' : 'Do not modify';
  const title =
    `Case last updated by: ${source}.${leaseHint} Status: ${statusLabel}. ` +
    'Green lamp: safe to modify (AGGREGATOR and no active media-presenter lease). ' +
    'Red lamp: do not modify (other updater and/or lock).';
  const redClass = 'ps-semaphore-lamp ps-semaphore-red' + (green ? '' : ' ps-semaphore-lit');
  const greenClass = 'ps-semaphore-lamp ps-semaphore-green' + (green ? ' ps-semaphore-lit' : '');

  return (
    <div
      key={`${selectionKey}|${leaseStr ?? ''}`}
      className="ps-updated-by-semaphore"
      title={title}
      role="img"
      aria-label={statusLabel}
    >
      <span className="ps-semaphore-toggle-column" aria-hidden="true">
        <span className="ps-semaphore-lamps">
          <span className={redClass} />
          <span className={greenClass} />
        </span>
      </span>
      <span className="ps-top-bar-label ps-updated-by-semaphore__label">{statusLabel}</span>
    </div>
  );
}

UpdatedBySemaphore.propTypes = {
  updatedBy: PropTypes.string,
  mediaPresenterLeaseUntil: PropTypes.string,
  selectionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

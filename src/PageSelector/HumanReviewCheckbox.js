import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useCaseReady } from './UpdatedBySemaphore';

function formatConfirmedAt(confirmedAt) {
  if (!confirmedAt) return null;
  const t = Date.parse(confirmedAt);
  return Number.isNaN(t) ? String(confirmedAt) : new Date(t).toLocaleString();
}

/**
 * Human processor confirmation for the whole case (album), shown under the semaphore.
 * Checking requires the case to be Ready; unchecking is always allowed.
 * The value is controlled by `humanProcessorConfirmation`; when `onChange` returns a promise,
 * the checkbox stays disabled until it settles.
 */
export default function HumanReviewCheckbox({
  updatedBy,
  mediaPresenterLeaseUntil,
  humanProcessorConfirmation,
  onChange,
}) {
  const { ready } = useCaseReady(updatedBy, mediaPresenterLeaseUntil);
  const [pending, setPending] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => {
    mounted.current = false;
  }, []);

  const checked = humanProcessorConfirmation != null;
  const disabled = pending || (!checked && !ready);

  const handleChange = () => {
    const result = onChange(!checked);
    if (result && typeof result.then === 'function') {
      setPending(true);
      result
        .catch(() => { })
        .then(() => {
          if (mounted.current) setPending(false);
        });
    }
  };

  let title;
  if (checked) {
    const by = humanProcessorConfirmation.confirmedBy || 'unknown user';
    const at = formatConfirmedAt(humanProcessorConfirmation.confirmedAt);
    title = `Review completed by ${by}${at ? ` at ${at}` : ''}.`;
  } else if (ready) {
    title = 'Confirm that the review of this case is completed.';
  } else {
    title = 'Available when the status is Ready.';
  }

  return (
    <label
      className={'ps-human-review' + (disabled ? ' ps-human-review--disabled' : '')}
      title={title}
    >
      <span className="ps-top-bar-label ps-human-review__label">Review completed</span>
      <input
        type="checkbox"
        className="ps-human-review__input"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
    </label>
  );
}

HumanReviewCheckbox.propTypes = {
  updatedBy: PropTypes.string,
  mediaPresenterLeaseUntil: PropTypes.string,
  humanProcessorConfirmation: PropTypes.shape({
    confirmedAt: PropTypes.string,
    confirmedBy: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

import React, { useMemo } from 'react';
import styles from './otp.module.css';

const DIGIT_REGX = new RegExp(/^\d+$/);

type OtpProps = {
  value: string;
  length: number;
  onChange: (value: string) => void;
}

export default function OtpInput({ value, length, onChange }: OtpProps) {

  const otpValue = useMemo(() => {
    const otp: Array<string> = [];
    const values = value.split('');
    for (let index = 0; index < length; index++) {
      const digit = values[index];
      if (DIGIT_REGX.test(digit)) {
        otp.push(digit)
      } else {
        otp.push('');
      }
    }
    return otp;
  }, [value, length]);

  const onOtpChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const target = event.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = DIGIT_REGX.test(targetValue)
    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }
    targetValue = isTargetValueDigit ? targetValue : ' ';
    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newOtp = value.substring(0, idx) + targetValue + value.substring(idx + 1);
      onChange(newOtp);
      if (!isTargetValueDigit) {
        return;
      }
      focusToNextInputBox(target);
    } else if (targetValueLength === length) {
      onChange(targetValue);
      target.blur();
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const target = event.target as HTMLInputElement;
    const targetValue = target.value;
    target.setSelectionRange(0, targetValue.length);

    if (key === 'ArrowRight' || key === 'ArrowUp') {
      event.preventDefault();
      return focusToNextInputBox(target);
    }

    if (key === 'ArrowLeft' || key === 'ArrowDown') {
      event.preventDefault();
      return focusToPreviousInputBox(target);
    }

    if (key !== 'Backspace' || targetValue !== '') {
      return;
    }
    focusToPreviousInputBox(target);
  }

  const onInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { target } = event;
    target.setSelectionRange(0, target.value.length);
  }

  const focusToNextInputBox = (target: HTMLInputElement) => {
    const nextElement = target.nextElementSibling as HTMLInputElement;
    if (nextElement) {
      nextElement.focus();
    }
  }

  const focusToPreviousInputBox = (target: HTMLInputElement) => {
    const previousElement = target.previousElementSibling as HTMLInputElement;
    if (previousElement) {
      previousElement.focus();
    }
  }


  return <div className={styles['otp-group']}>
    {
      otpValue.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode='numeric'
          autoComplete='one-time-code'
          pattern='\d{1}'
          maxLength={length}
          className={styles['otp-input']}
          value={digit}
          onChange={(event) => onOtpChange(event, idx)}
          onKeyDown={onInputKeyDown}
          onFocus={onInputFocus}
        />
      ))
    }
  </div>
}

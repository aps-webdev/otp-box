import '../styles/globals.css'
import type { AppProps } from 'next/app'
import OtpInput from '../components/otp-input'
import { useState } from 'react'


function MyApp() {
  const [otp, setOtp] = useState('');
  const onChange = (value: string) => setOtp(value);
  return <div>
    <OtpInput
      value={otp}
      length={6}
      onChange={onChange}
    />
  </div>
}

export default MyApp

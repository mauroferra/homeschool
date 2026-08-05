import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { validateEmail, validateRequired } from '../../utils/validationHelpers';

export default function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setApiError('');
    const next = {};
    if (!validateRequired(email)) next.email = 'Email is required';
    else if (!validateEmail(email)) next.email = 'Enter a valid email';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const res = await authService.resetPassword(email);
      setMessage(res.resetLink ? `Dev link: ${res.resetLink}` : 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>Reset password</h2>
      {message && <div className="alert alert-success" role="alert">{message}</div>}
      {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}
      <Input
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Button type="submit" loading={loading} className="btn-block">Send reset link</Button>
      <p className="auth-link"><Link to="/login">Back to login</Link></p>
    </form>
  );
}
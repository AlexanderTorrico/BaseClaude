import { Form, FormGroup, Label, Input } from 'reactstrap';
import { AlertMessage } from '../../../components/Common/Form';
import { useSimpleLogin } from '../hooks/useSimpleLogin';

export const LoginForm = () => {
  const {
    formData,
    handleSubmit,
    handleFieldChange,
    clearErrors,
    isSubmitting,
    displayError
  } = useSimpleLogin();
  
  return (
    <div className="p-2">
      <Form className="form-horizontal" onSubmit={handleSubmit}>
        {/* Error Alert */}
        <AlertMessage
          message={displayError || ''}
          type="error"
          onDismiss={clearErrors}
        />

        {/* Email Field */}
        <FormGroup>
          <Label for="email">Email <span className="text-danger">*</span></Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Ingresa tu email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email')(e.target.value)}
            disabled={isSubmitting}
            required
            invalid={!!formData.errors.email}
          />
          {formData.errors.email && (
            <div className="invalid-feedback d-block">
              {formData.errors.email}
            </div>
          )}
        </FormGroup>

        {/* Password Field */}
        <FormGroup>
          <Label for="password">Contraseña <span className="text-danger">*</span></Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChange={(e) => handleFieldChange('password')(e.target.value)}
            disabled={isSubmitting}
            required
            invalid={!!formData.errors.password}
          />
          {formData.errors.password && (
            <div className="invalid-feedback d-block">
              {formData.errors.password}
            </div>
          )}
        </FormGroup>

        {/* Remember Me Checkbox */}
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="customControlInline"
            checked={formData.rememberMe || false}
            onChange={(e) => handleFieldChange('rememberMe')(e.target.checked)}
            disabled={isSubmitting}
          />
          <label
            className="form-check-label"
            htmlFor="customControlInline"
          >
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <div className="mt-3 d-grid">
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </div>

      </Form>
    </div>
  );
};
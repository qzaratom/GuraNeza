import { GoogleLogin } from "@react-oauth/google";

function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      size="large"
      shape="pill"
      text="signin_with"
      theme="outline"
    />
  );
}

export default GoogleLoginButton;
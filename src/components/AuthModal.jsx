// src/components/AuthModal.jsx
import React, { useState } from "react";

export default function AuthModal({
  mode,
  onClose,
  onSwitchMode,
  onLogin,
  onRegister,
}) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  });

  function handleLoginSubmit(e) {
    e.preventDefault();
    onLogin(loginForm);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    onRegister(registerForm);
  }

  return (
    <div className="auth-backdrop">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          ✕
        </button>

        {mode === "login" && (
          <>
            <h2>로그인</h2>
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <label>
                이메일
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
              </label>
              <label>
                비밀번호
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </label>
              <button type="submit" className="auth-submit">
                로그인
              </button>
            </form>

            <p className="auth-switch-text">
              아직 회원이 아니신가요?{" "}
              <button
                className="auth-switch-btn"
                onClick={() => onSwitchMode("register")}
              >
                회원가입
              </button>
            </p>
          </>
        )}

        {mode === "register" && (
          <>
            <h2>회원가입</h2>
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <label>
                닉네임
                <input
                  type="text"
                  value={registerForm.nickname}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      nickname: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                이메일
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                비밀번호
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                비밀번호 확인
                <input
                  type="password"
                  value={registerForm.passwordConfirm}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      passwordConfirm: e.target.value,
                    })
                  }
                />
              </label>

              <button type="submit" className="auth-submit">
                회원가입
              </button>
            </form>

            <p className="auth-switch-text">
              이미 계정이 있으신가요?{" "}
              <button
                className="auth-switch-btn"
                onClick={() => onSwitchMode("login")}
              >
                로그인
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

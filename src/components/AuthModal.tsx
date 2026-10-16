import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  Check,
  Camera,
  ImagePlus,
  Trash2,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { GenderType, BgThemeType } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    login,
    register,
    savedUsers,
    currentUser,
    updateUserProfile,
  } = useExpense();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>('login');
  const [authMethod, setAuthMethod] = useState<'phone' | 'gmail'>('phone');

  // Login form state
  const [loginGmail, setLoginGmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regGmail, setRegGmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regGender, setRegGender] = useState<GenderType>('female');
  const [regBgTheme] = useState<BgThemeType>('sky-pink');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatarColor, setRegAvatarColor] = useState('#38bdf8');
  const [regAvatarUrl, setRegAvatarUrl] = useState<string | undefined>(undefined);

  // Edit profile state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGender, setEditGender] = useState<GenderType>('female');
  const [editBgTheme, setEditBgTheme] = useState<BgThemeType>('sky-pink');
  const [editAvatarColor, setEditAvatarColor] = useState('#38bdf8');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | undefined>(undefined);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  const normalizePhone = (raw: string) => raw.trim().replace(/[\s.-]/g, '').replace(/^\+84/, '0');
  const phoneRegex = /^0\d{8,10}$/;

  const compressImageFromPhone = (file: File, onDone: (dataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          onDone(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [authModalMode]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone || '');
      setEditGender(currentUser.gender || 'female');
      setEditBgTheme(currentUser.bgTheme || 'sky-pink');
      setEditAvatarColor(currentUser.avatarColor || '#38bdf8');
      setEditAvatarUrl(currentUser.avatarUrl);
    }
  }, [currentUser]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Direct login without OTP / code verification
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMethod === 'phone') {
      const cleaned = normalizePhone(loginPhone);
      if (!cleaned) {
        setErrorMessage('Vui lòng nhập số điện thoại để đăng nhập!');
        return;
      }
      if (!phoneRegex.test(cleaned)) {
        setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số, bắt đầu bằng số 0)!');
        return;
      }

      const success = login(cleaned, loginPassword, false);
      if (success) {
        setSuccessMessage(`Đăng nhập thành công!`);
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        setErrorMessage(
          `Số điện thoại ${cleaned} chưa được đăng ký trong hệ thống. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới!`
        );
      }
      return;
    }

    const emailTrimmed = loginGmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail để đăng nhập!');
      return;
    }

    if (!gmailRegex.test(emailTrimmed)) {
      setErrorMessage('Vui lòng sử dụng tài khoản Gmail hợp lệ (có đuôi @gmail.com)!');
      return;
    }

    const success = login(emailTrimmed, loginPassword, false);
    if (success) {
      setSuccessMessage(`Đăng nhập thành công!`);
      setTimeout(() => {
        handleClose();
      }, 500);
    } else {
      setErrorMessage(
        `Địa chỉ Gmail ${emailTrimmed} chưa được đăng ký trong hệ thống. Vui lòng chuyển sang tab Đăng ký để tạo tài khoản mới!`
      );
    }
  };

  // Quick Google Gmail Login button
  const handleGoogleSignInClick = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setAuthMethod('gmail');

    const targetEmail = (activeTab === 'register' ? regGmail : loginGmail).trim().toLowerCase();

    if (!targetEmail) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail của bạn để đăng nhập!');
      return;
    }

    if (!gmailRegex.test(targetEmail)) {
      setErrorMessage('Chỉ chấp nhận tài khoản Gmail hợp lệ có đuôi @gmail.com!');
      return;
    }

    // Direct login (autoCreate: true if registering / direct google sign in)
    const success = login(targetEmail, loginPassword, true);
    if (success) {
      setSuccessMessage(`Đăng nhập bằng Gmail (${targetEmail}) thành công!`);
      setTimeout(() => {
        handleClose();
      }, 500);
    }
  };

  // Direct register without OTP / code verification
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn!');
      return;
    }

    if (authMethod === 'phone') {
      const cleaned = normalizePhone(regPhone);
      if (!cleaned) {
        setErrorMessage('Vui lòng nhập số điện thoại đăng ký!');
        return;
      }
      if (!phoneRegex.test(cleaned)) {
        setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (ví dụ: 0912345678)!');
        return;
      }
      if (savedUsers.some((u) => normalizePhone(u.phone || '') === cleaned)) {
        setErrorMessage('Số điện thoại này đã được đăng ký. Vui lòng chuyển sang tab Đăng nhập!');
        return;
      }

      const success = register(
        {
          name: regName.trim(),
          phone: cleaned,
          email: `${cleaned}@phone.vn`,
          emailVerified: true,
          gender: regGender,
          bgTheme: regBgTheme,
          avatarColor: regAvatarColor,
          avatarUrl: regAvatarUrl,
        },
        regPassword
      );

      if (success) {
        setSuccessMessage('Đăng ký tài khoản thành công! Bắt đầu quản lý chi tiêu.');
        setTimeout(() => {
          handleClose();
        }, 600);
      }
      return;
    }

    const emailTrimmed = regGmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setErrorMessage('Vui lòng nhập địa chỉ Gmail đăng ký!');
      return;
    }

    if (!gmailRegex.test(emailTrimmed)) {
      setErrorMessage('Vui lòng đăng ký bằng địa chỉ Gmail hợp lệ (ví dụ: tenban@gmail.com)!');
      return;
    }

    if (savedUsers.some((u) => u.email.toLowerCase() === emailTrimmed)) {
      setErrorMessage('Tài khoản Gmail này đã được đăng ký. Vui lòng chuyển sang tab Đăng nhập!');
      return;
    }

    const success = register(
      {
        name: regName.trim(),
        email: emailTrimmed,
        phone: regPhone.trim() ? normalizePhone(regPhone) : undefined,
        emailVerified: true,
        gender: regGender,
        bgTheme: regBgTheme,
        avatarColor: regAvatarColor,
        avatarUrl: regAvatarUrl,
      },
      regPassword
    );

    if (success) {
      setSuccessMessage('Đăng ký tài khoản thành công! Bắt đầu quản lý chi tiêu.');
      setTimeout(() => {
        handleClose();
      }, 600);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateUserProfile({
      name: editName.trim(),
      phone: editPhone.trim() ? normalizePhone(editPhone) : undefined,
      gender: editGender,
      bgTheme: editBgTheme,
      avatarColor: editAvatarColor,
      avatarUrl: editAvatarUrl,
    });

    setSuccessMessage('Cập nhật hồ sơ thành công!');
    setTimeout(() => {
      setSuccessMessage('');
      handleClose();
    }, 600);
  };

  const colorOptions = [
    { label: 'Xanh dương nhạt', value: '#38bdf8' },
    { label: 'Hồng nhạt', value: '#f472b6' },
    { label: 'Xanh da trời', value: '#0284c7' },
    { label: 'Hồng phấn', value: '#ec4899' },
    { label: 'Tím pastel', value: '#a855f7' },
    { label: 'Xanh ngọc', value: '#14b8a6' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-sky-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92dvh] overflow-y-auto pb-safe">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-sky-100 to-pink-100 text-sky-700 flex items-center justify-center border border-sky-200/70">
              {authMethod === 'phone' ? (
                <Phone className="w-4 h-4 text-sky-600" />
              ) : (
                <Mail className="w-4 h-4 text-sky-600" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {activeTab === 'profile'
                  ? 'Hồ sơ cá nhân'
                  : activeTab === 'register'
                  ? 'Đăng ký tài khoản'
                  : 'Đăng nhập tài khoản'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Hỗ trợ đăng nhập & đăng ký bằng Số điện thoại hoặc Gmail
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-sky-50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not in profile */}
        {activeTab !== 'profile' && (
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center p-1 bg-sky-50/80 rounded-2xl border border-sky-100">
              <button
                type="button"
                id="tab-auth-login"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-sky-700 shadow-xs border border-sky-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Đăng nhập
              </button>
              <button
                type="button"
                id="tab-auth-register"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-white text-pink-600 shadow-xs border border-pink-200/60'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Đăng ký
              </button>
            </div>

            {/* Method Toggle: Số điện thoại vs Gmail */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-method-phone"
                onClick={() => {
                  setAuthMethod('phone');
                  setErrorMessage('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-linear-to-r from-sky-100/90 to-pink-100/90 border-sky-300 text-slate-800 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-sky-600" />
                <span>Bằng Số điện thoại</span>
              </button>
              <button
                type="button"
                id="btn-method-gmail"
                onClick={() => {
                  setAuthMethod('gmail');
                  setErrorMessage('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  authMethod === 'gmail'
                    ? 'bg-linear-to-r from-sky-100/90 to-pink-100/90 border-pink-300 text-slate-800 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-pink-500" />
                <span>Bằng Gmail</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Success message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 flex items-start gap-2">
            <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN BY PHONE OR GMAIL */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {authMethod === 'phone' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Số điện thoại <span className="text-pink-500">*</span>:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      inputMode="tel"
                      required
                      id="input-login-phone"
                      placeholder="Ví dụ: 0912345678"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tài khoản Gmail <span className="text-pink-500">*</span>:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      id="input-login-identifier"
                      placeholder="tenban@gmail.com"
                      value={loginGmail}
                      onChange={(e) => setLoginGmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="input-login-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
              </div>

              <div className="pt-1 space-y-2.5">
                <button
                  type="submit"
                  id="btn-submit-login"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-linear-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {authMethod === 'phone'
                      ? 'Đăng nhập bằng Số điện thoại'
                      : 'Đăng nhập bằng Gmail'}
                  </span>
                </button>

                {authMethod === 'gmail' && (
                  <button
                    type="button"
                    onClick={handleGoogleSignInClick}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-sky-50/70 text-slate-700 border border-sky-200 transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                      />
                    </svg>
                    <span>Đăng nhập nhanh bằng Gmail</span>
                  </button>
                )}

                <div className="pt-2 text-center border-t border-slate-100">
                  <span className="text-xs text-slate-500">Chưa có tài khoản? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 underline cursor-pointer"
                  >
                    Đăng ký tài khoản mới
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER BY PHONE OR GMAIL */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            {authMethod === 'phone' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Số điện thoại đăng ký <span className="text-pink-500">*</span>:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    id="input-reg-phone"
                    placeholder="Ví dụ: 0912345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Địa chỉ Gmail đăng ký <span className="text-pink-500">*</span>:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    id="input-reg-gmail"
                    placeholder="Ví dụ: thutrang@gmail.com"
                    value={regGmail}
                    onChange={(e) => setRegGmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Họ và tên <span className="text-pink-500">*</span>:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  id="input-reg-name"
                  placeholder="Ví dụ: Hoàng Thu Trang"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Giới tính:
              </label>
              <select
                value={regGender}
                onChange={(e) => setRegGender(e.target.value as GenderType)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
              >
                <option value="female">Nữ ♀</option>
                <option value="male">Nam ♂</option>
                <option value="other">Khác ✦</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Ảnh đại diện (Chọn từ Album điện thoại hoặc Màu khung tròn):
              </label>
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                <div className="relative shrink-0">
                  {regAvatarUrl ? (
                    <img
                      src={regAvatarUrl}
                      alt="Ảnh đại diện"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-xs"
                      style={{ backgroundColor: regAvatarColor }}
                    >
                      {(regName || 'SV').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold cursor-pointer shadow-2xs transition">
                      <ImagePlus className="w-3.5 h-3.5 text-pink-500" />
                      <span>Chọn ảnh từ Album</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressImageFromPhone(file, (url) => setRegAvatarUrl(url));
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {regAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setRegAvatarUrl(undefined)}
                        className="p-1.5 rounded-xl bg-white text-slate-400 hover:text-pink-600 border border-slate-200 transition cursor-pointer"
                        title="Xóa ảnh"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setRegAvatarColor(c.value)}
                        style={{ backgroundColor: c.value }}
                        className={`w-5 h-5 rounded-full transition ${
                          regAvatarColor === c.value
                            ? 'ring-2 ring-offset-1 ring-sky-500 scale-110 shadow-xs'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tạo mật khẩu:
              </label>
              <input
                type="password"
                required
                id="input-reg-password"
                placeholder="Tối thiểu 6 ký tự"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                id="btn-submit-register"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-linear-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Đăng ký tài khoản</span>
              </button>

              <div className="pt-2 text-center border-t border-slate-100">
                <span className="text-xs text-slate-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === 'profile' && currentUser && (
          <form onSubmit={handleProfileSave} className="space-y-3.5">
            <div className="p-3.5 bg-linear-to-r from-sky-50/90 to-pink-50/90 rounded-2xl border border-sky-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt={currentUser.name}
                      className="w-14 h-14 rounded-full object-cover shadow-xs border-2 border-white ring-2 ring-pink-200"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full text-white font-bold text-base flex items-center justify-center shadow-xs border-2 border-white ring-2 ring-pink-200"
                      style={{ backgroundColor: editAvatarColor || '#38bdf8' }}
                    >
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <label
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white border-2 border-white flex items-center justify-center shadow-xs cursor-pointer transition"
                    title="Chọn ảnh từ Album điện thoại"
                  >
                    <Camera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          compressImageFromPhone(file, (url) => setEditAvatarUrl(url));
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</h4>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {currentUser.phone ? `SĐT: ${currentUser.phone}` : currentUser.email}
                  </p>
                  <span className="text-[10px] text-sky-700 font-medium block mt-0.5">
                    Tham gia từ: {currentUser.joinedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-sky-200/60">
                <label className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold cursor-pointer shadow-2xs transition">
                  <ImagePlus className="w-3.5 h-3.5 text-pink-500" />
                  <span>Chọn ảnh từ Album điện thoại</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        compressImageFromPhone(file, (url) => setEditAvatarUrl(url));
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
                {editAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => setEditAvatarUrl(undefined)}
                    className="py-1.5 px-2.5 rounded-xl bg-white text-slate-400 hover:text-pink-600 border border-slate-200 text-xs transition cursor-pointer"
                    title="Xóa ảnh đại diện"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Họ và tên:
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Số điện thoại:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="Nhập số điện thoại của bạn"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Giới tính:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'female', label: 'Nữ ♀' },
                    { id: 'male', label: 'Nam ♂' },
                    { id: 'other', label: 'Khác ✦' },
                  ] as { id: GenderType; label: string }[]
                ).map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setEditGender(g.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      editGender === g.id
                        ? 'bg-pink-100/90 border-pink-300 text-pink-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-sky-50/50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Màu khung tròn đại diện:
              </label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setEditAvatarColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-7 h-7 rounded-full transition ${
                      editAvatarColor === c.value
                        ? 'ring-2 ring-offset-2 ring-sky-500 scale-110 shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition shadow-xs cursor-pointer"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

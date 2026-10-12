import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  GraduationCap,
  Mail,
  Lock,
  User,
  School,
  BookOpen,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useExpense } from '../context/ExpenseContext';
import { UserProfile, GenderType, BgThemeType } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    loginAsDemoUser,
    register,
    savedUsers,
    currentUser,
    updateUserProfile,
  } = useExpense();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regUniversity, setRegUniversity] = useState('Đại học Bách Khoa');
  const [regMajor, setRegMajor] = useState('');
  const [regGender, setRegGender] = useState<GenderType>('female');
  const [regBgTheme, setRegBgTheme] = useState<BgThemeType>('sky-pink');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatarColor, setRegAvatarColor] = useState('#38bdf8');

  // Edit profile state
  const [editName, setEditName] = useState('');
  const [editUniversity, setEditUniversity] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [editMajor, setEditMajor] = useState('');
  const [editGender, setEditGender] = useState<GenderType>('female');
  const [editBgTheme, setEditBgTheme] = useState<BgThemeType>('sky-pink');
  const [editAvatarColor, setEditAvatarColor] = useState('#38bdf8');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync mode with context
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
    }
  }, [authModalMode]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditUniversity(currentUser.university || '');
      setEditStudentId(currentUser.studentId || '');
      setEditMajor(currentUser.major || '');
      setEditGender(currentUser.gender || 'female');
      setEditBgTheme(currentUser.bgTheme || 'sky-pink');
      setEditAvatarColor(currentUser.avatarColor || '#38bdf8');
    }
  }, [currentUser]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier.trim()) {
      setErrorMessage('Vui lòng nhập Email hoặc Mã số sinh viên!');
      return;
    }

    const success = login(loginIdentifier.trim(), loginPassword);
    if (success) {
      setSuccessMessage('Đăng nhập thành công!');
      setTimeout(() => {
        handleClose();
      }, 500);
    } else {
      setErrorMessage('Thông tin đăng nhập không hợp lệ.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên và email!');
      return;
    }

    const success = register(
      {
        name: regName.trim(),
        email: regEmail.trim(),
        studentId: regStudentId.trim() || undefined,
        university: regUniversity.trim() || undefined,
        major: regMajor.trim() || undefined,
        gender: regGender,
        bgTheme: regBgTheme,
        avatarColor: regAvatarColor,
      },
      regPassword
    );

    if (success) {
      setSuccessMessage('Đăng ký tài khoản thành công! Chào mừng bạn gia nhập.');
      setTimeout(() => {
        handleClose();
      }, 700);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    updateUserProfile({
      name: editName.trim(),
      university: editUniversity.trim() || undefined,
      studentId: editStudentId.trim() || undefined,
      major: editMajor.trim() || undefined,
      gender: editGender,
      bgTheme: editBgTheme,
      avatarColor: editAvatarColor,
    });

    setSuccessMessage('Cập nhật hồ sơ sinh viên thành công!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sky-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-sky-100 to-pink-100 text-sky-700 flex items-center justify-center border border-sky-200/70">
              <GraduationCap className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {activeTab === 'profile'
                  ? 'Hồ sơ sinh viên'
                  : activeTab === 'register'
                  ? 'Đăng ký tài khoản sinh viên'
                  : 'Đăng nhập tài khoản'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Quản lý chi tiêu cá nhân an toàn & bảo mật
              </p>
            </div>
          </div>
          <button
            id="btn-close-auth-modal"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-sky-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not just profile */}
        {activeTab !== 'profile' && (
          <div className="flex items-center p-1 bg-sky-50/80 rounded-2xl border border-sky-100 mb-4">
            <button
              type="button"
              id="tab-auth-login"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
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
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'register'
                  ? 'bg-white text-pink-600 shadow-xs border border-pink-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Đăng ký sinh viên
            </button>
          </div>
        )}

        {/* Error / Success message */}
        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-700 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-sky-600" />
            {successMessage}
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            {/* Quick 1-click Demo Profiles for Students */}
            <div className="p-3.5 rounded-2xl bg-linear-to-r from-sky-50/90 to-pink-50/80 border border-sky-200/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-sky-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  Đăng nhập nhanh tài khoản sinh viên:
                </span>
                <span className="text-[10px] text-sky-600 font-medium">Bấm để đăng nhập</span>
              </div>
              <div className="space-y-1.5">
                {savedUsers.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      loginAsDemoUser(u);
                      setSuccessMessage(`Đã đăng nhập với ${u.name}!`);
                      setTimeout(() => handleClose(), 500);
                    }}
                    className="w-full text-left p-2 rounded-xl bg-white border border-sky-200/70 hover:border-sky-400 hover:shadow-xs transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: u.avatarColor || '#38bdf8' }}
                      >
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block line-clamp-1 group-hover:text-sky-700 transition">
                          {u.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block line-clamp-1">
                          {u.university} {u.studentId ? `• MSSV: ${u.studentId}` : ''}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition" />
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-sky-100 w-full" />
              <span className="bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider shrink-0">
                hoặc nhập thông tin
              </span>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email hoặc Mã số sinh viên (MSSV):
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    id="input-login-identifier"
                    placeholder="Ví dụ: 22021589 hoặc student@edu.vn"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

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
                    placeholder="•••••••• (Có thể để trống để thử nghiệm)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
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
                  <span>Ghi nhớ phiên đăng nhập</span>
                </label>
                <span className="text-pink-600 font-medium cursor-pointer hover:underline">
                  Quên mật khẩu?
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-submit-login"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-linear-to-r from-sky-500 to-pink-500 hover:from-sky-600 hover:to-pink-600 text-white transition shadow-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Họ và tên sinh viên:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Thu Trang"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mã số SV (MSSV):
                </label>
                <input
                  type="text"
                  placeholder="23021999"
                  value={regStudentId}
                  onChange={(e) => setRegStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email liên hệ:
                </label>
                <input
                  type="email"
                  required
                  placeholder="thutrang@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Trường Đại học:
                </label>
                <input
                  type="text"
                  placeholder="ĐH Kinh Tế, ĐH Bách Khoa..."
                  value={regUniversity}
                  onChange={(e) => setRegUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Chuyên ngành:
                </label>
                <input
                  type="text"
                  placeholder="Marketing, CNTT..."
                  value={regMajor}
                  onChange={(e) => setRegMajor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hình nền yêu thích:
                </label>
                <select
                  value={regBgTheme}
                  onChange={(e) => setRegBgTheme(e.target.value as BgThemeType)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="sky-pink">Xanh & Hồng Pastel</option>
                  <option value="blue-dream">Xanh Mây Trắng</option>
                  <option value="pink-blossom">Hồng Đào Sakura</option>
                  <option value="lavender-mint">Tím & Xanh Bạc Hà</option>
                  <option value="peach-cream">Cam Đào & Kem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Màu đại diện:
              </label>
              <div className="flex items-center gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setRegAvatarColor(c.value)}
                    style={{ backgroundColor: c.value }}
                    className={`w-7 h-7 rounded-xl transition ${
                      regAvatarColor === c.value
                        ? 'ring-2 ring-offset-2 ring-sky-500 scale-110 shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tạo mật khẩu:
              </label>
              <input
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-submit-register"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-linear-to-r from-pink-500 to-sky-500 hover:from-pink-600 hover:to-sky-600 text-white transition shadow-sm flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Hoàn tất đăng ký</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: EDIT PROFILE */}
        {activeTab === 'profile' && currentUser && (
          <form onSubmit={handleProfileSave} className="space-y-3.5">
            <div className="flex items-center gap-3 p-3 bg-linear-to-r from-sky-50/90 to-pink-50/90 rounded-2xl border border-sky-100">
              <div
                className="w-12 h-12 rounded-full text-white font-bold text-base flex items-center justify-center shadow-xs border-2 border-white ring-2 ring-pink-200"
                style={{ backgroundColor: editAvatarColor || '#38bdf8' }}
              >
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">{currentUser.name}</h4>
                <p className="text-xs text-slate-400">{currentUser.email}</p>
                <span className="text-[10px] text-sky-700 font-medium">
                  Tham gia từ: {currentUser.joinedDate}
                </span>
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

            {/* Background Wallpaper Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Chế độ Hình nền Pastel:
              </label>
              <select
                value={editBgTheme}
                onChange={(e) => setEditBgTheme(e.target.value as BgThemeType)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="sky-pink">Xanh dương & Hồng phấn (Mặc định)</option>
                <option value="blue-dream">Xanh da trời Mây trắng</option>
                <option value="pink-blossom">Hồng Đào Sakura</option>
                <option value="lavender-mint">Tím Lavender & Xanh Bạc hà</option>
                <option value="peach-cream">Cam Đào & Kem sữa</option>
              </select>
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Trường Đại học:
                </label>
                <input
                  type="text"
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mã số SV (MSSV):
                </label>
                <input
                  type="text"
                  value={editStudentId}
                  onChange={(e) => setEditStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Chuyên ngành:
              </label>
              <input
                type="text"
                value={editMajor}
                onChange={(e) => setEditMajor(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white transition shadow-xs"
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

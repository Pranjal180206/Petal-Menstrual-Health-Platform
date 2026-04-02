import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, Eye, Flag, Users, FileText, HelpCircle, Video, Shield, ChevronLeft, Search, ToggleLeft, ToggleRight, Award } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import Toast from '../components/Toast';

/* ── tiny helpers ── */
const Badge = ({ color, children }) => {
  const colors = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', amber: 'bg-amber-100 text-amber-700', blue: 'bg-blue-100 text-blue-700', gray: 'bg-gray-100 text-gray-600', pink: 'bg-pink-100 text-pink-700' };
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colors[color] || colors.gray}`}>{children}</span>;
};

const Confirm = ({ message, onYes, onNo }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onNo}>
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
      <p className="text-sm font-bold text-gray-800 mb-5">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onNo} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
        <button onClick={onYes} className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600">Confirm</button>
      </div>
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Icon size={40} strokeWidth={1.5} />
    <p className="mt-3 text-sm font-bold">{text}</p>
  </div>
);

const toText = (value) => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    return value.en || value.hi || value.mr || Object.values(value).find(v => typeof v === 'string') || '';
  }
  return '';
};

const toArray = (value) => (Array.isArray(value) ? value : []);
const toTagsText = (value) => (Array.isArray(value) ? value.join(', ') : (typeof value === 'string' ? value : ''));

const sections = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'myths', label: 'Myths & Facts', icon: HelpCircle },
  { id: 'quizzes', label: 'Quizzes', icon: CheckCircle2 },
  { id: 'scores', label: 'Scores', icon: Award },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'flagged', label: 'Flagged Posts', icon: Flag },
];

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('users');
  const [toast, setToast] = useState(null);

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg border border-red-100 max-w-md">
          <Shield size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-sm text-gray-500 mb-6">You need admin privileges to access this page.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 rounded-xl bg-[#D81B60] text-white font-bold text-sm hover:bg-[#C2185B]">Go Home</button>
        </div>
      </div>
    );
  }

  const show = (msg, type = 'success') => setToast({ message: msg, type });

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 h-screen z-30">
        <div className="p-5 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <img src="/upay-logo.png" alt="Upay Logo" className="h-[36px] w-auto object-contain" />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base text-[#1D1D2C]">Petal</span>
                <span className="text-[10px] text-gray-500 font-medium mt-1">by Upay</span>
              </div>
            </div>
            <span className="text-[9px] text-[#D81B60] font-bold uppercase tracking-wider block">Control Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${active === s.id ? 'bg-[#FFF0F4] text-[#D81B60]' : 'text-gray-500 hover:bg-gray-50'}`}>
              <s.icon size={16} />{s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">
            <ChevronLeft size={16} /> Back to Site
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-60 flex-1 p-8 max-w-6xl">
        <h1 className="text-2xl font-extrabold text-[#1D1D2C] mb-1">{sections.find(s => s.id === active)?.label}</h1>
        <p className="text-sm text-gray-400 mb-6">Manage platform content and users</p>

        {active === 'users' && <UsersSection show={show} />}
        {active === 'articles' && <ArticlesSection show={show} />}
        {active === 'myths' && <MythsSection show={show} />}
        {active === 'quizzes' && <QuizzesSection show={show} />}
        {active === 'scores' && <ScoresSection show={show} />}
        {active === 'videos' && <VideosSection show={show} />}
        {active === 'flagged' && <FlaggedSection show={show} />}
      </main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   USERS
   ═══════════════════════════════════════════════════════ */
const UsersSection = ({ show }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);

  const fetch = useCallback(async () => {
    try { const r = await axiosInstance.get('/admin/users'); setUsers(r.data); } catch { show('Failed to load users', 'error'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const toggle = async (id) => {
    try { 
      await axiosInstance.patch(`/admin/users/${id}/deactivate`); 
      show('User status updated'); 
      fetch(); 
    } catch (err) { 
      show(err.response?.data?.detail || 'Failed to update', 'error'); 
    }
    setConfirm(null);
  };

  const promoteToAdmin = async (id) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/promote`);
      show('User promoted to admin');
      fetch();
    } catch (err) {
      show(err.response?.data?.detail || 'Failed to promote', 'error');
    }
    setConfirm(null);
  };

  const demoteFromAdmin = async (id) => {
    try {
      await axiosInstance.patch(`/admin/users/${id}/demote`);
      show('Admin status removed');
      fetch();
    } catch (err) {
      show(err.response?.data?.detail || 'Failed to demote', 'error');
    }
    setConfirm(null);
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-xs font-bold text-yellow-700">
        <Shield size={14} /> Admin cannot view individual health data — only account info is shown.
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60]" />
      </div>
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : filtered.length === 0 ? <EmptyState icon={Users} text="No users found" /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Name</th><th className="text-left px-5 py-3">Email</th><th className="text-left px-5 py-3">Role</th><th className="text-left px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-bold text-gray-800">{u.name}</td>
                  <td className="px-5 py-3 text-gray-500">{u.email}</td>
                  <td className="px-5 py-3">
                    {u.is_admin ? <Badge color="pink">Admin</Badge> : <Badge color="gray">User</Badge>}
                  </td>
                  <td className="px-5 py-3">{u.is_active !== false ? <Badge color="green">Active</Badge> : <Badge color="red">Deactivated</Badge>}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setConfirm({ msg: `${u.is_active !== false ? 'Deactivate' : 'Reactivate'} ${u.name}?`, fn: () => toggle(u.id) })}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${u.is_active !== false ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                        {u.is_active !== false ? 'Deactivate' : 'Reactivate'}
                      </button>
                      {u.is_admin ? (
                        <button
                          onClick={() => setConfirm({ msg: `Remove admin privileges from ${u.name}?`, fn: () => demoteFromAdmin(u.id) })}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirm({ msg: `Promote ${u.name} to admin?`, fn: () => promoteToAdmin(u.id) })}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg text-pink-600 hover:bg-pink-50 transition-colors">
                          Make Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   ARTICLES
   ═══════════════════════════════════════════════════════ */
const ArticlesSection = ({ show }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // null = closed, {} = create, {id} = edit
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await axiosInstance.get('/admin/articles');
      setItems(toArray(r.data));
    } catch {
      show('Failed to load articles', 'error');
      setItems([]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    try {
      const payload = { 
        title: data.title, 
        summary: data.summary, 
        content: data.content, 
        category: data.category,
        author_name: data.author_name || 'Petal Team',
        tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean) || []
      };
      if (data.id) { await axiosInstance.patch(`/admin/articles/${data.id}`, payload); show('Article updated'); }
      else { await axiosInstance.post('/admin/articles', payload); show('Article created'); }
      setForm(null); load();
    } catch { show('Failed to save', 'error'); }
  };

  const del = async (id) => {
    try { await axiosInstance.delete(`/admin/articles/${id}`); show('Article deleted'); load(); } catch { show('Failed to delete', 'error'); }
    setConfirm(null);
  };

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      {form !== null && <ContentForm title={form.id ? 'Edit Article' : 'New Article'} fields={['title', 'summary', 'content', 'category', 'author_name', 'tags']} initial={form} onSave={save} onClose={() => setForm(null)} />}
      <button onClick={() => setForm({ title: '', summary: '', content: '', category: 'general', author_name: 'Petal Team', tags: '' })} className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D81B60] text-white text-sm font-bold hover:bg-[#C2185B]"><Plus size={16} /> New Article</button>
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : items.length === 0 ? <EmptyState icon={FileText} text="No articles yet" /> : (
        <div className="grid gap-3">
          {items.map((a, idx) => (
            <div key={a.id || `article-${idx}`} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-bold text-gray-800 text-sm truncate">{toText(a.title) || 'Untitled'}</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{toText(a.summary) || toText(a.content).substring(0, 100)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={a.category === 'general' ? 'gray' : 'pink'}>{a.category || 'general'}</Badge>
                {a.is_featured && <Badge color="amber">Featured</Badge>}
                <button onClick={() => setForm({ id: a.id, title: toText(a.title), summary: toText(a.summary), content: toText(a.content), category: a.category || 'general', author_name: toText(a.author_name) || 'Petal Team', tags: toTagsText(a.tags) })} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Edit3 size={15} /></button>
                <button onClick={() => setConfirm({ msg: `Delete "${toText(a.title) || 'this article'}"?`, fn: () => del(a.id) })} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   MYTHS & FACTS
   ═══════════════════════════════════════════════════════ */
const MythsSection = ({ show }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await axiosInstance.get('/admin/myths');
      setItems(toArray(r.data));
    } catch {
      show('Failed to load myths', 'error');
      setItems([]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    try {
      if (data.id) { await axiosInstance.patch(`/admin/myths/${data.id}`, { myth: data.myth, fact: data.fact }); show('Myth updated'); }
      else { await axiosInstance.post('/admin/myths', { myth: data.myth, fact: data.fact }); show('Myth created'); }
      setForm(null); load();
    } catch { show('Failed to save', 'error'); }
  };

  const del = async (id) => {
    try { await axiosInstance.delete(`/admin/myths/${id}`); show('Myth deleted'); load(); } catch { show('Failed to delete', 'error'); }
    setConfirm(null);
  };

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      {form !== null && <ContentForm title={form.id ? 'Edit Myth' : 'New Myth'} fields={['myth', 'fact']} initial={form} onSave={save} onClose={() => setForm(null)} />}
      <button onClick={() => setForm({ myth: '', fact: '' })} className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D81B60] text-white text-sm font-bold hover:bg-[#C2185B]"><Plus size={16} /> New Myth/Fact</button>
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : items.length === 0 ? <EmptyState icon={HelpCircle} text="No myths yet" /> : (
        <div className="grid gap-3">
          {items.map((m, idx) => (
            <div key={m.id || `myth-${idx}`} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-1">Myth</p>
                  <p className="text-sm font-bold text-gray-800">{toText(m.myth)}</p>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mt-2 mb-1">Fact</p>
                  <p className="text-sm text-gray-600">{toText(m.fact)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setForm({ id: m.id, myth: toText(m.myth), fact: toText(m.fact) })} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Edit3 size={15} /></button>
                  <button onClick={() => setConfirm({ msg: 'Delete this myth/fact?', fn: () => del(m.id) })} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   QUIZZES
   ═══════════════════════════════════════════════════════ */
const makeEmptyQuestion = () => ({
  id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  text: { en: '' },
  options: [
    { id: 'a', text: { en: '' } },
    { id: 'b', text: { en: '' } },
  ],
  correct_option_id: 'a',
  explanation: { en: '' },
});

const makeEmptyQuiz = () => ({
  title: { en: '' },
  description: { en: '' },
  questions: [makeEmptyQuestion()],
  is_published: false,
});

const quizToForm = (q) => ({
  id: q.id,
  title: typeof q.title === 'object' ? q.title : { en: q.title || '' },
  description: typeof q.description === 'object' ? q.description : { en: q.description || '' },
  questions: toArray(q.questions).map(qu => ({
    ...qu,
    text: typeof qu.text === 'object' ? qu.text : { en: qu.text || '' },
    options: toArray(qu.options).map((o, idx) => ({ id: o?.id || String.fromCharCode(97 + idx), ...o, text: typeof o?.text === 'object' ? o.text : { en: o?.text || '' } })),
    explanation: typeof qu.explanation === 'object' ? qu.explanation : { en: qu.explanation || '' },
  })),
  is_published: q.is_published ?? false,
});

const QuizFormModal = ({ initial, onSave, onClose }) => {
  const [quiz, setQuiz] = useState(initial);
  const [error, setError] = useState('');
  const set = (k, v) => setQuiz(prev => ({ ...prev, [k]: v }));

  const updateQuestion = (idx, field, value) => {
    const qs = [...quiz.questions];
    if (field === 'text') qs[idx] = { ...qs[idx], text: { en: value } };
    else if (field === 'correct') qs[idx] = { ...qs[idx], correct_option_id: value };
    else if (field === 'explanation') qs[idx] = { ...qs[idx], explanation: { en: value } };
    set('questions', qs);
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...quiz.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = { ...opts[oIdx], text: { en: value } };
    qs[qIdx] = { ...qs[qIdx], options: opts };
    set('questions', qs);
  };

  const addOption = (qIdx) => {
    const qs = [...quiz.questions];
    const nextId = String.fromCharCode(97 + qs[qIdx].options.length); // a, b, c, d...
    qs[qIdx] = { ...qs[qIdx], options: [...qs[qIdx].options, { id: nextId, text: { en: '' } }] };
    set('questions', qs);
  };

  const removeOption = (qIdx, oIdx) => {
    const qs = [...quiz.questions];
    const opts = qs[qIdx].options.filter((_, i) => i !== oIdx);
    if (opts.length < 2) return; // keep minimum 2
    qs[qIdx] = { ...qs[qIdx], options: opts };
    if (!opts.find(o => o.id === qs[qIdx].correct_option_id)) qs[qIdx].correct_option_id = opts[0].id;
    set('questions', qs);
  };

  const addQuestion = () => set('questions', [...quiz.questions, makeEmptyQuestion()]);
  const removeQuestion = (idx) => {
    if (quiz.questions.length < 2) return;
    set('questions', quiz.questions.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!quiz.title?.en?.trim()) {
      setError('Quiz title is required.');
      return;
    }
    if (quiz.questions.some(q => !q.text?.en?.trim() || q.options.some(o => !o.text?.en?.trim()))) {
      setError('All questions and options must have text filled in.');
      return;
    }
    setError('');
    onSave(quiz);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl my-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{quiz.id ? 'Edit Quiz' : 'New Quiz'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Quiz Title</label>
            <input value={quiz.title?.en || ''} onChange={e => set('title', { en: e.target.value })} placeholder="e.g. Menstrual Health Basics" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60]" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Description</label>
            <textarea value={quiz.description?.en || ''} onChange={e => set('description', { en: e.target.value })} rows={2} placeholder="A short description of this quiz" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60] resize-y" />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {quiz.questions.map((q, qIdx) => (
            <div key={q.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#D81B60] uppercase tracking-wider">Question {qIdx + 1}</span>
                {quiz.questions.length > 1 && (
                  <button onClick={() => removeQuestion(qIdx)} className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1"><Trash2 size={12} /> Remove</button>
                )}
              </div>
              <input value={q.text?.en || ''} onChange={e => updateQuestion(qIdx, 'text', e.target.value)} placeholder="Question text..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60] mb-3" />

              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Options (select the correct one)</label>
              <div className="space-y-2 mb-3">
                {q.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button onClick={() => updateQuestion(qIdx, 'correct', opt.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${q.correct_option_id === opt.id ? 'border-green-500 bg-green-500' : 'border-gray-300 hover:border-gray-400'}`}>
                      {q.correct_option_id === opt.id && <CheckCircle2 size={12} className="text-white" />}
                    </button>
                    <input value={opt.text?.en || ''} onChange={e => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Option ${opt.id.toUpperCase()}`}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#D81B60] ${q.correct_option_id === opt.id ? 'border-green-300 bg-green-50' : 'border-gray-200'}`} />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(qIdx, oIdx)} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400"><X size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
              {q.options.length < 6 && (
                <button onClick={() => addOption(qIdx)} className="text-xs font-bold text-[#D81B60] hover:text-[#C2185B] flex items-center gap-1 mb-3"><Plus size={12} /> Add Option</button>
              )}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Explanation (shown after answering)</label>
                <input value={q.explanation?.en || ''} onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)} placeholder="Why this is the correct answer..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60]" />
              </div>
            </div>
          ))}
        </div>

        <button onClick={addQuestion} className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-400 hover:border-[#D81B60] hover:text-[#D81B60] flex items-center justify-center gap-2 transition-colors"><Plus size={16} /> Add Question</button>

        <div className="flex gap-3 mt-6 justify-end">
          {error && <p className="text-sm font-bold text-red-500 mr-auto self-center">{error}</p>}
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#D81B60] text-white hover:bg-[#C2185B]">Save Quiz</button>
        </div>
      </div>
    </div>
  );
};

const QuizzesSection = ({ show }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [quizForm, setQuizForm] = useState(null); // null=closed, object=open

  const load = useCallback(async () => {
    try {
      const r = await axiosInstance.get('/admin/quizzes');
      setItems(toArray(r.data));
    } catch {
      show('Failed to load quizzes', 'error');
      setItems([]);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const togglePub = async (id) => {
    try { await axiosInstance.patch(`/admin/quizzes/${id}/publish`); show('Publish status toggled'); load(); } catch { show('Failed to toggle', 'error'); }
  };

  const del = async (id) => {
    try { await axiosInstance.delete(`/admin/quizzes/${id}`); show('Quiz deleted'); load(); } catch { show('Failed to delete', 'error'); }
    setConfirm(null);
  };

  const saveQuiz = async (data) => {
    try {
      const flattenText = (v) => (typeof v === 'object' && v !== null ? v.en || '' : v || '');
      const payload = {
        title: flattenText(data.title),
        description: flattenText(data.description),
        is_published: data.is_published,
        questions: (data.questions || []).map(q => ({
          id: q.id,
          text: flattenText(q.text),
          correct_option_id: q.correct_option_id,
          explanation: flattenText(q.explanation),
          options: (q.options || []).map(o => ({ id: o.id, text: flattenText(o.text) })),
        })),
      };
      if (data.id) { await axiosInstance.patch(`/admin/quizzes/${data.id}`, payload); show('Quiz updated'); }
      else { await axiosInstance.post('/admin/quizzes', payload); show('Quiz created'); }
      setQuizForm(null); load();
    } catch (err) {
      show(err?.response?.data?.detail || 'Failed to save quiz', 'error');
    }
  };

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      {quizForm !== null && <QuizFormModal initial={quizForm} onSave={saveQuiz} onClose={() => setQuizForm(null)} />}
      <button onClick={() => setQuizForm(makeEmptyQuiz())} className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D81B60] text-white text-sm font-bold hover:bg-[#C2185B]"><Plus size={16} /> New Quiz</button>
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : items.length === 0 ? <EmptyState icon={CheckCircle2} text="No quizzes yet" /> : (
        <div className="grid gap-3">
          {items.map(q => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-bold text-gray-800 text-sm">{q.title?.en || q.title || 'Untitled'}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{q.questions?.length || 0} questions</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={q.is_published ? 'green' : 'amber'}>{q.is_published ? 'Published' : 'Draft'}</Badge>
                <button onClick={() => setQuizForm(quizToForm(q))} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Edit quiz"><Edit3 size={15} /></button>
                <button onClick={() => togglePub(q.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="Toggle publish">
                  {q.is_published ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
                <button onClick={() => setConfirm({ msg: `Delete this quiz?`, fn: () => del(q.id) })} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   VIDEOS (New — backend pending)
   ═══════════════════════════════════════════════════════ */
const VideosSection = ({ show }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [backendReady, setBackendReady] = useState(true);

  const load = useCallback(async () => {
    try { const r = await axiosInstance.get('/admin/videos'); setItems(toArray(r.data)); }
    catch (err) { if (err.response?.status === 404 || err.response?.status === 405) { setBackendReady(false); } else { show('Failed to load videos', 'error'); } }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const extractYtId = (url) => {
    const input = typeof url === 'string' ? url : '';
    const m = input.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const save = async (data) => {
    try {
      const payload = { title: data.title, description: data.description, youtube_url: data.youtube_url, category: data.category, tags: data.tags?.split(',').map(t => t.trim()).filter(Boolean) || [] };
      if (data.id) { await axiosInstance.patch(`/admin/videos/${data.id}`, payload); show('Video updated'); }
      else { await axiosInstance.post('/admin/videos', payload); show('Video added'); }
      setForm(null); load();
    } catch { show('Failed to save', 'error'); }
  };

  const del = async (id) => {
    try { await axiosInstance.delete(`/admin/videos/${id}`); show('Video deleted'); load(); } catch { show('Failed to delete', 'error'); }
    setConfirm(null);
  };

  if (!backendReady) return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center">
      <Video size={36} className="mx-auto text-amber-400 mb-3" />
      <h3 className="font-bold text-amber-800 mb-1">Backend Not Ready</h3>
      <p className="text-sm text-amber-600">The <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">/api/admin/videos</code> endpoints haven't been created yet. See the backend handoff document.</p>
    </div>
  );

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      {form !== null && <ContentForm title={form.id ? 'Edit Video' : 'Add YouTube Video'} fields={['title', 'youtube_url', 'description', 'category', 'tags']} initial={form} onSave={save} onClose={() => setForm(null)} />}
      <button onClick={() => setForm({ title: '', youtube_url: '', description: '', category: 'basics', tags: '' })} className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D81B60] text-white text-sm font-bold hover:bg-[#C2185B]"><Plus size={16} /> Add Video</button>
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : items.length === 0 ? <EmptyState icon={Video} text="No videos yet" /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((v, idx) => (
            <div key={v.id || `video-${idx}`} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {extractYtId(v.youtube_url) && <img src={`https://img.youtube.com/vi/${extractYtId(v.youtube_url)}/hqdefault.jpg`} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-800 truncate">{toText(v.title) || 'Untitled'}</h3>
                <p className="text-xs text-gray-400 mt-1 truncate">{toText(v.description)}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge color="blue">{v.category || 'general'}</Badge>
                  <div className="flex gap-1">
                    <button onClick={() => setForm({ id: v.id, title: toText(v.title), youtube_url: typeof v.youtube_url === 'string' ? v.youtube_url : '', description: toText(v.description), category: v.category || 'basics', tags: toTagsText(v.tags) })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><Edit3 size={14} /></button>
                    <button onClick={() => setConfirm({ msg: `Delete "${toText(v.title) || 'this video'}"?`, fn: () => del(v.id) })} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   SCORES
   ═══════════════════════════════════════════════════════ */
const ScoresSection = ({ show }) => {
  const [scores, setScores] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [scoresSummary, setScoresSummary] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterQuizId, setFilterQuizId] = useState('');

  const fetchData = async (quizId = '') => {
    try {
      const qRes = await axiosInstance.get('/admin/quizzes');
      setQuizzes(qRes.data);

      const params = quizId ? `?quiz_id=${quizId}` : "";
      const sRes = await axiosInstance.get(`/admin/quiz-scores${params}`);
      setScores(sRes.data.scores);
      setScoresSummary({ total: sRes.data.total });

      if(!quizId) {
        const sumRes = await axiosInstance.get("/admin/quiz-scores/summary");
        setSummary(sumRes.data);
      }
    } catch {
       show('Failed to load score data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(filterQuizId);
  }, [filterQuizId]);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Attempts</div>
          <div className="text-3xl font-extrabold text-[#D81B60] mt-1">{summary?.total_attempts || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pass Rate</div>
          <div className="text-3xl font-extrabold text-green-500 mt-1">{summary?.overall_pass_rate || 0}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col justify-center items-center shadow-sm">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Avg Score</div>
          <div className="text-3xl font-extrabold text-blue-500 mt-1">{summary?.per_quiz?.[0]?.avg_score || 0}%</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <select 
          value={filterQuizId} 
          onChange={(e) => setFilterQuizId(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 focus:outline-none focus:border-[#D81B60]"
        >
          <option value="">All Quizzes</option>
          {quizzes.map(q => (
            <option key={q.id} value={q.id}>{q.title?.en || q.title || 'Untitled'}</option>
          ))}
        </select>
      </div>

      {loading ? <p className="text-sm text-gray-400">Loading...</p> : scores.length === 0 ? <EmptyState icon={Award} text="No scores found" /> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Quiz</th>
                <th className="text-left px-5 py-3">Student</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Score</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(score => (
                <tr key={score.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-bold text-gray-800">{score.quiz_title}</td>
                  <td className="px-5 py-3 text-gray-600">{score.user_name || "Anonymous"}</td>
                  <td className="px-5 py-3 text-gray-500">{score.user_email || "—"}</td>
                  <td className={`px-5 py-3 font-bold ${score.score >= 70 ? "text-green-600" : "text-red-600"}`}>
                    {score.score}%
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold
                      ${score.passed 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"}`}>
                      {score.passed ? "PASS" : "FAIL"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(score.submitted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

/* DEPRECATED BLOCKS DELETED */

/* ═══════════════════════════════════════════════════════
   FLAGGED POSTS
   ═══════════════════════════════════════════════════════ */
const FlaggedSection = ({ show }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    try { const r = await axiosInstance.get('/admin/community/flagged'); setItems(r.data); } catch { show('Failed to load flagged posts', 'error'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const clearFlag = async (id) => {
    try { await axiosInstance.patch(`/admin/community/${id}/clear-flag`); show('Flag cleared'); load(); } catch { show('Failed to clear flag', 'error'); }
  };
  const del = async (id) => {
    try { await axiosInstance.delete(`/admin/community/${id}`); show('Post deleted'); load(); } catch { show('Failed to delete', 'error'); }
    setConfirm(null);
  };

  return (
    <>
      {confirm && <Confirm message={confirm.msg} onYes={confirm.fn} onNo={() => setConfirm(null)} />}
      {loading ? <p className="text-sm text-gray-400">Loading...</p> : items.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <CheckCircle2 size={36} className="mx-auto text-green-400 mb-3" />
          <h3 className="font-bold text-green-800">All Clear!</h3>
          <p className="text-sm text-green-600">No flagged posts to review.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider">{items.length} flagged post{items.length > 1 ? 's' : ''} to review</p>
          {items.map(p => (
            <div key={p.id} className="bg-white rounded-xl border-2 border-red-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <h3 className="font-bold text-gray-800 text-sm">{p.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{expanded === p.id ? p.content : p.content?.substring(0, 150) + '...'}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge color="gray">{p.is_anonymous ? 'Anonymous' : p.author?.name || 'Unknown'}</Badge>
                    <Badge color="red">{p.flagged_by?.length || 0} flag{(p.flagged_by?.length || 0) > 1 ? 's' : ''}</Badge>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400" title="View"><Eye size={15} /></button>
                  <button onClick={() => clearFlag(p.id)} className="p-2 rounded-lg hover:bg-green-50 text-green-500" title="Clear flag"><CheckCircle2 size={15} /></button>
                  <button onClick={() => setConfirm({ msg: 'Permanently delete this post?', fn: () => del(p.id) })} className="p-2 rounded-lg hover:bg-red-50 text-red-400" title="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   SHARED FORM MODAL
   ═══════════════════════════════════════════════════════ */
const ContentForm = ({ title, fields, initial, onSave, onClose }) => {
  const [data, setData] = useState(initial);
  const set = (k, v) => setData(prev => ({ ...prev, [k]: v }));
  const labels = { title: 'Title', content: 'Content', category: 'Category', myth: 'Myth', fact: 'Fact', youtube_url: 'YouTube URL', description: 'Description', summary: 'Summary', author_name: 'Author Name', tags: 'Tags (comma separated)' };
  const largeFields = ['content', 'fact', 'myth', 'description', 'summary'];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{labels[f] || f}</label>
              {f === 'category' ? (
                <select value={data[f] || ''} onChange={e => set(f, e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60]">
                  {['general', 'basics', 'hygiene', 'nutrition', 'mental-health', 'myths', 'wellness'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : largeFields.includes(f) ? (
                <textarea value={data[f] || ''} onChange={e => set(f, e.target.value)} rows={4} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60] resize-y" />
              ) : (
                <input value={data[f] || ''} onChange={e => set(f, e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#D81B60]" />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
          <button onClick={() => onSave(data)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#D81B60] text-white hover:bg-[#C2185B]">Save</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

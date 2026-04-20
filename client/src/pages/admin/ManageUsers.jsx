import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Shield, Users } from 'lucide-react';
import adminService from '../../services/adminService';
import { formatDate, getInitials } from '../../lib/utils';
import { ROLES } from '../../utils/constants';
import { PageLoader } from '../../components/common/Loader';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter !== 'all') params.role = roleFilter;
      const res = await adminService.getUsers(params);
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      fetchUsers(pagination.current);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure? This will delete the user and all their data.')) return;
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted');
      fetchUsers(pagination.current);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    organizer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    attendee: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold mb-1">Manage Users</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-6">View and manage all platform users</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name or email..."
              />
            </div>
            <button type="submit" className="btn-primary">Search</button>
          </form>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input-field w-auto"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? <PageLoader /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--muted)/0.5)]">
                <tr>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">User</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Email</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Role</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Joined</th>
                  <th className="text-left text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[hsl(var(--border)/0.3)] hover:bg-[hsl(var(--muted)/0.3)] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(u.name)}
                        </div>
                        <span className="font-medium text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[hsl(var(--muted-foreground))]">{u.email}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className={`badge cursor-pointer border-0 outline-none ${roleColors[u.role]} text-xs py-1 px-2 rounded-full`}
                      >
                        <option value="attendee">Attendee</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-[hsl(var(--muted-foreground))]">{formatDate(u.createdAt)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3 opacity-50" />
              <p className="text-[hsl(var(--muted-foreground))]">No users found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-[hsl(var(--border)/0.3)]">
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchUsers(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                    pagination.current === i + 1 ? 'gradient-bg text-white' : 'hover:bg-[hsl(var(--muted))]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ManageUsers;

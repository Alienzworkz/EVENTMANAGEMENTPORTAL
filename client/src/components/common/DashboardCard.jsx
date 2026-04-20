import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon: Icon, trend, color = 'primary', index = 0 }) => {
  const colorMap = {
    primary: 'from-indigo-500 to-purple-600',
    success: 'from-emerald-500 to-teal-600',
    warning: 'from-amber-500 to-orange-600',
    danger: 'from-red-500 to-pink-600',
    info: 'from-blue-500 to-cyan-600',
  };

  const iconBgMap = {
    primary: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card p-6 relative overflow-hidden"
    >
      {/* Decorative gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colorMap[color]}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
          <motion.p
            key={value}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold"
          >
            {value}
          </motion.p>
          {trend && (
            <p className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgMap[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardCard;
